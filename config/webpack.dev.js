const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const rootPath = process.cwd();

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: 'js/[name].js',
  },
  devServer: {
    static: {
      directory: path.join(rootPath, 'public'),
    },
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
    proxy: [
    {
      context: ['/api'], // 要代理的路径
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    },
  ],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [
        path.resolve(__dirname, 'webpack.common.js'),
        path.resolve(__dirname, '../tsconfig.json'),
        path.resolve(__dirname, '../babel.config.js'),
        path.resolve(__dirname, '../.eslintrc.js'),
      ],
    },
  },
});