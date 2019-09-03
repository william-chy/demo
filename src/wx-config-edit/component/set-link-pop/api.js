import axios from '../../util/axios';
const cache = {};
export function fetchProdList(url,keyword=""){
    //本地有缓存时直接取缓存里的数据，避免重复请求
    if(cache[keyword]) return Promise.resolve(cache[keyword]);
    return axios.post(url, {keyWord:keyword}).then((res) => {
        if(res.code==200 && res.data && res.data.length>0){
            cache[keyword] = res;
        }
        return res;
    })
}