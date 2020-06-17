import $http from './request'

function JsontoForm(params) {
	let str = [];
	for (let key in params) {
		str.push(key + "=" + params[key])
	}
	return str.join('&');

}
export const api = {
	getSms: ''
}
export function getajax(url) {
	return $http.get(url)
}
export function postajax(url, params) {
	let myparams = JsontoForm(params);
	return $http.post(url, myparams)
}
