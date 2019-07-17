const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.html|tpl|xtpl$/,
        loader: 'html-loader',
        query: {
          minimize: true,
        },
      },
      {
        test: /\.css$/,
        use: [ 'css-loader', 'postcss-loader' ],
      },
      {
        test: /\.sass|scss$/,
        use: [ 'css-loader', 'postcss-loader', 'sass-loader' ],
      },
      {
        test: /\.less$/,
        use: [ 'css-loader', 'postcss-loader', 'less-loader' ],
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=8192&name=images/[name]-[hash].[ext]',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: [ 'css-loader', 'postcss-loader' ],
            sass: [ 'css-loader', 'postcss-loader', 'sass-loader' ],
            scss: [ 'css-loader', 'postcss-loader', 'sass-loader' ],
            less: [ 'css-loader', 'postcss-loader', 'less-loader' ],
          },
        },
      },
      {
        test: /\.(es|es6|js)$/,
        loader: 'babel-loader',
        options: {
          plugins: [ 'transform-runtime' ],
          presets: [ 'es2015', 'stage-0', 'react' ],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          plugins: [ 'transform-runtime' ],
          presets: [ 'es2015', 'stage-0', 'react' ],
        },
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3300',
        changeOrigin: true, // 是否跨域
        // cookieDomainRewrite: '192.168.20.173', // 设置跨域的 https://github.com/chimurai/http-proxy-middleware#http-proxy-options
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
    contentBase: './dist',
    hot: true,
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(), //再次更新时候清理dist文件
    new HtmlWebpackPlugin({
      title: 'my-app',
    }),
    new webpack.HashedModuleIdsPlugin(), //这个会使未改变文件锁定hash值，使得浏览器用缓存
    // new UglifyJSPlugin({//压缩代码插件，摇树优化，去除没用到的代码
    //   sourceMap: true,
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: [ 'babel-loader' ],
      },
    ],
  },
  output: {
    filename: '[name].[hash].js', //hash来应用缓存
    chunkFilename: '[name].[hash].js', //chunkhash或者contenthash都行，用于构建。而开发时只能用[hash]替代。原因不明
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    //优化选项
    runtimeChunk: 'single', //单个运行时
    splitChunks: {
      //代码分离，将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中
      cacheGroups: {
        vendor: {
          //提供商
          test: /[\\/]node_modules[\\/]/, //去掉来自 node_modules 目录的 vendor 代码
          name: 'vendors',
          chunks: 'all', //代码分离，防止重复
        },
      },
    },
  },
};
