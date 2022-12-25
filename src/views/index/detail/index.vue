<template>
  <div class="main">
    <div class="content">
      <el-card class="box-card title" v-loading="title_load">
        <div class="back">
          <div @click="quit">
            <el-icon> <ArrowLeftBold /></el-icon>
            <span class="text">back</span>
          </div>
          <span class="back_line"> | </span>
          <span class="title">{{ title }}</span>
        </div>
        <h2>{{ title }}</h2>
        <p>发布于：{{ dateFilters(time) }}</p>
        <div class="icon">
          <el-button v-if="userId" class="edit" @click="edit">编辑</el-button>
        </div>
        <span class="line"></span>
        <div v-html="content" v-highlight></div>
      </el-card>
      <div class="l"></div>
      <div class="r"></div>
      <el-card class="box-card comment">
        <div class="add">
          <el-input
            v-model="textarea"
            :rows="3"
            type="textarea"
            placeholder="评论~"
          />
          <el-row :gutter="20" v-if="userShow == null">
            <el-col :span="8">
              <el-input v-model="name" placeholder="姓名"
            /></el-col>
          </el-row>
        </div>
        <el-button @click="getAddComments" color="#626aef">发表评论</el-button>
        <div class="line"></div>
        <div v-loading="comment_load">
          <div v-for="i in comment" :key="i.id">
            <div v-if="i.author_name == ''" class="list">
              <div class="icon">
                <img src="../../../assets/user-comment.png" alt="" />
              </div>
              <div class="r">
                <p class="name">匿名用户:</p>
                <p v-html="i.content.rendered"></p>
                <p class="time">{{ dateFilters(i.date) }}</p>
              </div>
            </div>
            <div v-else class="list">
              <div class="icon">
                <img src="../../../assets/user-comment.png" alt="" />
              </div>
              <div class="r">
                <p class="name">{{ i.author_name }}</p>
                <p v-html="i.content.rendered"></p>
                <p class="time">{{ dateFilters(i.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
  <editor
    :editorShow="editorShow"
    :editorValue="editorValue"
    @editorQuit="editorQuit"
  ></editor>
  <loading></loading>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { detail, addComments, getComments } from "@/apis/api.js";
import { ArrowLeftBold } from "@element-plus/icons-vue";
import loading from "@/components/loading";
import editor from "@/components/editor";
import { onMounted, reactive, ref, toRefs } from "vue";
// import { onMounted } from '@vue/runtime-core';
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { common } from "@/mixins/index.js";
export default {
  components: { editor, ArrowLeftBold, loading },
  setup(props) {
    const { dateFilters } = common.setup();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      data: "",
      title: "",
      time: "",
      content: "",
      textarea: "",
      name: "",
      email: "",
      comment: [],
      editorShow: false,
      title_load: false,
      comment_load: false,
      editorValue: "",
      userId:
        sessionStorage.getItem("user") &&
        JSON.parse(sessionStorage.getItem("user")).id == 1,
      userShow: sessionStorage.getItem("user"),
    });
    const editorQuit = (e) => {
      state.editorShow = e;
      if (!e) {
        state.title_load = true;
        getDetail(router.currentRoute.value.query.id);
      }
    };
    //详情内容
    const getDetail = async (id) => {
      const resp = await detail(id);
      state.data = resp.data;
      state.editorValue = resp.data;
      state.title = resp.data.title.rendered;
      state.content = resp.data.content.rendered;
      state.time = resp.data.date;
      console.log(resp, "详情");
      state.title_load = false;
      store.commit("setLoad", false);
    };
    //获取评论
    const comments = async () => {
      const resp = await getComments({
        post: router.currentRoute.value.query.id,
      });
      state.comment = [];
      resp.data.forEach((i) => {
        if (i.parent == 0) {
          state.comment.push(i);
        }
      });
      // state.commentLoad = false;
      // state.comment_load = false;
      // store.commit("setLoading", false);
    };
    //发布新评论
    const getAddComments = async () => {
      // state.commentLoad = true;
      store.commit("setLoading", true);
      if (state.userShow) {
        state.name = state.userShow.user_nicename;
      }
      const resp = await addComments({
        post: router.currentRoute.value.query.id,
        content: state.textarea,
        author_name: state.name,
      });
      if (resp.status == 201) {
        console.log(resp, "发布新评论");
        state.textarea = "";
        state.name = "";
        comments();
      }
    };
    //编辑
    const edit = () => {
      state.editorShow = true;
      store.commit("setEdit", true);
    };
    const quit = () => {
      // router.push("/");
      router.back();
    };
    comments();
    // store.commit("setLoad", true);
    // setTimeout(() => {
    //   store.commit("setLoad", false);
    // }, 500);
    onMounted(() => {
      store.commit("setLoad", true);
    });
    getDetail(router.currentRoute.value.query.id);
    return {
      ...toRefs(state),
      getDetail,
      editorQuit,
      store,
      comments,
      getAddComments,
      dateFilters,
      quit,
      edit,
    };
  },
};
</script>
<style lang="scss" scoped>
.main {
  .content {
    width: 100%;
    &:deep(.el-card__body) {
      padding: 40px;
    }
    .title {
      position: relative;
      .back {
        color: #787878;
        display: flex;
        align-items: center;
        font-size: 20px;
        margin-bottom: 15px;
        .el-icon {
          font-size: 15px;
        }
        .back_line {
          font-size: 15px;
          margin: 0 5px;
        }
        .title {
          font-size: 17px;
        }
      }
      h2 {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .icon {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .line {
        display: block;
        width: 100%;
        height: 2px;
        background: #ddd;
        margin: 20px 0;
        border-radius: 15px;
      }
      .edit {
        background: yellowgreen;
      }
      p {
        color: #666666;
        font-size: 15px;
      }
    }
    .comment {
      margin-top: 30px;
      width: 100%;
      .list {
        display: flex;
        justify-content: flex-start;
        background: #e8eaed;
        padding: 5px;
        border-radius: 10px;
        margin-top: 10px;
        .icon {
          img {
            width: 30px;
            height: 30px;
          }
        }
        .r {
          margin-left: 5px;
          .name {
            line-height: 30px;
            font-size: 18px;
            font-weight: bold;
          }
          .time {
            color: #6c757d;
            font-size: 14px;
          }
        }
      }
      .line {
        width: 100%;
        height: 2px;
        background: #c8c9ca;
        border-radius: 5px;
        margin: 20px 0;
      }
      .add {
        :deep(.el-textarea) {
          width: 60%;
          margin-bottom: 20px;
        }
        .el-row {
          margin-bottom: 20px;
        }
      }
    }
  }
}
.btn {
  background: yellowgreen;
}
.el-card {
  background: #fff;
}
</style>
