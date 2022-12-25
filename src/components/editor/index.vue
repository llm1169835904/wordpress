<template>
  <div class="wangeditor-box posr main">
    <!-- editorShow -->
    <el-dialog
      :model-value="editorShow"
      :show-close="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >

      <el-input
        v-model="title"
        maxlength="35"
        placeholder="Please input"
        show-word-limit
        type="text"
      />
      <span class="btn">
        <el-button v-if="!$store.state.edit" @click="add">新建</el-button>
        <el-button v-else @click="getAlterArticle">提交</el-button>
        <el-button @click="editorQuit">关闭</el-button>
      </span>
      <!-- <el-input v-model="title" placeholder="Please input" /> -->
      <div class="tags">
        <el-select
          v-model="tagsData"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="标签"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="border: 1px solid #ccc">
        <Toolbar
          :editor="editorRef"
          style="border-bottom: 1px solid #ccc"
          :default-config="toolbarConfig"
          class="tool-class"
          :mode="mode"
        />
        <Editor
          v-model="valueHtml"
          :default-config="editorConfig"
          class="editor-class"
          style="height: 400px; overflow-y: hidden; font-size: 14px"
          :mode="mode"
          @onCreated="handleCreated"
          @onChange="handleonChange"
          @onFocus="handleonFocus"
          v-loading="$store.state.loading"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import OnlyMessage from '@/utils/onlyMsgbox'
import {
  onBeforeUnmount,
  ref,
  reactive,
  shallowRef,
  onMounted,
  watch,
  toRefs,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import {
  media,
  alterArticle,
  addArticle,
  categories,
  articleList,
} from "@/apis/api.js";
import { useStore } from "vuex";
// import hljs from "highlight.js";
// import "highlight.js/styles/monokai-sublime.css";
export default {
  components: { Editor, Toolbar },
  props: {
    value: {
      default() {
        return "";
      },
      type: String,
    },
  },
  props: ["editorShow", "editorValue"],
  emits: ["changeEdit"],
  setup(props, ctx) {
    const editorRef = shallowRef();
    const dialogVisible = ref(true);
    const store = useStore();
    const state = reactive({
      id: "",
      title: "",
      valueHtml: "",
      tagsData: [],
      options: "",
    });
    onMounted(() => {});
    watch(
      () => props.editorShow,
      (newValue, oldValue) => {
        console.log(props.editorShow);
        if (props.editorShow) {
          console.log(editorRef);
          if (props.editorValue) {
            handleCreated();
            state.id = props.editorValue.id;
            state.title = props.editorValue.title.rendered;
            state.valueHtml = props.editorValue.content.rendered;
            state.tagsData = props.editorValue.categories;
          }
        } else {
          editorRef.value.clear();
        }
      }
    );
    //添加
    const add = async () => {
      store.commit("setLoading", true);
      let title = state.title;
      let content = state.valueHtml;
      let categories = [...state.tagsData];
      const resp = await addArticle({ title, content, categories });
      getArticleList();
      ctx.emit("editorQuit", false);
      store.commit("setLoad", true);
      console.log(resp);
    };
    //获取列表
    const getArticleList = async () => {
      const resp = await articleList({ page: 1 });
      store.commit("setLoad", false);
      state.data = resp.data;
      console.log(resp);
    };
    const add1 = () => {
      store.commit("setLoading", true);
    };
    //编辑
    const getAlterArticle = async () => {
      store.commit("setLoading", true);
      let id = state.id;
      let content = state.valueHtml;
      let title = state.title;
      let categories = [...state.tagsData];
      const resp = await alterArticle({ id, content, title, categories });
      ctx.emit("editorQuit", false);
      // store.commit("setLoad", true);
      console.log(resp);
    };
    //获取分类
    const getCategories = async () => {
      const resp = await categories();
      state.options = resp.data.map((item, index) => {
        return Object.assign({}, { value: item.id, label: item.name });
      });
      state.tags = state.options;
    };
    const editorQuit = () => {
      store.commit("setEdit", 0);
      ctx.emit("editorQuit", false);
    };
    const toolbarConfig = {
      /* 工具栏配置 */
      toolbarKeys: [
        "headerSelect",
        "bold",
        "underline",
        "clearStyle",
        "through",
        "color",
        "bgColor",
        "codeBlock",
        // 菜单组，包含多个菜单
        "uploadImage",
        "insertImage",
        {
          key: "group-link",
          title: "链接",
          menuKeys: ["insertLink", "editLink", "unLink", "viewLink"],
        },
        {
          key: "group-table",
          title: "表格",
          menuKeys: [
            "insertTable",
            "deleteTable",
            "insertTableRow",
            "deleteTableRow",
            "insertTableCol",
            "deleteTableCol",
            "tableHeader",
            "tableFullWidth",
          ],
        },
        "divider",
        "emotion",
        "blockquote",
        "justifyLeft",
        "justifyRight",
        "justifyCenter",
        "divider",
      ],
    };
    const editorConfig = {
      placeholder: "请输入内容...",
      MENU_CONF: {
        uploadImage: {
          customUpload: async (file, insertFn) => {
            let formdata = new FormData();
            formdata.append("file", file);
            formdata.append("type", "normal");
            const resp = await media(formdata);
            console.log(resp, "++++++++++++++");
            insertFn(resp.data.source_url);
          },
        },
      },
    };
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    const handleCreated = (editor) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
      // editor.highlight = hljs;
    };
    // 拿到所有的数据
    const handleonChange = (editor) => {
      console.log("content", editor.children);
      console.log("state.valueHtml", state.valueHtml);
      // 返回的是所有的Html 和所有的数据
      ctx.emit("changeEdit", editor.children, state.valueHtml);
    };
    // 拿到所有的数据
    const handleonFocus = (editor) => {
      // 返回的是所有的Html 和所有的数据
      ctx.emit("changeEdit", editor.children, state.valueHtml);
    };
    getCategories();
    return {
      ...toRefs(state),
      editorRef,
      mode: "default", // 或 'simple' 'default'
      editorQuit,
      dialogVisible,
      toolbarConfig,
      getAlterArticle,
      editorConfig,
      handleCreated,
      handleonChange,
      handleonFocus,
      getCategories,
      add,
      add1,
      store,
    };
  },
};
</script>
<style lang="scss">
.main {
  .el-dialog__body {
    & > .el-input {
      width: 50%;
    }
  }
  .tags {
    .el-select {
      width: 100%;
      margin: 10px 0;
    }
  }
  .editor-class {
    height: 700px !important;
  }
}
.el-dialog {
  width: 100%;
  height: 960px;
  max-width: 1200px;
  border-radius: 10px;
  margin-top: 50px;
  .tag {
    .el-input__inner {
      height: 100%;
      font-size: 20px;
      font-weight: 500;
    }
  }
}
.editor-upload-img {
  position: absolute;
  top: 5px;
  left: 8px;
  z-index: 1;
  color: #666;
  width: 64px;
  height: 32px;
}
// 去掉全屏
.w-e-toolbar .w-e-bar-item:last-child .w-e-menu-tooltip-v5 {
  display: none;
}
.w-e-toolbar .w-e-bar-item:nth-child(26) {
  display: none;
}
// 隐藏上传网络图片
.w-e-toolbar
  .w-e-bar-item:nth-child(23)
  .w-e-bar-item-menus-container
  .w-e-bar-item:first-child {
  display: none;
}
.w-e-toolbar .w-e-bar-item:nth-child(24) {
  display: none;
}
.btn {
  .el-button {
    margin-left: 20px;
    width: 100px;
  }
}
</style>
