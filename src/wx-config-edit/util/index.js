/**
 * 生成随机数
 * @param {*} min        最小位数
 * @param {*} max        最大位数
 */
export function randomString( min=10, max=20){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    // 随机产生
    range = Math.round(Math.random() * (max-min)) + min;
    for(var i=0; i<range; i++){
        var pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

export function cloneDeep(object){
    if(!object) return object;
    return JSON.parse(JSON.stringify(object));
}

export function commitCreator(ctx,compName="",compId=""){
    return function(type,payload={}){
        if(Object.prototype.toString.call(payload)!=="[object Object]"){
            throw new Error("commit提交时的参数必须是object类型")
        }
        if(!payload.compId) payload.compId = compId;
        ctx.$store.commit(`miniDec/${compName}/${type}`,payload);
    }
}