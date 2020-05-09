const baseUrl
if (process.env.NODE_ENV === 'development') {
	// 开发环境
	baseUrl = 'http://192.168.0.52:9100/'
} else {
	// 生产环境
	baseUrl = 'http://192.168.0.52:9200/'
}
const request = (obj) => {
	const url = baseUrl + obj.url
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			data: obj.data,
			header: {
				// 'Authorization': store.getters.token ? `Bearer ${store.getters.token}` : '',
				'content-type': 'application/json'
			},
			method: obj.method ? obj.method : "GET",
			// timeout: 1000 * 10,
			dataType: 'json',
			success: res => {
				if(res.statusCode != 200) {
					errorHandle(res.statusCode, res.data.message)
				}
				// 成功
				resolve(res)
			},
			fail: err => {
				console.log(err);
				// 失败
				reject(err)
			}
		})
	})
}
// 请求失败后的错误统一处理
const errorHandle = (status, msg) => {
	// 状态码判断
	switch (status) {
		// 401: 未登录状态, 跳转登录页
		case 401:
			toLogin('请先登录!')
			break
		// 403: token 过期, 清除 token 并跳转登录页
		case 403:
			toLogin('登录过期,请重新登录!')
			break
		// 404: 请求不存在
		case 404:
			toast('请求的资源不存在!')
			break
		// 405: 方法不允许
		case 405:
			toast('方法不允许!')
			break
		// 500: 服务器内部异常
		case 500:
			toast('出现异常!')
			break
		// 503: 服务不可用
		case 503:
			toast('服务不可用!')
			break
		default:
			toast('出现其他异常!')
			console.log(msg);
			break
	}
}

// 轻提示
const toast = (msg) => {
	uni.showToast({
		title: msg,
		icon: 'none'
	})
}

// 登录提示并跳转回登录页
const toLogin = (msg) => {
	uni.showModal({
		title: '提示',
		content: msg,
		showCancel: false,
		confirmText: '去登陆',
		success: res => {
			if (res.confirm) {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		}
	})
}

export default request