import {
    components as PreviewComponents,
    componentsDefaultData,
    baseCompDefaultData,
    otherCompDefaultData
} from "../preview-component";
import {cloneDeep,randomString} from "../../../util";
//默认的店铺组件数据(页面初始化时先设置为默认数据，再从后端接口取组件数据)
//每个组件的默认数据都存在组件自身的props里的默认值default
const DEFAULT_COMP_DATA = componentsDefaultData.filter((item) => item.sort<=3);
const curEditCompId = DEFAULT_COMP_DATA[0].compId;
/**
 * update compData里某个组件下的一级数据
 * @param {object} state store里的state数据
 * @param {string} 要修改的组件的组件id
 * @param {object} 要修改的组件的组件数据
 */
const updateCompData = (state,compId,obj={}) => {
    return state.compData.map((item) => {
        if(item.compId!==compId) return item;
        return Object.assign({},item,obj)
    })
}


//页面标题组件的mutation
const pageTitle = {
    "page-title/shopNameShow" : function(state,{compId,visible}){
        state.compData = updateCompData(state,compId,{
            shopNameShow : visible
        })
    },
    "page-title/shopNameAlign" : function(state,{compId,align}){
        state.compData = updateCompData(state,compId,{
            shopNameAlign : align,
            searchBarAlign : align==="left" ? "center" : "left"
        })
    },
    "page-title/searchBarShow" : function(state,{compId,visible}){
        state.compData = updateCompData(state,compId,{
            searchBarShow : visible
        })
    },
    "page-title/searchBarAlign" : function(state,{compId,align}){
        state.compData = updateCompData(state,compId,{
            searchBarAlign : align,
            shopNameAlign : align=="left"? "center" : "left"
        })
    }
}
//banner组件的mutation
const banner = {
    /**
     * 新增一个banner item
     * @param {object} state 
     * @param {string} compId 组件id 
     */
    "banner/add" : function(state,{compId,banner}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            if(!Array.isArray(item.banner)) return item;
            item.banner.push(banner)
            return item;
        })
    },
    /**
     * 修改轮播图图片的src
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {number} index  标识是第几张轮播图
     * @param {string} src    要更换的src
     */
    "banner/changeImage" : function(state,{compId,index,src}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            if(!Array.isArray(item.banner)) return item;
            item.banner = item.banner.map((banner,idx) => {
                if(idx!==index) return banner;
                banner["src"] = src;
                return banner;
            })
            return item;
        })
    },
    /**
     * 删除banner item
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {number} index  标识是第几张轮播图
     */
    "banner/deleteBanner" : function(state,{compId,index}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            if(!Array.isArray(item.banner)) return item;
            item.banner = item.banner.filter((banner,idx) => index!=idx);
            return item;
        })
    },
    /**
     * 更新某个banner的标题
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {number} index  标识是第几张轮播图
     * @param {string} title  
     */
    "banner/updateTitle" : function(state,{compId,index,title=""}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            if(!Array.isArray(item.banner)) return item;
            item.banner = item.banner.map((banner,idx) => {
                if(index!==idx) return banner;
                banner.title = title;
                return banner
            })
            return item;
        })
    },
    /**
     * 调整banner顺序
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {number} removedIndex  调整前的index值
     * @param {number} addedIndex   调整后的index值
     */
    "banner/sort" : function(state,{compId,removedIndex,addedIndex}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            if(!Array.isArray(item.banner)) return item;
            const removed = cloneDeep(item.banner[removedIndex]);
            const added = cloneDeep(item.banner[addedIndex]);
            item.banner = item.banner.map((item,index) => {
                if(index==removedIndex) return added;
                if(index==addedIndex) return removed;
                return item;
            })
            return item;
        })
    },
    /**
     * 设置链接
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {object} link
     * @param {number} index  标识是第几个banner item
     */
    "banner/updateLink" : function(state,{compId,link,index}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            if(!Array.isArray(item.banner)) return item;
            item.banner = item.banner.map((banner,idx) => {
                if(index!==idx) return banner;
                banner.link = link;
                return banner
            })
            return item;
        })
    },
}
//产品列表组件的mutation
const prodList = {
    /**
     * 删除banner item
     * @param {object} state 
     * @param {string} compId 组件id 
     */
    "prod-list/updateLayout" : function(state,{compId,layout}){
        state.compData = updateCompData(state,compId,{layout})
    },
    /**
     * 切换显示信息
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {array}  detail  
     */
    "prod-list/updateDetail" : function(state,{compId,detail=[]}){
        state.compData = updateCompData(state,compId,{detail})
    }
};
//文字组件的mutation
const textWorld = {
    /**
     * 更新标题
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {string} title   标题
     */
    "text-world/updateTitle" : function(state,{compId,title}){
        state.compData = updateCompData(state,compId,{title})
    },
    /**
     * 更新内容
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {string} title   内容
     */
    "text-world/updateContent" : function(state,{compId,content}){
        state.compData = updateCompData(state,compId,{content})
    },
    /**
     * 更新显示方式
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {number} display   内容
     */
    "text-world/updateDisplay" : function(state,{compId,display}){
        state.compData = updateCompData(state,compId,{display})
    },
    /**
     * 更新是否显示图标
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {boolean} icon   内容
     */
    "text-world/updateIcon" : function(state,{compId,icon}){
        state.compData = updateCompData(state,compId,{icon})
    },
}

