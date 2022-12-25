import axios from 'axios'
import { ElNotification } from "element-plus";
import store from '@/store';
const instance = axios.create({
	time: 60 * 1000,
	baseURL: 'http://124.223.98.94:81/wp-json'
})
const instance2 = axios.create({
	time: 60 * 1000,
	baseURL: 'https://api.inews.qq.com/newsqa/v1'
})

instance.interceptors.request.use((config) => {
	let token = sessionStorage.getItem('token')
	if (token) {
		config.headers.authorization = 'Bearer'+token
	}
	return config
}, (err) => {
	return Promise.reject(err)
})


// 响应拦截器
instance.interceptors.response.use(response => {
	// if (response.data.success) {
	// 数据正常，进行的逻辑功能
	return response
	// } else {
	// 	// 如果返回的 success 是 false，表明业务出错，直接触发 reject
	// 	// 抛出的错误，被 catch 捕获
	// 	ElMessage.error(response.data.message)
	// 	return Promise.reject(new Error(response.data.message))
	// }
}, error => {
	// 对响应错误做点什么
	store.commit('setLoading',false)
	store.commit('setLoadings',false)
	ElNotification({
		title: "Error",
		message: error.response.data.message,
		type: "error",
	  });
	return Promise.reject(error)
})


export {instance,instance2}