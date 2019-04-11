const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack');

module.exports = {
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/app.bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};

// export ไปอยู่ที่ folder ไหนม __dirname คือ absolute path
// mode ไป set ใน package.json ตรง script ได้
// mode dev ไฟล์ใหญ่  , production ไฟล์เล็ก
// plugins สำหรับสร้าง html file

// module คือให้ babel มาจัดการกับไฟล์ไหนบ้าง
