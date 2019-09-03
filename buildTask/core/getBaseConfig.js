var path = require("path");
var Root = require("../../rootDir")();
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = function(opt) {
  opt || (opt = {});
  var autoprefixer = require("autoprefixer");
  var precss = require("precss");
  return {
    watch: !!opt.watch,
    entry: opt.entry || "",
    output: opt.output || {},
    module: {
      rules: opt.loaders || []
    },
    plugins: opt.plugins || [],
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
      mirrorx: "Mirror",
      // "prop-types": "PropTypes",
      // classnames: "classNames",
      html2canvas: "html2canvas",
      axios: "axios",
      antd: "antd",
      vant: "vant",
      vue: "Vue",
      "element-ui" : "ELEMENT",
      "mint-ui" : "MINT",
      moment : "moment",
      jquery : "$",
      jQuery : "$"
    },
    resolve: {
      alias: {
        COMMON: path.join(Root, "./common"),
        CSS_CORE: path.join(Root, "./common/css/base/core"),
        CSS_MIXIN: path.join(Root, "./common/css/base/mixin"),
        COMMON_VUE_COMPONENTS: path.join(Root, "./src-mobile/Components"),
        COMMON_VUE_COMPONENTS_B: path.join(Root, "./src-mobile/B/Components"),
        COMMON_VUE_COMPONENTS_C: path.join(Root, "./src-mobile/C/Components"),
        SERVICE_M: path.join(Root, "./src-mobile/Service"),
        SERVICE: path.join(Root, "./Service"),
        VUX_COMPONENTS: path.join(Root, "./node_modules/vux/src/components"),
        NODE_MODULES: path.join(Root, "./node_modules"),
        "@pft-ui-component": path.join(Root, "./@pft-ui-component"),
        "@Vue": path.join(Root, "./common/@Vue"),
        "@Business": path.join(Root, "./common/@Business"),
        "@vue-component": path.join(Root, "./@vue-component"),
        "@c-spa": path.join(Root, "./src-mobile/c-spa"),
        "@pc": path.join(Root, "./src-pc"),
        "@pc-tickets-property": path.join(Root, "./src-pc/tickets"),  //票类属性路径别名
        "@mobile": path.join(Root, "./src-mobile"),
      }
    },
    devtool: "#source-map"
  };
};
