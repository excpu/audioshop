import AudioFile from "./audio_file";
import Setting from "./setting";

let setting = new Setting();

export default class FileProcess {
    constructor() {
        this.counter = 0;
        this.fileList = [];
        // 当前选中的在编辑元数据的文件
        this.display = null;
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
    updateTag(data) {
        if (this.display != null) {
            this.fileList[this.display][1].updateTag(data);
        } else {
            //throw ('Unable to update tag due to a unselected item.');
            return false;
        }
        // 在UI界面上直观显示修改
        document.getElementById(`file-list-child-no${this.display}`).children[0].innerHTML = data.artist;
        document.getElementById(`file-list-child-no${this.display}`).children[1].innerHTML = data.title;
        document.getElementById(`file-list-child-no${this.display}`).children[2].innerHTML = data.track;
    }

    // 后期迁移 - DOM操作
    fileShow(id, artist, title, number, length, size) {
        const fileListBody = document.getElementById('file-list-body');
        let node = `
                <tr data-id="${id}" class="file-list-child" id="file-list-child-no${id}">
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
        tagShow.album.value = this.fileList[id][1].tags.album;
        tagShow.track.value = this.fileList[id][1].tags.track;
        tagShow.year.value = this.fileList[id][1].tags.year;
        tagShow.comment.value = this.fileList[id][1].tags.comment;
        //显示封面
        let coverUrl = this.fileList[id][1].getCoverUrl();
        if (coverUrl.status) {
            console.log(coverUrl);
            tagShow.cover.src = coverUrl.url;
        }
        //保存当前选中的项目
        this.display = id;
    }
}