//图文导航组件的mutation
const imageTextNav = {
    /**
     * 新增一个导航 item
     * @param {object} state 
     * @param {string} compId 组件id 
     */
    "image-text-nav/add" : function(state,{compId,navItem}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            item.navList.push(Object.assign({},navItem))
            return item;
        })
    },
    /**
     * 删除一个导航 item
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {number}  index  标识哪个item项
     */
    "image-text-nav/delete" : function(state,{compId,index}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            item.navList = item.navList.filter((item,idx) => (idx!=index));
            return item;
        })
    },
    /**
     * 调整item顺序
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {number} removedIndex  调整前的index值
     * @param {number} addedIndex    调整后的index值
     */
    "image-text-nav/sort" : function(state,{compId,removedIndex,addedIndex}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            if(!Array.isArray(item.navList)) return item;
            const removed = cloneDeep(item.navList[removedIndex]);
            const added = cloneDeep(item.navList[addedIndex]);
            item.navList = item.navList.map((item,index) => {
                if(index==removedIndex) return added;
                if(index==addedIndex) return removed;
                return item;
            })
            return item;
        })
    },
    /**
     * 切换导航样式
     * @param {object}  state 
     * @param {string}  compId 组件id 
     * @param {number|string} style  1==图文导航 2==文字导航
     */
    "image-text-nav/updateStyle" : function(state,{compId,style}){
        state.compData = state.compData.map((comp) => {
            if(comp.compId!=compId) return comp;
            comp.navList = comp.navList.map((item) => {
                item.style = style;
                return item;
            })
            return comp;
        })
    },
    /**
     * 更换某个item的图标
     * @param {object}  state 
     * @param {string}  compId 组件id 
     * @param {number}  index  标识哪个item项
     * @param {string}  icon    图标src
     */
    "image-text-nav/updateIcon" : function(state,{compId,index,icon}){
        state.compData = state.compData.map((comp) => {
            if(comp.compId!=compId) return comp;
            comp.navList = comp.navList.map((item,idx) => {
                if(idx!=index) return item;
                item.icon = icon;
                return item;
            })
            return comp;
        })
    },
    /**
     * 更换某个item的名称
     * @param {object}  state 
     * @param {string}  compId 组件id 
     * @param {number}  index  标识哪个item项
     * @param {string}  text   图标名称
     */
    "image-text-nav/updateText" : function(state,{compId,index,text}){
        state.compData = state.compData.map((comp) => {
            if(comp.compId!=compId) return comp;
            comp.navList = comp.navList.map((item,idx) => {
                if(idx!=index) return item;
                item.text = text;
                return item;
            })
            return comp;
        })
    },
    /**
     * 更换某个item的链接
     * @param {object}  state 
     * @param {string}  compId     组件id 
     * @param {number}  index      标识哪个item项
     * @param {string}  text       要链接到的产品类型名称  "all"==不限  
     * @param {string}  ptype      要链接到的产品类型  "all"==不限  
     * @param {string}  cityId     要链接到的城市id   "all"==不限  
     * @param {string}  cityName   要链接到的城市名称  "all"==不限  
     */
    "image-text-nav/updateLink" : function(state,{compId,index,ptype,text,cityId,cityName}){
        state.compData = state.compData.map((comp) => {
            if(comp.compId!=compId) return comp;
            comp.navList = comp.navList.map((item,idx) => {
                if(idx!=index) return item;
                item.ptype = ptype;
                item.cityId = cityId;
                item.cityName = cityName;
                if(text!=="all") item.text = text;
                return item;
            })
            return comp;
        })
    },
    /**
     * 删除某个item的链接
     * @param {object}  state 
     * @param {string}  compId     组件id 
     * @param {number}  index      标识哪个item项
     */
    "image-text-nav/deleteLink" : function(state,{compId,index}){
        state.compData = state.compData.map((comp) => {
            if(comp.compId!=compId) return comp;
            comp.navList = comp.navList.map((item,idx) => {
                if(idx!=index) return item;
                item.ptype = "all";
                item.cityId = "all";
                item.cityName = "all";
                return item;
            })
            return comp;
        })
    },
}


