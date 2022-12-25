import router from './index.js'
router.beforeEach((to,from,next)=>{
	let token=sessionStorage.getItem('token')
    if (token) {
        if (to.path == '/login') {
            next('/')
        } else {
            next()
        }
    } else {
        // if (to.path == '/login') {
            next()
        // } else {
        //     next('/login')
        // }
    }
})