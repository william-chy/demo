import "./index.scss";
import {fetchProdList} from "./api";
import {getCityLST,getCity} from "../../service";
import ptypeMap from "../../product-type";
export default{
    template : require("./index.xtpl"),
    props : {
        target : { //mini-program==小程序(小程序没有自定义链接)   h5==微商城   
            type : String,
            default : "h5"
        },
        use : { // prodList==跳转到产品列表   prodDetail==跳转至产品详情
            type : String,
            default : "prodList"
        },
        api : {
            type : String,
            default : "/co/Admin_Product/getProductList"
        },
        title : {
            type : String,
            default : "设置链接"
        },
        width : {
            type : String,
            default : "50%"
        }
    },
    data(){
        return{
            show : false,
            linkType : "prod",
            prodList : [],
            prodId : "",
            loading : false,
            customLink : "",
            cityOptions : [],
            cityId : "all",
            cityName : "all",
            provId : "all",
            provName : "all",
            ptype : "",
            ptypeMap
        }
    },
    created(){
        if(this.use=="prodList"){
            this.getCity();
        }
    },
    mounted(){
        this.isClickToCancel = true;
    },
    methods : {
        open(){
            this.isClickToCancel = true;
            return new Promise((resolve,reject) => {
                const unwatch  = this.$watch("show",(show) => {
                    if(show===true) return false;
                    if(this.isClickToCancel){
                        unwatch();
                        return reject("cancel");
                    }
                    const {use,linkType,customLink,ptype} = this;
                    const data = {
                        type : linkType,   //prod=="跳转至产品列表或产品详情"  text=="自定义链接"
                        prodId : "",       //跳转至产品详情时的产品id
                        prodName : "",     //跳转至产品详情时的产品名称
                        customLink : "",   //用户输入的自定议链接
                        ptype : "",        //跳转至产品列表时的产品类型的值，不限时为"all"
                        text : "",         //跳转至产品列表时的产品类型名称，不限时为"all"
                        provId : "",       //跳转至产品列表时的省id，不限时为"all"
                        provName : "",     //跳转至产品列表时的省名称，不限时为"all"
                        cityId : "",       //跳转至产品列表时的城市id，不限时为"all"
                        cityName : ""      //跳转至产品列表时的城市名称，不限时为"all"
                    }
                    if(linkType=="prod"){
                        if(use=="prodDetail"){//跳转至产品详情页
                            const prodList = this.prodList || [];
                            const prodId = this.prodId;
                            const cur = prodList.find((item) => item.id==prodId) || {};
                            data.prodId = prodId || "";
                            data.prodName = cur.title || "";
                        }else{ //跳转至产品列表页
                            data.provId = this.provId;
                            data.provName = this.provName;
                            data.cityId = this.cityId;
                            data.cityName = this.cityName;
                            data.ptype = ptype=="" ? "all" : ptype;
                            data.text = ptype=="" ? "all" : ptypeMap.find((item) => item.value==ptype).label;
                        }
                    }else{  
                        data.customLink = customLink;
                    }
                    unwatch();
                    resolve(data)
                })
                this.show = true;
            })
        },
        onSearch(keyword){
            this.fetchProd(keyword);
        },
        onConfirm(){
            const {
                linkType,
                use,
                prodId,prodName,
            } = this;
            if(linkType=="text"){ //自定链接时，用户点击确定按钮，需要先校验输入的自定义链接是否可用
                const customLink = this.customLink;
                if(!/^https?:\/\//.test(customLink)){//如果自定义链接不是以http或https开头的
                    return this.$alert("自定义链接格式错误，必须以http://或https://开头");
                }
            }else{//跳转至产品列表或产品详情
                if(use=="prodDetail"){
                    if(!prodId || !prodName){
                        return this.$alert("请选择一个小程序的在售产品");
                    }
                }
            }
            this.isClickToCancel = false;
            this.show = false;
        },
        onCancel(){
            this.isClickToCancel = true;
            this.show = false;
        },
        handleCityChange(data){
            if(data.length==0){//不限
                this.cityId = "all";
                this.cityName = "all";
                this.provId = "all";
                this.provName = "all";
                return;
            }
            const [provId,cityId] = data;
            const prov = this.cityOptions.find((item) => item.value==provId); //省
            const city = prov.children.find((item) => item.value==cityId); //市
            const cityName = city.label;
            this.cityId = cityId;
            this.cityName = cityName;
            this.provId = provId;
            this.provName = prov.label;
        },
        fetchProd(keyword=""){
            if(!keyword || keyword.length==0){
                this.prodList = [];
                return false;
            };
            this.loading = true;
            fetchProdList(this.api,keyword).then((res) => {
                if(res.code==200){
                    this.prodList = res.data;
                }else{
                    this.$alert(`请求出错：${res.msg}`);
                }
            }).catch((e)=>{
                this.$alert(`请求出错：${e.message}`);
            }).finally(() => {
                this.loading = false;
            })
        },
        async getCity() {
            const res = await getCityLST().catch((e) => e);
            if(res.code == 200){
                if(!Array.isArray(res.data) || res.data.length==0) return;
                this.cityOptions = res.data.map((item) => {
                    const {area_id,area_name,_child} = item;
                    return {
                        value: area_id,
                        label: area_name,
                        children: _child.map((e) => {
                            return {
                                value: e.area_id,
                                label: e.area_name,
                            };
                        }),
                    };
                });
            }else{
                this.$alert(r.msg || r.message || '获取城市列表失败');
            }
        },
        
    }
}