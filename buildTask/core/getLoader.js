// var loaders = [{
//         test : /\.html|tpl|xtpl$/,
//         use : "html?-minimize"
//     },{
//         test : /\.css$/,
//         use : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss")
//     },{
//         test : /\.sass|scss$/,
//         use : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss!sass")
//     },{
//         test : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
//         use : 'file-loader'
//     },{
//         test : /\.(png|jpe?g|gif)$/,
//         use : 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
//     },{
//         test: /\.vue$/,
//         use: "vue-loader"
//     },{
//         test: /\.(es|es6)$/,
//         use: 'babel-loader',
//         query : {
//             plugins : ["transform-runtime"],
//             presets : ["es2015","stage-0","react"]
//         },
//         exclude: /node_modules/
//     },{
//         test: /\.json$/,
//         use: 'json'
//     },{
//         test: /\.jsx$/,
//         use: 'babel-loader',
//         query:{
//             plugins:['transform-runtime'],
//             presets:['es2015','stage-0','react']
//         },
//         exclude: /node_modules/
//     }]
module.exports = function(){
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var loaders = [{
        test : /\.html|tpl|xtpl$/,
        loader : "html-loader",
        query : {
            minimize: true
        }
    },{
        test : /\.css$/,
        loader : ExtractTextPlugin.extract({
            fallback: "style-loader",
            use : ["css-loader","postcss-loader"]
        })
    },{
        test : /\.sass|scss$/,
        loader : ExtractTextPlugin.extract({
            fallback: "style-loader",
            use : ["css-loader","postcss-loader","sass-loader"]
        })
    },{
        test : /\.less$/,
        loader : ExtractTextPlugin.extract({
            fallback: "style-loader",
            use : ["css-loader","postcss-loader","less-loader"]
        })
    },{
        test : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'file-loader'
    },{
        test : /\.(png|jpe?g|gif)$/,
        loader : 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
    },{
        test: /\.vue$/,
        loader: "vue-loader",
        options : {
            loaders : {
                css: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use : ["css-loader","postcss-loader"]
                }),
                sass: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use : ["css-loader","postcss-loader","sass-loader"]
                }),
                scss: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use : ["css-loader","postcss-loader","sass-loader"]
                }),
                less: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use : ["css-loader","postcss-loader","less-loader"]
                })
            }
        }
    },{
        test: /\.(es|es6|js)$/,
        loader: 'babel-loader',
        options : {
            plugins : ["transform-runtime"],
            presets : ["es2015","stage-0","react"]
        },
        exclude: /node_modules/
    },{
        test: /\.json$/,
        loader: 'json-loader'
    },{
        test: /\.jsx$/,
        loader: 'babel-loader',
        query:{
            plugins:['transform-runtime'],
            presets:['es2015','stage-0','react']
        },
        exclude: /node_modules/
    }]


    return loaders;

};
