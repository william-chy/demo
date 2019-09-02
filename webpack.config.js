const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

//module.exports 指向配置对象。要使用 env 变量，你必须将 module.exports 转换成一个函数：
module.exports = (env) => {
  const isDev = env.NODE_ENV == 'development';
  console.log(isDev);
  const config = {
    mode: isDev ? 'development' : 'production',
    entry: {
      app: './src/index.js',
    },
    module: {
      rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: { appendTsSuffixTo: [ /\.vue$/ ] },
            },
            'awesome-typescript-loader',
          ],
        },
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
            isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.scss$/,
          use: [
            isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                // data设置全局变量 你也可以从一个文件读取，例如 `variables.scss`
                data: `$color: red;`,
              },
            },
          ],
        },
        {
          test: /\.sass$/,
          use: [
            isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                indentedSyntax: true,
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
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
          // options: {
          //   loaders: {
          //     less: 'vue-style-loader!css-loader!less-loader', // <style lang="less">
          //     scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
          //     sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax', // <style lang="sass">
          //   },
          // },
        },
        {
          test: /\.(es|es6|js)$/,
          loader: 'babel-loader',
          exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.jsx$/,
          loader: 'babel-loader',
        },
      ],
    },
    devtool: isDev ? 'inline-source-map' : '',
    devServer: isDev
      ? {
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
        }
      : {},
    plugins: [
      new webpack.NamedModulesPlugin(),
      new CleanWebpackPlugin(), //再次更新时候清理dist文件
      new HtmlWebpackPlugin({
        title: 'my-app',
        hash: true,
        inject: 'body', //js插入的位置，true/'head'/'body'/false
        base: isDev ? 'http://localhost:3300' : '/',
        // filename: path.resolve(__dirname, 'dist/index.html'), //生成的html存放路径，相对于path
        template: path.resolve(__dirname, 'src/index.html'),
      }),
      new webpack.HashedModuleIdsPlugin(), //这个会使未改变文件锁定hash值，使得浏览器用缓存

      new VueLoaderPlugin({ prettify: false }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'APP': path.resolve(__dirname, 'src/app/'),
      },
      // 自动解析确定的扩展，即无需扩展名即可引用 例如 import abc form './component/abc';
      extensions: [ '.ts', '.tsx', '.js', '.json' ],
    },
    externals: {
      //防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
      //https://webpack.docschina.org/configuration/externals/
      // react: 'React',
      // 'react-dom': 'ReactDOM',
      // lodash : {
      //   commonjs: 'lodash',
      //   amd: 'lodash',
      //   root: '_' // 指向全局变量
      // }//这么写后，lodash就需要外部引用
    },
    //我们只需要在浏览器里引入React模块，但是大部分浏览器还没有支持模块。 因此大部分代码库会把自己包裹在一个单独的全局变量内，比如：jQuery或_。 这叫做“命名空间”模式，webpack也允许我们继续使用通过这种方式写的代码库。 通过我们的设置"react": "React"，webpack会神奇地将所有对"react"的导入转换成从React全局变量中加载。
    output: {
      filename: '[name].[hash].js', //hash来应用缓存
      chunkFilename: '[name].[hash].js', //chunkhash或者contenthash都行，用于构建。而开发时只能用[hash]替代。原因不明
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      // 任何字符串：用于设置 process.env.NODE_ENV 的值。这里采用外部传入所以禁用掉
      nodeEnv: false,
      //设置为 true 或 "multiple"，会为每个仅含有 runtime 的入口起点添加一个额外 chunk。值 "single" 会创建一个在所有生成 chunk 之间共享的运行时文件
      runtimeChunk: 'single',
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
  if (isDev) {
    //热重载
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    console.log('生产环境，摇树优化');
    //取出css
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css',
      }),
    );
    //压缩代码插件，摇树优化，去除没用到的代码
    config.optimization.minimizer = [
      new UglifyJSPlugin({
        sourceMap: true,
      }),
    ];
  }
  return config;
};
