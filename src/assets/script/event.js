const fileListBody = document.getElementById('file-list-body');
const addFiles = document.getElementById('add-files');
const clearFiles = document.getElementById('clear-files');
const fileInput = document.getElementById('file-input');
const saveMetadata = document.getElementById('save-metadata');
const encoderSelector = document.getElementById('encoder-selector');
const coverEle = document.getElementById('element-cover');
const coverInput = document.getElementById('cover-input');

const tagShow = {
    artist: document.getElementById('element-artist'),
    title: document.getElementById('element-title'),
    album: document.getElementById('element-album'),
    track: document.getElementById('element-track'),
    year: document.getElementById('element-year'),
    comment: document.getElementById('element-comment'),
    cover: document.getElementById('element-cover'),
}


import FileProcess from './file_process';
const fileProcess = new FileProcess();
import Values from './values';
const values = new Values();
import Setting from "./setting";
let setting = new Setting();

// 文件列表被点击
fileListBody.addEventListener('click', function (event) {
    console.log(event.target.parentNode);
    values.currentEditing = event.target.parentNode.dataset.id;
    console.log(values.currentEditing);
    fileProcess.showTagDetail(values.currentEditing, tagShow);
});

// 选取文件
addFiles.addEventListener('click', function () {
    fileInput.click();
});
fileInput.addEventListener('change', function (event) {
    fileProcess.addNew(event.target.files);
});

// 清空文件
clearFiles.addEventListener('click', function () {
    fileProcess.clear();
});

// 保存元数据
saveMetadata.addEventListener('click', function () {
    let data = {
        artist: tagShow.artist.value,
        title: tagShow.title.value,
        album: tagShow.album.value,
        track: tagShow.track.value,
        year: tagShow.year.value,
        comment: tagShow.comment.value,
    };
    fileProcess.updateTag(data);
});

// 封面更换 (更换封面独立于其他元数据处理)
coverEle.addEventListener('click', function () {
    coverInput.click();
});

//读取设置
encoderSelector.value = setting.setting.encoder;
encoderChange();





// 加载行为，清空选择框
tagShow.artist.value = '';
tagShow.title.value = '';
tagShow.album.value = '';
tagShow.comment.value = '';
tagShow.track.value = '';
tagShow.year.value = '';


// 选择编码器
function encoderChange() {
    encoderSelector.addEventListener('change', function (event) {
        setting.updateEncoder(event.target.value);
    });
}

// 编码器详细参数设置

