const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.common');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const rootPath = process.cwd();

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        // 覆盖 common 中的 css rule，用 MiniCssExtractPlugin 抽离样式
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        sideEffects: true,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
    // 覆盖 common 里的 ForkTsChecker，使其在 prod 中同步阻断构建
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        configFile: path.resolve(rootPath, 'tsconfig.json'),
      },
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      `...`, // 继承默认的 TerserPlugin
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
        },
        commons: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single',
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