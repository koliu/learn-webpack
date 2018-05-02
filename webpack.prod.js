const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devServer: {
        contentBase: "./learn-1/public",
        historyApiFallback: true,
        inline: true,
        port: 38080,
    },

    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究！'),
    ],
});