<template>
  <div class="main">
    <div class="content">
      <div class="l">
        <div class="list" v-for="i in data" :key="i.id">
          <el-card class="box-card">
            <div
              class="pic"
              @click="goDetail(i.id)"
              v-if="imgFilters(i.content.rendered).length !== 0"
            >
              <img :src="imgFilters(i.content.rendered)" alt="" />
            </div>
            <div v-else class="pic s" @click="goDetail(i.id)">
              <img src="@/assets/img4.png" alt="" />
            </div>
            <div class="title">
              <h2 @click="goDetail(i.id)">{{ i.title.rendered }}</h2>
              <p class="content" v-html="textFilters(i.content.rendered)"></p>
              <div class="tags">
                <span v-if="i.categories.length !== 0 && i.categories[0] !== 1">
                  <span v-for="(i, index) in i.categories" :key="index">
                    <el-tag class="ml-2" size="small" effect="plain"
                      ><el-icon><CollectionTag /></el-icon>{{ tagsFilters(i) }}
                    </el-tag>
                  </span></span
                >
              </div>
              <span class="time">{{ dateFilters(i.date) }}</span>
            </div>
          </el-card>
          <el-popconfirm
            title="确认删除?"
            @cancel="del_no"
            @confirm="del_yes(i.id)"
            v-if="userId"
          >
            <template #reference>
              <el-button
                class="del"
                @click.stop=""
                type="danger"
                size="small"
                round
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          @update:current-page="currentPage"
          :current-page="page"
          :total="total"
        />
        <div class="side">
          <el-affix :offset="130">
            <el-card class="box-card" @click="add">
              <div class="pic">
                <!-- <img src="../../assets/add-text.png" alt="" /> -->
              </div>
            </el-card>
            <el-card class="box-card">
              <div class="pic">
                <!-- <img src="../../assets/add-text.png" alt="" /> -->
              </div>
            </el-card>
          </el-affix>
        </div>
      </div>
      <div class="r">
        <!-- <el-card class="box-card user"> </el-card> -->
        <user></user>
        <tagslist></tagslist>
      </div>
    </div>
  </div>
  <editor :editorShow="editorShow" @editorQuit="editorQuit"></editor>
  <loading></loading>
</template>

