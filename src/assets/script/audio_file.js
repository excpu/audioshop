import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import OggCover from './ogg_cover';
import Setting from './setting';

var ffmpeg = null;
var ffmpegReady = false;
//https://vip.123pan.cn/1816497153/OSS/lib/ffmpeg-core/dist/esm
export async function loadFFmpeg() {
    const baseURL = 'https://tools.5share.site/open-asset/ffmpeg-core/dist/esm';
    ffmpeg = new FFmpeg();
    try {
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            //wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        ffmpegReady = true;
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        return true;
    } catch (error) {
        ffmpegReady = false;
        console.error('FFmpeg 加载失败:', error);
        return false;
    }
}

export function isFFmpegLoaded() {
    return ffmpegReady;
}


import { parseBlob } from 'music-metadata';


export default class AudioFile {
    /**
   * 构建音频文件
   * @param {File} file - 音频文件对象（File 对象通常是从 <input type="file"> 获取的）
   */
    constructor(file) {
        //常量
        const supportedEct = ['mp3', 'ogg', 'flac', 'wav', 'ape', 'ogg', 'opus', 'wav', 'mp3', 'alac', 'm4a', 'aac', 'ac3', 'aif', 'eac3', 'thd', 'mpc', 'aiff', 'aif', 'aifc', 'spx'];
        //判断字段
        this.file = file;
        this.tagDataStatus = false;
        //命名规则：Math.random() + 当前时间戳 + 原文件名
        this.uniqueName = `${Math.random()}-${new Date().getTime()}-${file.name}`;
        this.fileExt = file.name.split('.').pop().toLowerCase();
        this.filePre = file.name.replace(/\.[^/.]+$/, '');
        //用户选择的名字
        this.prefrredName = null;
        //判断是否为支持格式
        if (supportedEct.some(item => item === this.fileExt)) {
            this.supported = true;
        } else {
            // 格式不被支持
            this.supported = false;
        }
    }

    async getMediaTag() {
        try {
            this.metadata = await parseBlob(this.file);
            this.tagDataStatus = true;
            this.customTags();
        } catch (error) {
            console.error('Error parsing metadata:', error.message);
        }
    }

    customTags() {
        this.tags = {
            title: this.metadata.common.title || this.filePre,
            artist: this.metadata.common.artist ?? "",
            album: this.metadata.common.album ?? "",
            track: this.metadata.common.track.no ?? "",
            year: this.metadata.common.date ?? "",
            comment: Array.isArray(this.metadata.common.comment) && this.metadata.common.comment.length > 0
                ? this.metadata.common.comment[0].text
                : "",
            cover: {
                contain: false,
                type: null,
                data: null,
            }
        }
        this.tags.track = String(this.tags.track);

        if (Array.isArray(this.metadata.common.picture)) {
            this.tags.cover.contain = true;
            this.tags.cover.type = this.metadata.common.picture[0].format;
            this.tags.cover.data = this.metadata.common.picture[0].data;
        }

        console.log(this.tags);
    }

    updateTag(data) {
        this.tags.artist = data.artist;
        this.tags.album = data.album;
        this.tags.title = data.title;
        this.tags.track = data.track;
        this.tags.year = data.year;
        this.tags.comment = data.comment;

    }

    async updataCover(file) {
        const buffer = await this.readFileAsync(file);
        this.tags.cover.contain = true;
        this.tags.cover.type = file.type;
        this.tags.cover.data = new Uint8Array(buffer);
    }

    getCoverUrl() {
        if (this.tags.cover.contain) {
            // 每次生成新预览前释放上一个 Blob URL，避免累积泄漏
            if (this.coverBlobUrl) {
                URL.revokeObjectURL(this.coverBlobUrl);
            }
            this.coverBlobUrl = this.uint8ArrayToBlobUrl(this.tags.cover.data, this.tags.cover.type);
            return {
                status: true,
                url: this.coverBlobUrl,
            };
        } else {
            this.coverStatus = false;
            return {
                status: false,
            };
        }
    }

