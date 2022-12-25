<template>
  <div>
    <!-- 打开遮罩层内容调用openMask(),关闭遮罩层调用closeMsk() -->
    <button @click="openMask()">打开遮罩层</button>
    <div class="mask-overall" v-if="showMask">
      <!-- 遮罩层里面的内容 -->
      <div class="mask-main">
        <!-- <button @click="closeMsk()">关闭遮罩层</button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import { useStore } from "vuex";
import { watch } from '@vue/runtime-core';
export default {
  setup() {
    const store = useStore();
    const state = reactive({
      showMask: false,
    });
	watch(()=>store.state.load,()=>{
		console.log(store.state);
		if(store.state.load){
			stop()
			state.showMask = true;
			console.log(11);
		}else{
			state.showMask = false;
			console.log(22);
			move()
		}
	})
    const openMask = () => {
      this.showMask = true;
    };
    const closeMsk = () => {
      this.showMask = false;
    };
    const stop = () => {
      var mo = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", mo, false); //禁止页面滑动
    };
    /***取消滑动限制***/
    const move = () => {
      var mo = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", mo, false);
    };
    return { ...toRefs(state), store, openMask, closeMsk, stop, move };
  },
  //   watch: {
  //     showMask(newVal) {
  //       if (newVal) {
  //         this.stop();
  //       } else {
  //         this.move();
  //       }
  //     },
  //   },
  //   methods: {
  //     openMask() {
  //       this.showMask = true;
  //     },
  //     closeMsk() {
  //       this.showMask = false;
  //     },
  //   },
};
</script>

<style lang="scss" scoped>
.mask-overall {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  height: 100%;
  animation: move 0.3s linear;
  animation-fill-mode: forwards;
  @keyframes move {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .mask-main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 60px; //大小可自己定义
    height: 60px;
    // background-color: #fff;
    &:before {
      content: "";
      width: 50px;
      height: 5px;
      background: #000;
      opacity: 0.1;
      position: absolute;
      top: 59px;
      left: 0;
      border-radius: 50%;
      animation: shadow 0.5s linear infinite;
    }
    &:after {
      content: "";
      width: 60px;
      height: 60px;
      background: #00adb5;
      animation: animate 0.5s linear infinite;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 3px;
    }
  }
}
@keyframes animate {
  17% {
    border-bottom-right-radius: 3px;
  }
  25% {
    transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 40px;
  }
  75% {
    transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes shadow {
  0%,
  100% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.2, 1);
  }
}
</style>
