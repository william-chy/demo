const AJAX_TIMEOUT_TEXT = PFT.AJAX_TIMEOUT_TEXT;
const AJAX_ERROR_TEXT = PFT.AJAX_ERROR_TEXT;
import axios from "axios";
import {Message} from "element-ui";
const httpRequestError = (status,statusText) => {
    Message.error(`请求出错 status: ${status} statusText: ${statusText}`);
}


//添加request拦截器
axios.interceptors.request.use((config)=>{
    let params = config.data || {};
    let paramsArr = [];
    config.data = axios.qs.stringify(params)
    return config;
})
//添加response拦截器
axios.interceptors.response.use((response)=>{
    if(response.status==200){
        return response.data;
    }else{
        httpRequestError(res.status,res.statusText);
        return null;
    }
},(error)=>{
    console.log(error);
})


export default axios;