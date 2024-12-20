const fileListBody = document.getElementById('file-list-body');
const addFiles = document.getElementById('add-files');
const fileInput = document.getElementById('file-input');

import FileProcess from './file_process';
const fileProcess = new FileProcess();
import Values from './values';
const values = new Values();

// 文件列表被点击
fileListBody.addEventListener('click', function (event) {
    console.log(event.target.parentNode);
    values.currentEditing = event.target.parentNode.dataset.id;
    console.log(values.currentEditing);
    fileProcess.showTagDetail();
});

// 选取文件
addFiles.addEventListener('click', function () {
    fileInput.click();
});
fileInput.addEventListener('change', function (event) {
    fileProcess.addNew(event.target.files);
});

// 当选内容被更新，实时更新到页面