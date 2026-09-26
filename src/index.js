// 样式
import './assets/style/ui.css';
// 元数据部分样式
import './assets/style/metadata.css';
// 弹出设置框样式
import './assets/style/popup.css';

import { loadFFmpeg } from './assets/script/audio_file';
const ffmpegStatus = document.getElementById('ffmpeg-status');
loadFFmpeg().then((loaded) => {
	ffmpegStatus.dataset.state = loaded ? 'ready' : 'error';
	ffmpegStatus.textContent = loaded ? '就绪' : 'FFmpeg 加载失败';
});


// 事件
import './assets/script/event.js';