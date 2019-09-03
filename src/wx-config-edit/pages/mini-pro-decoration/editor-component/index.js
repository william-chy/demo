const requireAll = context => context.keys().map(context);
const components = require.context(".",true,/index\.js$/);

export default requireAll(components).filter((item) => item.default).map(item=>item.default)