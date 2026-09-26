import AudioFile from "./audio_file";
import Setting from "./setting";

let setting = Setting;

export default class FileProcess {
    constructor() {
        this.counter = 0;
        this.fileList = [];
        this.convertingIds = new Set();
        // 当前选中的在编辑元数据的文件
        this.display = null;
        this.onDisplayCleared = null;
    }

    // 重新对已存在的文件 ID 进行归一化，避免删除任务后留下断裂的计数器值
    reindexCounter() {
        const maxId = this.fileList.reduce((max, item) => {
            if (!item || item[0] == null) return max;
            return Math.max(max, Number(item[0]));
        }, -1);
        this.counter = maxId + 1;
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
                    this.reindexCounter();
                }
            }
        }
        console.log(this.fileList);
    }
    clear() {
        this.fileList = [];
        this.counter = 0;
        this.convertingIds.clear();
        this.display = null;
        document.getElementById('file-list-body').innerHTML = '';
        if (this.onDisplayCleared) this.onDisplayCleared();
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
    getFileEntryById(id) {
        const index = this.findIndexById(id);
        if (index === -1) return null;
        const entry = this.fileList[index];
        return entry && entry[1] ? entry : null;
    }

    updateTag(data) {
        const entry = this.getFileEntryById(this.display);
        if (!entry) {
            //throw ('Unable to update tag due to a unselected item.');
            return false;
        }
        entry[1].updateTag(data);
        // 在UI界面上直观显示修改
        const row = document.getElementById(`file-list-child-no${this.display}`);
        if (!row) return true;
        row.children[0].innerHTML = data.artist;
        row.children[1].innerHTML = data.title;
        row.children[2].innerHTML = data.track;
        return true;
    }

    // 更换封面：立即写入当前选中文件的元数据并返回可预览的地址
    async updateCover(file) {
        const entry = this.getFileEntryById(this.display);
        if (!entry) {
            return { status: false };
        }
        await entry[1].updataCover(file);
        return entry[1].getCoverUrl();
    }

    // 按文件真实 id（而非数组下标）查找其在 fileList 中的位置
    // 转换完成的文件会被移除，导致数组下标与 id 不再一一对应
    findIndexById(id) {
        if (id == null) return -1;
        return this.fileList.findIndex(item => item && item[0] === Number(id));
    }

    // 使用当前编码设置逐个转换列表内的文件，转换成功后下载并从列表移除
    // onProgress({ index, total, currentProgress }) 用于上报总进度与当前任务进度
    async convertAll(onProgress) {
        const format = setting.setting.encoder;
        const codec = setting.setting.codec[format];
        // 复制一份仅保存对象引用的队列，避免在转换过程中因 removeFile() 改变原数组导致索引错乱
        const queue = this.fileList.map(([id, audioFileObj]) => ({ id, audioFileObj }));
        const total = queue.length;
        for (let i = 0; i < queue.length; i++) {
            const { id, audioFileObj } = queue[i];
            if (!audioFileObj) {
                continue;
            }
            this.setRowConverting(id, true);
            try {
                const result = await audioFileObj.encode(format, codec, (currentProgress) => {
                    if (onProgress) onProgress({ index: i, total, currentProgress });
                });
                this.downloadResult(result);
            } catch (error) {
                console.error(`转换失败: ${audioFileObj.file ? audioFileObj.file.name : id}`, error);
                this.setRowConverting(id, false);
                continue;
            }
            this.removeFile(id, true);
            if (onProgress) onProgress({ index: i + 1, total, currentProgress: 0 });
        }
    }

    // 给正在处理的行添加/移除高亮样式，让用户能直观看到当前处理中的任务
    setRowConverting(id, active) {
        if (active) {
            this.convertingIds.add(Number(id));
        } else {
            this.convertingIds.delete(Number(id));
        }
        const row = document.getElementById(`file-list-child-no${id}`);
        if (!row) return;
        row.classList.toggle('converting', active);
    }

    // 触发浏览器下载，下载启动后及时释放 Blob URL
    downloadResult({ data, fileName }) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // 从列表中移除已转换完成的项，并释放底层文件与封面资源
    removeFile(id, allowConverting = false) {
        if (!allowConverting && this.convertingIds.has(Number(id))) {
            return false;
        }
        const index = this.findIndexById(id);
        if (index === -1) {
            const row = document.getElementById(`file-list-child-no${id}`);
            if (row) row.remove();
            return false;
        }
        const entry = this.fileList[index];
        if (entry && entry[1]) {
            entry[1].destroy();
        }
        this.fileList.splice(index, 1);
        this.convertingIds.delete(Number(id));
        this.reindexCounter();
        const row = document.getElementById(`file-list-child-no${id}`);
        if (row) row.remove();
        if (this.display === Number(id)) {
            this.display = null;
            if (this.onDisplayCleared) this.onDisplayCleared();
        }
        return true;
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
        const entry = this.getFileEntryById(id);
        if (!entry) {
            this.display = null;
            return;
        }
        const audioFileObj = entry[1];
        tagShow.artist.value = audioFileObj.tags.artist;
        tagShow.title.value = audioFileObj.tags.title;
        tagShow.album.value = audioFileObj.tags.album;
        tagShow.track.value = audioFileObj.tags.track;
        tagShow.year.value = audioFileObj.tags.year;
        tagShow.comment.value = audioFileObj.tags.comment;
        //显示封面
        let coverUrl = audioFileObj.getCoverUrl();
        if (coverUrl.status) {
            console.log(coverUrl);
            tagShow.cover.src = coverUrl.url;
        }
        //保存当前选中的项目
        this.display = Number(id);
    }
}