import {randomString,cloneDeep} from "../../../util";
const requireAll = context => context.keys().map(context);
export const components = requireAll(require.context(".",true,/index\.js$/)).filter((item) => item.default).map(item=>item.default)
export const componentsDefaultData = components.map((item,index) => {
    const props = item.props || {};
    const data = {};
    for(let i in props){
        data[i] = props[i].default;
    }
    data["compName"] = item.name;
    data["compNameCN"] = item.nameCN;
    data["compId"] = randomString();
    data["compType"] = item.compType;
    data["sort"] = item.sort;
    return {...data};
}).sort((a,b) => a.sort-b.sort)

//基础组件数据
export const baseCompDefaultData = componentsDefaultData.filter(item=>item.compType==="base");
//其它组件数据
export const otherCompDefaultData = componentsDefaultData.filter(item=>item.compType==="other");

export const baseCompIcon = baseCompDefaultData.map((item) => {
    const data = {};
    data["compIcon"] = components.find((i) => i.name==item.compName).compIcon;
    data["compName"] = item.compName;
    data["compNameCN"] = item.compNameCN;
    return cloneDeep(data);
})



export const otherCompIcon = otherCompDefaultData.map((item) => {
    const data = {};
    data["compIcon"] = components.find((i) => i.name==item.compName).compIcon;
    data["compName"] = item.compName;
    data["compNameCN"] = item.compNameCN;
    return cloneDeep(data);
})