<template>
  <el-card class="box-card all_tags" v-loading="loading">
    <p>标签列表</p>
    <span v-for="(i, index) in tags" :key="index" @click="goTagsList(i.id)">
      <el-button round>
        <span :style="randomRgb()">{{ i.name }}</span>
      </el-button>
    </span>
  </el-card>
</template>

<script>
import { categories } from "@/apis/api.js";
import { reactive, toRefs, watch } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { el } from "element-plus/es/locale";
export default {
  setup() {
    const router = useRouter();
    const state = reactive({
      tags: [],
      tag: [],
      loading: true,
    });

    // watch(() => router.currentRoute.value.path,(toPath) => {
    //     //要执行的方法
    //  },{immediate: true,deep: true})
    //分类列表
    const getCategories = async () => {
      const resp = await categories();
      resp.data.forEach((i) => {
        let obj = {};
        obj.id = i.id;
        obj.name = i.name;
        state.tags.push(obj);
        sessionStorage.setItem("tags", JSON.stringify(state.tags));
      });
      state.loading = false;
    };
    if (sessionStorage.getItem("tags")) {
      state.tags = JSON.parse(sessionStorage.getItem("tags"));
      state.loading = false;
    } else {
      getCategories();
    }
    //跳转分类页面
    // const goTagsList = (e) => {
    //   router.push({
    //     path: "/over",
    //     query: {
    //       id: e,
    //     },
    //   });
    // };
    const goTagsList = (e) => {
      router.push({
        path: "/tags",
        query: {
          id: e,
        },
      });
    };
    //随机颜色
    const randomRgb = (item) => {
      let R = Math.floor(Math.random() * 130 + 110);
      let G = Math.floor(Math.random() * 130 + 110);
      let B = Math.floor(Math.random() * 130 + 110);
      return {
        color: "rgb(" + R + "," + G + "," + B + ")",
      };
    };

    // getCategories();
    return { ...toRefs(state), getCategories, goTagsList, randomRgb };
  },
};
</script>

<style lang="scss" scoped>
.all_tags {
  margin-top: 20px;
  p {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid rgb(158, 157, 157);
    position: relative;
    padding-bottom:10px ;
    margin-bottom: 10px;
    &::after{
      content: '';
      position: absolute;
      width: 70px;
      height: 2px;
      background-color: black;
      bottom: -1px;
      left: 0;
    }
  }
  .el-button {
    margin: 5px;
    border: none;
    &:hover {
      background: #c23616;
      span {
        color: #fff !important;
      }
    }
  }
}
</style>
