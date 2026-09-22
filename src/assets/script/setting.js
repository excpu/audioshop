class Setting {
    constructor() {
        //如果没有保存的设置，创建默认设置
        if (localStorage.audioshop == null) {
            this.setting = {
                encoder: "mp3",
                wasmPath: "https://tools.5share.site/open-asset/ffmpeg-core/dist/esm",
                codec: {
                    mp3: {
                        method: "vbr",
                        quality: "0",
                        birate: "320",
                    },
                    ogg: {
                        method: "vbr",
                        quality: "10",
                        birate: "320",
                    },
                    aac: {
                        container: "m4a",
                        method: "vbr",
                        quality: "5",
                        birate: "320",
                    },
                    opus: {
                        method: "vbr",
                        birate: "512",
                    },
                    flac: {
                        compression: "5",
                    },
                },
            };
            let settingString = JSON.stringify(this.setting);
            localStorage.setItem('audioshop', settingString);
        } else {
            this.setting = JSON.parse(localStorage.audioshop);
        }
    }

    updateSetting() {
        localStorage.setItem('audioshop', JSON.stringify(this.setting));
    }

    updateEncoder(encoder){
        this.setting.encoder = encoder;
        this.updateSetting();
    }
}

// 以单例形式导出，避免各模块各自持有一份互不同步的设置副本
export default new Setting();