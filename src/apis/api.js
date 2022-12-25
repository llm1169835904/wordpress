import {instance,instance2} from "./instance";
//获取列表里
const articleList = ({page=''}) => {
	return instance.get(`/wp/v2/posts?page=${page}`)
}
//通过分类获取列表里
const tagsList = ({page='',categories=''}) => {
	return instance.get(`/wp/v2/posts?page=${page}&categories=${categories}`)
}
// 添加文章
const addArticle=({title='',content='',categories='1',status='publish'})=> {
	return instance.post(`/wp/v2/posts?title=${title}&categories=${categories}&status=${status}`,{content:content})
  }
//编辑文章
const alterArticle=({id='',title='',content='',categories='1',status='publish'})=>{
	return instance.put(`/wp/v2/posts/${id}?title=${title}&categories=${categories}&status=${status}`,{content})
}
//   详情
const detail=(id)=>{
	return instance.get(`/wp/v2/posts/${id}`,{})
}
//获取文章分类数组
const categories=()=>{
	return instance.get(`/wp/v2/categories?per_page=99`)
}
// 获取指定分类ID的分类信息
const getCategories=(id)=>{
	return instance.get(`/wp/v2/categories/${id}`)
}
// 上传图片
const media = (params) => {
	return instance({
		url:`/wp/v2/media`,
		method:'post',
		data:params,
	})
}
// 删除文章
const delArticle=(id)=>{
	return instance({
		url:`/wp/v2/posts/${id}`,
		method:'delete',
		params:{id:id},
	})
}

//创建一条文章评论
const addComments=({post='',content='',parent=0,author_name=''})=>{
	return instance.post(`/wp/v2/comments?post=${post}&content=${content}&parent=${parent}&author_name=${author_name}`,{})
}
//获取某文章所有的评论
const getComments=({post='',parent='',per_page=100})=>{
	return instance.get(`/wp/v2/comments?post=${post}&parent=${parent}&per_page=${per_page}`)
}
//登陆
const login=(username,password)=>{
	return instance({
		url:`/jwt-auth/v1/token`,
		method:'post',
		data:{username,password}
	})
}
const userInfo=()=>{
	return instance.get(`/wp/v2/users/me`)
}

//echarts
const echList=()=>{
	return instance2.post(`/query/inner/publish/modules/list?modules=localCityNCOVDataList,diseaseh5Shelf`)
}
const echList1=()=>{
	return instance2.get(`/query/inner/publish/modules/list?modules=chinaDayListNew,chinaDayAddListNew&limit=30`)
}
const echList2=({adCode=''})=>{
	return instance2.post(`/query/pubished/daily/list?adCode=${adCode}&limit=30`)
}
export {
	articleList,
	addArticle,
	detail,
	tagsList,
	media,
	delArticle,
	login,
	addComments,
	getComments,
	alterArticle,
	categories,
	getCategories,
	userInfo,
	echList,
	echList1,
	echList2,
}