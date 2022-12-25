<template>
  <div class="main_user">
    <el-card class="box-card">
      <div class="pic">
        <el-avatar
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
      </div>
      <div class="name">{{ name }}</div>
      <div class="icon">
        <el-button color="#6c5ce7">关注</el-button>
        <el-button color="#00b894">私信</el-button>
      </div></el-card
    >
  </div>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
export default {
  setup(props) {
    const state = reactive({
      name: sessionStorage.getItem("user")? JSON.parse(sessionStorage.getItem("user")).name:'----',
    });
    if (sessionStorage.getItem("user")) {
      state.name = JSON.parse(sessionStorage.getItem("user")).name;
    } else {
      state.name = "----";
    }
    return { ...toRefs(state) };
  },
};
</script>

<style lang="scss" scoped>
.main_user {
  .el-card {
    .pic {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }
    .name {
      text-align: center;
    }
    .icon {
      margin: 30px;
      display: flex;
      justify-content: center;
      .el-button {
        width: 100px;
      }
    }
  }
}
</style>
