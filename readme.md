# 个人踩坑测试专用
这个项目目的在于能多用途的进行一些常用库demo调试
并进行webpage配置，脱离脚手架去更具体的了解各个工具库的编译流程
环境会慢慢完善
# 更新

-  增加了打包版本，生成环境发现了一个打包错误
  https://forum.vuejs.org/t/error-in-build-js-from-uglifyjs-unexpected-token-punc/33604/2
  > "解决此错误的最简单方法是不使用最新版本的uglifyjs-webpack-plugin，而是在回复此线程时发布的版本，因为它们之后发布了一个主要版本。
  > 所以你需要安装插件，用npm安装时指定版本：
  > npm i -D uglifyjs-webpack-plugin@1.3.0
  > 当然必须有一种方法可以使它与最新版本一起使用，但由于缺乏完美的答案，我仍然分享我的......"