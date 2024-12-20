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
            track: this.metadata.common.track.no ?? "",
            year: this.metadata.common.date ?? "",
            comment: this.metadata.common.comment[0].text ?? "",
        }
        this.tags.track = String(this.tags.track);

        console.log(this.tags);
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
}