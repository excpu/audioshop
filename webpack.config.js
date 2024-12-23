const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // 自动清理旧的 dist 文件
    },
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // 指定模板文件
            filename: 'index.html', // 输出文件名
            favicon: './src/assets/image/icon.webp', // 网站图标
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader', // 解析 HTML 文件中的资源路径
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // 处理 CSS 文件
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                type: 'asset/resource', // 将文件输出到 output.path
                generator: {
                    filename: 'images/[name].[hash:7][ext][query]' // 输出到 images 文件夹
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'], // 处理现代 JS 语法
                    },
                },
            },
            {
                test: /\.wasm$/,
                type: "asset/resource", // 处理 WebAssembly 文件
            },
        ],
    },
    experiments: {
        asyncWebAssembly: true, // 支持 WebAssembly 异步加载
    },
};
