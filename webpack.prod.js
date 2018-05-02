const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
    output: {
        filename: "bundle-[chunkhash].js"
    },
    devServer: {
        contentBase: "./learn-1/public",
        historyApiFallback: true,
        inline: true,
        port: 38080,
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究！'),
        new UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin("styles-[chunkhash].css"),
    ],
});