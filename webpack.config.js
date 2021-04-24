const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: "none",
    entry: {
        client: "./client/client.js",
        clientOther: "./client/client-other.js"
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    plugins: [
        // new HtmlWebpackPlugin({ template: './client/client.html' }),
        // new HtmlWebpackPlugin({ template: './client/client-other.html' })
    ],
}