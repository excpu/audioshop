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
   * @returns {boolean} true 表示创建成功；false 表示构建错误或此文件不被支持
   */
    constructor(file) {
        //常量
        const supportedEct = ['mp3', 'ogg', 'flac', 'wav', 'ape', 'ogg', 'opus', 'wav', 'mp3', 'alac', 'm4a', 'aac', 'ac3', 'aif', 'eac3', 'thd', 'mpc', 'aiff', 'aif', 'aifc', 'spx'];
        //判断字段
        this.file = file;
        this.tagDataStatus = false;
        //命名规则：Math.random()的MD5数值 + 当前时间戳 + 原文件名
        this.uniqueName = `${md5(String(Math.random()))}-${new Date().getTime()}-${file.name}`;
        this.fileExt = file.name.split('.').pop().toLowerCase();
        this.filePre = file.name.replace(/\.[^/.]+$/, '');
        //用户选择的名字
        this.prefrredName = null;
        //判断是否为支持格式
        if (supportedEct.some(item => item === this.fileExt)) {
            //元数据
            this.getMediaTag();
        } else {
            return false;
        }
    }

    async getMediaTag() {
        try {
            const metadata = await parseBlob(this.file);
            this.tagDataStatus = true;
            console.log(metadata);
        } catch (error) {
            console.error('Error parsing metadata:', error.message);
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
}