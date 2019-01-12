var path = require('path')
module.exports = {
  //入口
  entry:'./src/main.js',
  // 出口
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  // 模块解析
  module: {},
  // 插件
  plugins:[]
}
