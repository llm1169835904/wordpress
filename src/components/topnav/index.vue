<template>
  <div class="main_top">
    <div class="content">
      <div class="nav">
        <div class="list" @click="home">
          <span class="pic"></span>
          <a href="#">首页</a>
        </div>
        <div class="list" @click="echarts">
          <span class="pic"></span>
          <a href="#">工具箱</a>
        </div>
        <div class="list">
          <span class="pic"></span>
          <a href="http://124.223.98.94:82/#/">网抑云</a>
        </div>
        <div class="list">
          <span class="pic"></span>
          <a href="#">更多资料</a>
        </div>
        <div class="list">
          <span class="pic"></span>
          <a href="#">关于</a>
        </div>
      </div>
      <el-button v-if="show" @click="goLogin">退出登陆</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      show: sessionStorage.getItem("user") ? true : false,
    });
    const goLogin = () => {
      window.sessionStorage.clear();
      // router.push("/login");
      // setTimeout(() => {
      window.location.reload();
      // }, 2000);
    };
    const home = () => {
      router.push("/");
    };
    const echarts = () => {
      router.push("/echarts");
    };

    return { goLogin, home, echarts, ...toRefs(state) };
  },
};
</script>

<style lang="scss" scoped>
.main_top {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  // background: #fff;
  z-index: 9;
  background-color: rgba(255, 255, 255, 0.9);
  .content {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    .nav {
      height: 60px;
      // background: #Bfa;
      display: flex;
      align-items: center;
      .list {
        float: left;
        height: 30px;
        display: flex;
        align-items: center;
        margin: 0 5px;
        cursor: pointer !important;
        cursor: url(../../assets/hand.png), pointer !important;
        padding: 20px;
        .pic {
          width: 22px;
          height: 22px;
          display: inline-block;
          background-size: 100% 100% !important;
        }
        &:hover a {
          color: #00adb5;
        }
      }
      & .list:nth-child(2) {
        .pic {
          background-image: url(../../assets/kq1.png);
        }
        &:hover .pic {
          background-image: url(../../assets/kq.png);
        }
      }
      & .list:nth-child(3) {
        .pic {
          background-image: url(../../assets/yy.png);
        }
        &:hover .pic {
          background-image: url(../../assets/yy1.png);
        }
      }
      & .list:nth-child(4) {
        .pic {
          background-image: url(../../assets/gg.png);
        }
        &:hover .pic {
          background-image: url(../../assets/gg1.png);
        }
      }
      & .list:nth-child(5) {
        .pic {
          background-image: url(../../assets/gd.png);
        }
        &:hover .pic {
          background-image: url(../../assets/gd2.png);
        }
      }
      & .list:nth-child(1) {
        .pic {
          background-image: url(../../assets/shouye.png);
        }
        &:hover .pic {
          background-image: url(../../assets/shouye1.png);
        }
      }
      // a {
      //   display: block;
      //   padding: 0 15px;
      //   margin-right: 2px;
      //   width: 100px;
      //   height: 60px;
      //   float: left;
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      //   div {
      //     cursor: pointer !important;
      //     cursor: url(../../assets/hand.png), pointer !important;
      //     height: 30px;
      //     display: flex;
      //     align-items: center;
      //     .pic {
      //       width: 22px;
      //       height: 22px;
      //       margin-bottom: 2px;
      //       background-size: 100% 100% !important;
      //       margin-right: 2px;
      //     }
      //     span {
      //       display: inline-block;
      //       height: 30px;
      //       line-height: 30px;
      //       font-weight: bold;
      //     }
      //   }
      //   &:hover {
      //     color: #1296db;
      //   }
      // }
      // & a:nth-child(1) {
      //   .pic {
      //     background-image: url(../../assets/shouye.png);
      //   }
      //   &:hover .pic {
      //     background-image: url(../../assets/shouye1.png);
      //   }
      // }
    }
  }
}
.el-button {
  position: fixed;
  right: 0;
}
</style>
