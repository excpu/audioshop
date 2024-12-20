const fileListBody = document.getElementById('file-list-body');
const addFiles = document.getElementById('add-files');
const clearFiles = document.getElementById('clear-files');
const fileInput = document.getElementById('file-input');

const tagShow = {
    artist: document.getElementById('element-artist'),
    title: document.getElementById('element-title'),
    track: document.getElementById('element-track'),
    year: document.getElementById('element-year'),
    comment: document.getElementById('element-comment'),
}


import FileProcess from './file_process';
const fileProcess = new FileProcess();
import Values from './values';
const values = new Values();

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



// 加载行为，清空选择框
tagShow.artist.value = '';
tagShow.title.value = '';
tagShow.comment.value = '';
tagShow.track.value = '';
tagShow.year.value = '';