//搜索组件的mutation
const search = {
    /**
     * 更新建议搜索词 
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {string} placeholder 
     */
    "search/updatePlaceholder" : function(state,{compId,placeholder}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            item.placeholder = placeholder;
            return item;
        })
    },
    /**
     * 更新文字显示 
     * @param {object} state 
     * @param {string} compId 组件id 
     * @param {string} align 
     */
    "search/updateAlign" : function(state,{compId,align}){
        state.compData = state.compData.map((item) => {
            if(item.compId!==compId) return item;
            item.align = align;
            return item;
        })
    },
}


export default{
    name : "miniDec",
    namespaced : true,
    state : {
        shopName : "店铺名称店铺名",
        curEditCompId,             //当前正在编辑组件id
        compData : DEFAULT_COMP_DATA,   //组件数据
    },
    getters : {
        curEditCompData(state){
            const {compData,curEditCompId} = state;
            if(!compData || !curEditCompId) return null;
            const data = compData.find((item) => item.compId===curEditCompId);
            return data ? cloneDeep(data) : null;
        }
    },
    mutations : {
        ...pageTitle,
        ...banner,
        ...prodList,
        ...textWorld,
        ...imageTextNav,
        ...search,
        /**
         * 调整组件顺序
         * @param {number} removedIndex  调整前的index值
         * @param {number} addedIndex   调整后的index值
         */
        changeSort(state,{removedIndex,addedIndex}){
            let compData = cloneDeep(state.compData);
            if(!compData || !Array.isArray(compData) || compData.length==0) return false;
            if(removedIndex===null || addedIndex===null) return false;
            if(typeof removedIndex==="number" && typeof addedIndex==="null" && removedIndex===addedIndex) return false;
            const removeItem = cloneDeep(compData[removedIndex]);
            const addItem = cloneDeep(compData[addedIndex]);
            if(!removeItem || !addItem) return false;
            compData = compData.map((item,index) => {
                if(index===removedIndex) return addItem;
                if(index==addedIndex) return removeItem;
                return item;
            })
            state.compData = compData;
        },
        /**
         * 插入一个新组件
         * @param {number} addedIndex   插入到哪里
         * @param {number} newCompIndex 要插入的新组件index值
         */
        addNew(state,{addedIndex,newCompIndex,type}){
            const compData = cloneDeep(state.compData);
            if(!compData || !Array.isArray(compData)) return false;
            let data = type=="base" ? baseCompDefaultData[newCompIndex] : otherCompDefaultData[newCompIndex];
            if(!data) return false;
            data = cloneDeep(data);
            data["compId"] = randomString();
            if(compData.length==0){
                state.compData = [data];
            }else{
                state.compData.splice(addedIndex,0,data);
            }
            if(state.compData.length==1){
                state.curEditCompId = state.compData[0].compId;
            }
        },
        /**
         * 切换编辑组件
         * @param {object} state 
         * @param {string} compId 组件id
         */
        switchEditComp(state,compId){
            state.curEditCompId = compId;
        },
        /**
         * 删除预览组件
         * @param {object} state 
         * @param {string} compId 组件id
         */
        deletePreviewComp(state,compId){
            const compData = cloneDeep(state.compData).filter((item) => item.compId!==compId);
            if(compData.length==0){
                state.curEditCompId = "";
            }else if(compData.length==1 || state.curEditCompId===compId){
                state.curEditCompId = compData[0].compId;
            }
            state.compData = compData;
        },
        
    }
}