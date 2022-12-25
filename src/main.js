import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/common/common.scss'
import '@/router/intercept.js'

createApp(App).use(store).use(router).use(ElementPlus).directive('highlight', function (el) {
	let blocks = el.querySelectorAll('pre code');
	blocks.forEach((block) => {
		hljs.highlightBlock(block)
	})
}).mount('#app')
