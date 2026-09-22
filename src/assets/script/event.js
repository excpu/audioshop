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
import { isFFmpegLoaded } from './audio_file';
const fileProcess = new FileProcess();
import Values from './values';
const values = new Values();
import Setting from "./setting";
let setting = Setting;

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
coverInput.addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const result = await fileProcess.updateCover(file);
    if (result.status) {
        tagShow.cover.src = result.url;
    }
    // 允许连续选择同一张图片也能触发 change
    coverInput.value = '';
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

// 开始转换：使用当前编码设置转码列表内全部文件，完成后自动下载并移出列表
const startConvert = document.getElementById('start-convert');
const operationStatus = document.querySelector('.operation-status');
const currentProgressBar = document.getElementById('current-progress');
const totalProgressBar = document.getElementById('total-progress');
startConvert.addEventListener('click', async function () {
    if (startConvert.disabled) return;
    if (!isFFmpegLoaded()) {
        alert('FFmpeg 尚未加载完成，请稍后再点击转换。');
        console.warn('转换请求被阻止：FFmpeg 尚未加载完成。');
        return;
    }
    startConvert.disabled = true;
    operationStatus.textContent = '正在转换...';
    currentProgressBar.value = 0;
    totalProgressBar.value = 0;
    try {
        await fileProcess.convertAll(function ({ index, total, currentProgress }) {
            currentProgressBar.value = Math.round(currentProgress * 100);
            totalProgressBar.value = total ? Math.round(((index + currentProgress) / total) * 100) : 0;
        });
        operationStatus.textContent = '转换完成';
        currentProgressBar.value = 0;
        totalProgressBar.value = 100;
    } catch (error) {
        console.error(error);
        operationStatus.textContent = '转换失败';
    } finally {
        startConvert.disabled = false;
    }
});

// 编码器详细参数设置
const encodeSettingBtn = document.getElementById('encode-setting-btn');
const codecPopup = document.querySelector('.popup');
const saveCodecSetting = document.getElementById('save-codec-setting');

// 每种格式对应的参数面板，以及面板内各输入框与设置字段的映射关系
const codecPanels = {
    mp3: { panel: 'mp3-parameter', fields: { method: 'mp3-method', quality: 'mp3-quality', birate: 'mp3-birate' } },
    aac: { panel: 'aac-parameter', fields: { container: 'aac-container', method: 'aac-method', quality: 'aac-quality', birate: 'aac-birate' } },
    // ogg: { panel: 'ogg-parameter', fields: { method: 'ogg-method', quality: 'ogg-quality', birate: 'ogg-birate' } },
    // opus: { panel: 'opus-parameter', fields: { method: 'opus-method', birate: 'opus-birate' } },
    flac: { panel: 'flac-parameter', fields: { compression: 'flac-compression' } },
    wav: { panel: 'wav-parameter', fields: {} },
};

// 打开编码设置弹窗，展示当前所选格式的参数面板并回填已保存的值
encodeSettingBtn.addEventListener('click', function () {
    const format = encoderSelector.value;
    Object.values(codecPanels).forEach(function (item) {
        document.getElementById(item.panel).classList.add('pop-hide');
    });
    const current = codecPanels[format];
    if (!current) return;
    document.getElementById(current.panel).classList.remove('pop-hide');
    const saved = setting.setting.codec[format];
    if (saved) {
        Object.keys(current.fields).forEach(function (key) {
            document.getElementById(current.fields[key]).value = saved[key];
        });
    }
    toggleMethodRows(current);
    codecPopup.style.display = 'flex';
});

// 根据 VBR/CBR 切换质量、码率行的显隐：VBR 隐藏码率，CBR 隐藏质量
// 部分格式（如 OPUS）没有质量参数，此时码率始终显示
function toggleMethodRows(current) {
    if (!current.fields.method) return;
    const methodEle = document.getElementById(current.fields.method);
    const panel = document.getElementById(current.panel);
    const qualityRow = panel.querySelector('[data-field="quality"]');
    const birateRow = panel.querySelector('[data-field="birate"]');
    const isVbr = methodEle.value === 'vbr';
    if (qualityRow) qualityRow.style.display = isVbr ? '' : 'none';
    if (birateRow) birateRow.style.display = (qualityRow && isVbr) ? 'none' : '';
    methodEle.onchange = function () {
        toggleMethodRows(current);
    };
}

// 保存编码设置并关闭弹窗
saveCodecSetting.addEventListener('click', function () {
    const format = encoderSelector.value;
    const current = codecPanels[format];
    if (current && setting.setting.codec[format]) {
        Object.keys(current.fields).forEach(function (key) {
            setting.setting.codec[format][key] = document.getElementById(current.fields[key]).value;
        });
        setting.updateSetting();
    }
    codecPopup.style.display = 'none';
});

// 点击弹窗外部区域关闭
codecPopup.addEventListener('click', function (event) {
    if (event.target === codecPopup) {
        codecPopup.style.display = 'none';
    }
});

// 编码器详细参数设置

