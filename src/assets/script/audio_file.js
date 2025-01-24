import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

var ffmpeg = null;
//https://vip.123pan.cn/1816497153/OSS/lib/ffmpeg-core/dist/esm
export async function loadFFmpeg() {
    const baseURL = 'https://tools.5share.site/open-asset/ffmpeg-core/dist/esm';
    ffmpeg = new FFmpeg();
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        //wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    ffmpeg.on('log', ({ message }) => {
        console.log(message);
    });
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

    }

    getCoverUrl() {
        if (this.tags.cover.contain) {
            return {
                status: true,
                url: this.uint8ArrayToBlobUrl(this.tags.cover.data, this.tags.cover.type),
            };
        } else {
            this.coverStatus = false;
            return {
                status: false,
            };
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