    // 依据当前编码设置调用 ffmpeg.wasm 转码，返回编码结果数据与建议文件名
    // onProgress(fraction: 0~1) 用于上报当前任务的编码进度
    async encode(format, codec, onProgress) {
        if (!ffmpeg) {
            throw new Error('FFmpeg 尚未加载完成');
        }
        const safeName = (name) => name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const ext = format === 'aac' ? codec.container : format;
        const inputName = safeName(`in_${this.uniqueName}`);
        const outputName = safeName(`out_${this.uniqueName}.${ext}`);
        let coverName = null;

        const progressHandler = ({ progress }) => {
            if (onProgress) onProgress(Math.min(1, Math.max(0, progress)));
        };
        ffmpeg.on('progress', progressHandler);

        await ffmpeg.writeFile(inputName, await fetchFile(this.file));

        const args = ['-i', inputName];

        // 只有支持 attached_pic 的容器才允许把封面作为第二路视频流写入。
        // OGG / OPUS 不支持附加图片视频流，必须写入 Vorbis Comment 的 METADATA_BLOCK_PICTURE 字段。
        const coverSupportedFormats = ['mp3', 'flac', 'aac'];
        if (coverSupportedFormats.includes(format) && this.tags.cover.contain) {
            coverName = safeName(`cover_${this.uniqueName}`);
            await ffmpeg.writeFile(coverName, this.tags.cover.data);
            args.push('-i', coverName, '-map', '0:a', '-map', '1:v', '-c:v', 'copy', '-disposition:v', 'attached_pic');
        }

        args.push(...this.buildEncodeArgs(format, codec));

        const metadataArgs = [
            '-metadata', `title=${this.tags.title || ''}`,
            '-metadata', `artist=${this.tags.artist || ''}`,
            '-metadata', `album=${this.tags.album || ''}`,
            '-metadata', `track=${this.tags.track || ''}`,
            '-metadata', `date=${this.tags.year || ''}`,
            '-metadata', `comment=${this.tags.comment || ''}`,
        ];

        if ((format === 'ogg' || format === 'opus') && this.tags.cover.contain && this.tags.cover.data) {
            const picture = OggCover.buildMetadataBlock(
                this.tags.cover.data,
                this.tags.cover.type || 'image/jpeg',
                this.tags.title || 'cover',
                0,
                0,
                3,
            );
            metadataArgs.push('-metadata', `METADATA_BLOCK_PICTURE=${picture}`);
        }

        args.push(...metadataArgs);
        args.push(outputName);

        try {
            await ffmpeg.exec(args);
            const data = await ffmpeg.readFile(outputName);
            if (onProgress) onProgress(1);
            return {
                data,
                fileName: `${this.buildOutputBaseName()}.${ext}`,
            };
        } catch (error) {
            console.error(`FFmpeg 转码失败: format=${format}, codec=`, codec, error);
            throw error;
        } finally {
            // 转码结束后清理虚拟文件系统内的临时文件，防止内存持续增长
            ffmpeg.off('progress', progressHandler);
            await this.safeDeleteFile(inputName);
            await this.safeDeleteFile(outputName);
            if (coverName) await this.safeDeleteFile(coverName);
        }
    }

    buildOutputBaseName() {
        const outputName = Setting.setting.outputName || { mode: 'original', custom: '' };
        const artist = this.tags.artist || '';
        const title = this.tags.title || this.filePre;
        let baseName;

        switch (outputName.mode) {
            case 'artist-title':
                baseName = `${artist} - ${title}`;
                break;
            case 'title-artist':
                baseName = `${title} - ${artist}`;
                break;
            case 'custom':
                baseName = (outputName.custom || this.filePre)
                    .replace(/\{artist\}/gi, artist)
                    .replace(/\{title\}/gi, title)
                    .replace(/\{album\}/gi, this.tags.album || '')
                    .replace(/\{track\}/gi, this.tags.track || '');
                break;
            case 'original':
            default:
                baseName = this.filePre;
        }

        const sanitized = baseName
            .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
            .replace(/[. ]+$/g, '')
            .trim();
        return this.prefrredName || sanitized || this.filePre;
    }

    // 依据格式与编码参数生成 ffmpeg 编码相关参数
    buildEncodeArgs(format, codec) {
        switch (format) {
            case 'mp3':
                return codec.method === 'cbr'
                    ? ['-c:a', 'libmp3lame', '-b:a', `${codec.birate}k`]
                    : ['-c:a', 'libmp3lame', '-q:a', `${codec.quality}`];
            case 'aac':
                return codec.method === 'cbr'
                    ? ['-c:a', 'aac', '-b:a', `${codec.birate}k`]
                    : ['-c:a', 'aac', '-q:a', `${Math.max(0.1, (10 - Number(codec.quality)) / 5)}`];
            case 'ogg':
                return codec.method === 'cbr'
                    ? ['-c:a', 'libvorbis', '-b:a', `${codec.birate}k`, '-f', 'ogg']
                    : ['-c:a', 'libvorbis', '-q:a', `${Math.max(0, Math.min(10, Number(codec.quality) || 5))}`, '-f', 'ogg'];
            case 'opus':
                return ['-c:a', 'libopus', '-b:a', `${codec.birate}k`, '-vbr', codec.method === 'cbr' ? 'off' : 'on', '-f', 'ogg'];
            case 'flac':
                return ['-c:a', 'flac', '-compression_level', `${codec.compression}`];
            case 'wav':
                return ['-c:a', 'pcm_s16le'];
            default:
                return [];
        }
    }

    // 删除 ffmpeg 虚拟文件系统中的文件，文件不存在时忽略
    async safeDeleteFile(name) {
        try {
            await ffmpeg.deleteFile(name);
        } catch (error) {
            console.warn(`清理临时文件失败: ${name}`, error);
        }
    }

    getOriginalBlob() {
        this.orginalBlod = url
    }


    setName(name) {
        this.prefrredName = name;
    }

    getSetName() {

    }

    getOriginalName() {

    }

    destroy() {
        this.file = null;
        if (this.coverBlobUrl) {
            URL.revokeObjectURL(this.coverBlobUrl);
            this.coverBlobUrl = null;
        }
        if (this.tags) {
            this.tags.cover.data = null;
        }
    }

    // 工具方法
    uint8ArrayToBlobUrl(uint8Array, mimeType) {
        // 创建 Blob 对象
        const blob = new Blob([uint8Array], { type: mimeType });

        // 创建 Blob URL
        const blobUrl = URL.createObjectURL(blob);

        return blobUrl;
    }

    readFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // 成功读取
            reader.onload = () => resolve(reader.result);

            // 读取失败
            reader.onerror = () => reject(reader.error);

            // 开始读取文件为 ArrayBuffer
            reader.readAsArrayBuffer(file);
        });
    }
}