import axios from '../util/axios';
// import qs from "qs";

const delay = (time, data) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(data);
		}, time);
	});
};

const isArray = (value) => Object.prototype.toString.call(value) === '[object Array]';
const isObject = (value) => Object.prototype.toString.call(value) === '[object Object]';
/**
 * 高阶函数，封装某个api方法，返回一个新方法，此新方法可以将返回的数据存到localStorage
 * @param {function} api fn
 * @return {function} new api fn
 */
export const withLocalStorageExpire = (fn) => {
	return function(...args) {
		const fnName = fn.name;
		const KEY = `AJAX_API_STORAGE_${fnName}`;
		const key =
			KEY +
			args
				.map((arg) => {
					if (isArray(arg) || isObject(arg)) {
						return qs.stringify(arg);
					} else {
						return arg;
					}
				})
				.join('&');
		let storage = localStorage.getItem(key);
		if (storage) {
			storage = JSON.parse(storage); //如果存在，直接用
			return Promise.resolve(storage);
		}
		return fn.apply(null, args).then((res) => {
			const {code} = res;
			if (code == 200 && fnName) {
				//把数据存进localStorage;
				try {
					localStorage.setItem(key, JSON.stringify(res));
				} catch (e) {
					console.error(e);
				}
			}
			return res;
		});
	};
};

export function getShopBaseConfig(data) {
	return axios.post('/co/System_SystemAdmin/getShopBaseConfig', data);
}

export function editBaseShopConfig(data) {
	return axios.post('/co/System_SystemAdmin/editBaseShopConfig', data);
}

export function getNotice(data) {
	return axios.post('/co/System_SystemAdmin/getNotice', data);
}

export function editNotice(data) {
	return axios.post('/co/System_SystemAdmin/editNotice', data);
}

export function getBannerConfig(data) {
	return axios.post('/co/System_SystemAdmin/getBannerConfig', data);
}

export function editBannerConfig(data) {
	return axios.post('/co/System_SystemAdmin/editBannerConfig', data);
}

export function getIconConfig(data) {
	return axios.post('/co/System_SystemAdmin/getIconConfig', data);
}

export function editIconConfig(data) {
	return axios.post('/co/System_SystemAdmin/editIconConfig', data);
}

export function getLandNameAndLandId(data) {
	return axios.post('/co/System_SystemAdmin/getLandNameAndLandId', data);
}
export const getLandNameAndLandIdLST = withLocalStorageExpire(getLandNameAndLandId);

export function getCity(data) {
	return axios.post('/r/Resource_AreaResource/secondLevelArea', data);
}
export const getCityLST = withLocalStorageExpire(getCity);

// 微信小程序api
export function getWxConfig(data) {
	return axios.post('/r/Mall_SmallAppConfig/getConfig', data);
}

export function saveWxConfig(data) {
	return axios.post('/r/Mall_SmallAppConfig/saveConfig', data);
}

export function getPageAppCodeConfig(data) {
	return axios.get('/r/Mall_WechatShop/getPageAppCodeConfig', {data});
}
