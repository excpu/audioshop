# 音码通

在浏览器中批量转换音频，并编辑音频元数据与封面。

[在线体验](https://tools.5share.site/audioshop/)

## 功能

### 音频转码

#### 输入格式

应用当前接收以下音频扩展名：

`mp3`、`ogg`、`flac`、`wav`、`ape`、`opus`、`alac`、`m4a`、`aac`、`ac3`、`eac3`、`thd`、`mpc`、`aif`、`aiff`、`aifc`、`spx`

实际可解码格式取决于部署时加载的 FFmpeg core 及其编译选项；若 core 未包含相应解码器，转换可能失败。

#### 输出格式

| 格式 | 编码器 / 容器 | 状态 |
| --- | --- | --- |
| MP3 | `libmp3lame` | 可用 |
| AAC | AAC，输出为 M4A | 可用 |
| FLAC | FLAC | 可用 |
| WAV | PCM | 可用 |
| OGG / Vorbis | Vorbis | 暂未开放 |
| Opus | Opus | 暂未开放 |

OGG/Vorbis 与 Opus 的封面写入仍需完善，暂不在界面开放。

### 音频管理

- 修改歌手、标题、专辑、音轨号、年份和备注等元数据
- 查看或替换音频封面
- 自定义转码后的文件名