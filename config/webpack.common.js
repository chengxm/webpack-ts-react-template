const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const rootPath = process.cwd();



module.exports = {
    entry: path.resolve(rootPath, 'src/index.tsx'),
    output: {
        path: path.resolve(rootPath, 'dist'),
        filename: 'js/[name].[contenthash:8].js',
        publicPath: '/',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            '@': path.resolve(rootPath, 'src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: path.resolve(rootPath, 'src'),
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset', // Webpack 5 asset module
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024, // 8kb
                    },
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(rootPath, 'public/index.html'),
        }),
        // config/webpack.common.js 或你放插件的地方
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                async: true,
                configFile: path.resolve(rootPath, 'tsconfig.json'),
              
            },
        }),
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            context: path.resolve(rootPath, 'src'),
            files: './',
            failOnError: false,
            emitWarning: true,
            overrideConfigFile: path.resolve(rootPath, '.eslintrc.js'),
        }),
    ]
}