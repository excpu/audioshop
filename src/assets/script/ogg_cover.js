// 此文件用于生成OGG文件的METADATA_BLOCK_PICTURE的封面拓展字段
export default class OggCover {
    /**
     * 构建 METADATA_BLOCK_PICTURE 的 Base64 字段
     * @param {Uint8Array} imageData - 图片的 Uint8Array 数据
     * @param {string} mimeType - 图片的 MIME 类型，例如 "image/jpeg" 或 "image/png"
     * @param {string} description - 图片的描述
     * @param {number} width - 图片宽度
     * @param {number} height - 图片高度
     * @param {number} type - 图片类型 (0 表示 Other, 3 表示封面 Front Cover)
     * @returns {string} - Base64 编码的 METADATA_BLOCK_PICTURE 字段
     */
    static buildMetadataBlock(imageData, mimeType, description, width, height, type = 3) {
        const encoder = new TextEncoder();
        const mimeTypeBytes = encoder.encode(mimeType);
        const descriptionBytes = encoder.encode(description);
        const imageSize = imageData.byteLength;

        const buffer = new ArrayBuffer(
            4 + // 图片类型
            4 + mimeTypeBytes.length + // MIME 类型长度和内容
            4 + descriptionBytes.length + // 描述长度和内容
            4 + // 宽度
            4 + // 高度
            4 + // 色深
            4 + // 色板大小
            4 + // 图片数据大小
            imageSize // 图片数据
        );

        const view = new DataView(buffer);
        let offset = 0;

        // 写入图片类型
        view.setUint32(offset, type);
        offset += 4;

        // 写入 MIME 类型长度和内容
        view.setUint32(offset, mimeTypeBytes.length);
        offset += 4;
        new Uint8Array(buffer, offset, mimeTypeBytes.length).set(mimeTypeBytes);
        offset += mimeTypeBytes.length;

        // 写入描述长度和内容
        view.setUint32(offset, descriptionBytes.length);
        offset += 4;
        new Uint8Array(buffer, offset, descriptionBytes.length).set(descriptionBytes);
        offset += descriptionBytes.length;

        // 写入宽度
        view.setUint32(offset, width);
        offset += 4;

        // 写入高度
        view.setUint32(offset, height);
        offset += 4;

        // 写入色深（假设未知，设置为 0）
        view.setUint32(offset, 0);
        offset += 4;

        // 写入色板大小（假设未知，设置为 0）
        view.setUint32(offset, 0);
        offset += 4;

        // 写入图片数据大小
        view.setUint32(offset, imageSize);
        offset += 4;

        // 写入图片数据
        new Uint8Array(buffer, offset, imageSize).set(imageData);

        // 将二进制数据转换为 Base64 编码
        return this.arrayBufferToBase64(buffer);
    }

    static arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
}
