var Fly = require("./wx")
const request = new Fly()

request.config.timeout = 60 * 1000
request.config.baseURL = 'https://q.muenmei.com/'
request.interceptors.request.use((request) => {
	 // request.headers["content-type"] = "application/x-www-form-urlencoded";
	if(uni.getStorageSync('cookiekey')){
		request.headers["Cookie"] = uni.getStorageSync('cookiekey')
	}
	uni.showLoading({
		title: '加载中...'
	})
	return request
})

request.interceptors.response.use(
	(response, promise) => {
		console.log(response.headers)
		if(response&&response.headers&&response.headers['set-cookie']){
			uni.setStorage({
				key: 'cookiekey',
				data: response.headers['set-cookie'][0]
			});
		}
		wx.hideLoading();
		return promise.resolve(response.data)
	},
	(err, promise) => {
		uni.hideLoading()
		uni.showToast({
			title: err.message,
			icon: 'none'
		})
		return promise.reject(err)
	}
)

export default request
