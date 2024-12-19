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
        //命名规则：Math.random()的MD5数值 + 当前时间戳 + 原文件名
        this.uniqueName = `${md5(String(Math.random()))}-${new Date().getTime()}-${file.name}`;
        this.fileExt = file.name.split('.').pop().toLowerCase();
        this.filePre = file.name.replace(/\.[^/.]+$/, '');
        //用户选择的名字
        this.prefrredName = null;
        //判断是否为支持格式
        //元数据
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