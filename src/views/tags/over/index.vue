<template>
  <div class="vote-box layui-form">
   <ul>
     <li v-for="(item,index) in voteList" :key="index"> // 背景色
       <div class="progress" :style="randomRgb(item)"></div>  // 前景色
       <input type="checkbox" name="" :title="item.name" lay-skin="primary">
     </li>
   </ul>
 </div>

</template>

<script>
export default {
  data(){
	return {
		voteList: [
	          {
	            name: 'A',
	            num: 12,
	            total: 24,
	            bg: '#f00'
	          }, {
	            name: 'B',
	            num: 4,
	            total: 24,
	            bg: '#0f0'
	          }
	        ]
	}
}

};
</script>

<style lang="scss" scoped>
// css处使用了scss预处理
 .vote-box {
    li {
      position: relative;
      margin-top: 4px;
      background-color: #ccc;
      .progress {
        content: '';
        position: absolute;
        left: 18px;
        top: 0;
        height: 100%;
      }
    }
  }

</style>