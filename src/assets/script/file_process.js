import AudioFile from "./audio_file";

export default class FileProcess {
    constructor() {
        this.counter = 0;
        this.fileList = [];
    }
    // files 直接传入多个文件的数组
    async addNew(files) {
        for (let i = 0; i < files.length; i++) {
            let audioFileObj = new AudioFile(files[i]);

            if (audioFileObj.supported) {
                await audioFileObj.getMediaTag();
                if (audioFileObj.tagDataStatus) {
                    this.fileList.push([this.counter, audioFileObj]);
                    this.fileShow(this.counter, audioFileObj.tags.artist, audioFileObj.tags.title, audioFileObj.tags.track, this.formatSeconds(audioFileObj.metadata.format.duration), this.bytesToMB(files[i].size));
                    this.counter += 1;
                }
            }
        }
        console.log(this.fileList);
    }
    clear() {
        this.fileList = [];
        this.counter = 0;
        document.getElementById('file-list-body').innerHTML = '';
    }

    // 秒转分钟
    formatSeconds(seconds) {
        const minutes = Math.floor(seconds / 60); // 计算分钟
        const remainingSeconds = Math.round(seconds % 60); // 四舍五入剩余秒数
        // 格式化秒数为两位数
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    }

    // 转换为MB
    bytesToMB(bytes) {
        return (bytes / (1024 * 1024)).toFixed(1); // 1 MB = 1024 KB = 1024 * 1024 Bytes
    }

    // 更新
    updateTag(id, prop) {
        if(prop = "artist"){
            
        }
    }

    // 后期迁移 - DOM操作
    fileShow(id, artist, title, number, length, size) {
        const fileListBody = document.getElementById('file-list-body');
        let node = `
                <tr data-id="${id}" class="file-list-child" >
                    <td>${artist}</td>
                    <td>${title}</td>
                    <td>${number}</td>
                    <td>${length}</td>
                    <td>${size}MB</td>
                </tr>
            `;
        fileListBody.insertAdjacentHTML('beforeend', node);
    }

    // 显示到输入框
    showTagDetail(id, tagShow) {
        tagShow.artist.value = this.fileList[id][1].tags.artist;
        tagShow.title.value = this.fileList[id][1].tags.title;
        tagShow.track.value = this.fileList[id][1].tags.track;
        tagShow.year.value = this.fileList[id][1].tags.year;
        tagShow.comment.value = this.fileList[id][1].tags.comment;
    }
}