<script>
const carouseData = [
  { url: require("@/assets/index/1.png") },
  { url: require("@/assets/index/2.png") },
  { url: require("@/assets/index/1.jpg") },
  { url: require("@/assets/index/2.jpg") },
  { url: require("@/assets/index/3.jpg") },
  { url: require("@/assets/index/4.jpg") },
];
import { articleList, delArticle, categories, tagsList } from "@/apis/api.js";
import { reactive, toRefs } from "@vue/reactivity";
import { onMounted } from '@vue/runtime-core';
import tagslist from "@/components/tagslist";
import user from "@/components/user";
import { common } from "@/mixins/index.js";
import editor from "@/components/editor";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { CollectionTag } from "@element-plus/icons-vue";
import loading from "@/components/loading";
export default {
  components: { editor, tagslist, user, CollectionTag, loading },
  setup() {
    const { imgFilters, textFilters, dateFilters } = common.setup();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      data: "",
      editorShow: false,
      total: 0,
      totalpage: "",
      page: Number(sessionStorage.getItem("page")) || 1,
      tags: [],
      userId:
        sessionStorage.getItem("user") &&
        JSON.parse(sessionStorage.getItem("user")).id == 1,
    });
    //获取列表
    // const getArticleList = async (data) => {
    //   const resp = await articleList({ page: data });
    const getTagsList = async (data, id) => {
      const resp = await tagsList({ page: data, categories: id });
      state.data = resp.data;
      for (let i in resp.headers) {
        if (i == "x-wp-total") {
          state.total = Number(resp.headers[i]);
        }
        if (i == "x-wp-totalpages") {
          state.totalpage = Number(resp.headers[i]);
        }
      }
      store.commit("setLoad", false);
      console.log(resp);
    };
    //分类列表
    const getCategories = async () => {
      categories;
      const resp = await categories();
      resp.data.forEach((i) => {
        let obj = {};
        obj.id = i.id;
        obj.name = i.name;
        state.tags.push(obj);
      });
    };
    //标签
    function tagsFilters(data, tags) {
      let s = "";
      for (let i in state.tags) {
        if (state.tags[i].id == data) {
          s = state.tags[i].name;
        }
      }
      return s;
    }
    //新建
    const add = () => {
      state.editorShow = true;
      //   console.log(1);
      //   getArticleList(1);
    };
    const editorQuit = (e) => {
      state.editorShow = e;
    };
    //跳转详情
    const goDetail = async (e) => {
      console.log(e);
      router.push({
        path: "/detail",
        query: {
          id: e,
        },
      });
    };
    //删除
    const del = async (e) => {
      store.commit("setLoad", true);
      const resp = await delArticle(e);
      // getArticleList(1);
    };
    const del_yes = (e) => {
      del(e);
    };
    const del_no = () => {};
    //分页
    const currentPage = (e) => {
      store.commit("setLoad", true);
      getTagsList(e, router.currentRoute.value.query.id);
      state.page = e;
      sessionStorage.setItem("page", e);
      document.documentElement.scrollTop = 0;
    };
    onMounted(() => {
      store.commit("setLoad", true);
    });
    getCategories();
    getTagsList(1, router.currentRoute.value.query.id);
    return {
      ...toRefs(state),
      getTagsList,
      currentPage,
      imgFilters,
      textFilters,
      add,
      editorQuit,
      goDetail,
      store,
      del,
      del_yes,
      del_no,
      carouseData,
      dateFilters,
      tagsFilters,
      getCategories,
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  .content {
    display: flex;
    justify-content: space-between;
    .l {
      position: relative;
      width: 70%;
      .list {
        position: relative;
        .el-card {
          width: 100%;
          height: 180px;
          margin-bottom: 20px;
          padding: 0 5px;
          :deep(.el-card__body) {
            padding: 10px !important;
            .pic {
              width: 180px;
              height: 150px;
              cursor: pointer;
              float: left;
              margin-right: 10px;
              padding-top: 5px;
              img {
                height: 100%;
                width: 100%;
                // margin-top: 5%;
                border-radius: 5px;
                transition: all 0.2s;
                &:hover {
                  transform: scale(1.05);
                }
              }
            }
            .s img {
              width: 150px;
              height: 100px;
              margin-top: 30px;
              margin-left: 25px;
            }
          }
          .title {
            height: 100%;
            margin-left: 190px;
            h2 {
              cursor: pointer;
              overflow: hidden; //超出隐藏
              white-space: nowrap; //不折行
              text-overflow: ellipsis; //溢出显示省略号
              display: inline-block;
              font-size: 18px;
              color: #333333;
              &:hover {
                color: #1e90ff;
              }
            }
            .content {
              color: #555555;
              font-size: 14px;
              display: -webkit-box; /*弹性伸缩盒子*/
              -webkit-box-orient: vertical; /*垂直排列*/
              line-clamp: 4;
              -webkit-line-clamp: 4; /*只显示6行*/
              overflow: hidden; /*溢出隐藏*/
              text-overflow: ellipsis; /*省略号代替*/
            }
            .tags {
              position: absolute;
              bottom: 30px;
              left: 200px;
              .el-tag {
                margin: 0 2px;
              }
            }
            .time {
              position: absolute;
              left: 200px;
              bottom: 10px;
              font-size: 12px;
              color: #666666;
            }
          }
        }
        .del {
          position: absolute;
          right: 5px;
          bottom: 5px;
        }
      }
      .side {
        position: absolute;
        top: 50px;
        left: -130px;
        .el-card {
          width: 35px;
          height: 35px;
          padding: 10px;
          margin-bottom: 15px;
          margin-left: 50px;
          background: #fff;
          border: 2px solid #fff;
          :deep(.el-card__body) {
            padding: 0;
            .pic {
              width: 35px;
              height: 35px;
              border-radius: 10px;
              background-size: 100% 100% !important;
              background: url(../../assets/add.png);
            }
          }
          &:hover {
            border: 2px solid #515151;
            padding: 10px;
            .pic {
              background: url(../../assets/add1.png);
            }
          }
        }
      }
    }
    .r {
      width: 28%;
      height: 800px;
      .user {
        height: 300px;
      }
    }
  }
}

.box-card {
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: box-shadow, transform;
  transition-property: box-shadow, transform;
  &:hover {
    box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.5);
    // -webkit-transform: scale(1.1);
    // transform: scale(1.02);
  }
}
</style>
