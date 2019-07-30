const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: 'none',
  entry: {
    app: './src/index.js',
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, use: [ 'ts-loader', 'awesome-typescript-loader' ] },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.html|tpl|xtpl$/,
        loader: 'html-loader',
        query: {
          minimize: true,
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // by default it uses publicPath in webpackOptions.output
              // publicPath: (resourcePath, context) => {
              //   // publicPath is the relative path of the resource to the context
              //   // e.g. for ./css/admin/main.css the publicPath will be ../../
              //   // while for ./css/main.css the publicPath will be ../
              //   return path.relative(path.dirname(resourcePath), context) + '/';
              // },
              hmr: isDev,
            },
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.sass|scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          'css-loader', //将 CSS 转化成 CommonJS 模块
          'postcss-loader',
          'less-loader',
        ],
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
            less: 'vue-style-loader!css-loader!less-loader', // <style lang="less">
            scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax', // <style lang="sass">
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(es|es6|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: isDev?'inline-source-map':'',
  devServer: isDev?{
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
  }:{},
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(), //再次更新时候清理dist文件
    new HtmlWebpackPlugin({
      title: 'my-app',
      hash: true,
      inject: 'body', //js插入的位置，true/'head'/'body'/false
      base: 'http://localhost:3300',
      // filename: path.resolve(__dirname, 'dist/index.html'), //生成的html存放路径，相对于path
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new webpack.HashedModuleIdsPlugin(), //这个会使未改变文件锁定hash值，使得浏览器用缓存
    // new UglifyJSPlugin({//压缩代码插件，摇树优化，去除没用到的代码
    //   sourceMap: true,
    // }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
    }),
    new VueLoaderPlugin({ prettify: false }),
  ],
  resolve: {
    alias: {
      '~@': path.resolve(__dirname, 'src/'),
    },
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [ '.ts', '.tsx', '.js', '.json' ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  //我们只需要在浏览器里引入React模块，但是大部分浏览器还没有支持模块。 因此大部分代码库会把自己包裹在一个单独的全局变量内，比如：jQuery或_。 这叫做“命名空间”模式，webpack也允许我们继续使用通过这种方式写的代码库。 通过我们的设置"react": "React"，webpack会神奇地将所有对"react"的导入转换成从React全局变量中加载。
  output: {
    filename: '[name].[hash].js', //hash来应用缓存
    chunkFilename: '[name].[hash].js', //chunkhash或者contenthash都行，用于构建。而开发时只能用[hash]替代。原因不明
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    // 禁止 Webpack 替换 NODE_ENV 环境变量
    nodeEnv: false,
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
