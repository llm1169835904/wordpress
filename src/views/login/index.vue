<template>
  <div class="login_main">
    <el-card class="box-card">
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        style="max-width: 460px"
      >
        <el-form-item label="用户名 :">
          <el-input v-model="formLabelAlign.username" />
        </el-form-item>
        <el-form-item label="密 码 :">
          <el-input
            type="password"
            show-password
            v-model="formLabelAlign.password"
          />
        </el-form-item>
      </el-form>
      <div class="but">
        <el-button color="#626aef" @click="logins" :loading="loading"
          >登陆</el-button
        >
        <el-button color="#fff" @click="go" :loading="loading"
          >直接进入</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { login, userInfo } from "@/apis/api.js";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
export default {
  setup() {
    const labelPosition = ref("top");
    const loading = ref(false);
    const router = useRouter();
    const formLabelAlign = reactive({
      username: "",
      password: "",
    });
    const getLosin = async (username, password) => {
      try {
        const resp = await login(username, password);
        console.log(resp);
        ElNotification({
          title: "Success",
          message: "登陆成功",
          type: "success",
        });
        sessionStorage.setItem("token", resp.data.token);
        const res = await userInfo();
        sessionStorage.setItem("user", JSON.stringify(res.data));
        setTimeout(() => {
          loading.value = false;
          router.push("/");
          window.location.reload();
        }, 100);
        // setTimeout(() => {
        // }, 500);
      } catch (err) {
        console.log(err);
        ElNotification({
          title: "Error",
          message: "用户名或密码不正确！",
          type: "error",
        });
        loading.value = false;
      }
    };
    const logins = () => {
      loading.value = true;
      setTimeout(() => {
        getLosin(formLabelAlign.username, formLabelAlign.password);
      }, 500);
    };
    const go = () => {
      router.push("/");
    };
    // window.clearTimeout(setTimeout(() => {
    //   window.location.reload();
    // }, ))
    console.log("------");
    return { labelPosition, formLabelAlign, logins, loading,go };
  },
};
</script>

<style lang="scss" scoped>
.login_main {
  background: url(../../assets/bg2.jpg) no-repeat;
  background-attachment: fixed !important;
  background-size: 100% 100% !important;
  .box-card {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -150px 0 0 -250px;
    width: 420px;
    padding: 40px;
    // opacity: 0.5;
    border: none;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 0.7);
    .but {
      display: flex;
      justify-content: center;
      .el-button {
        width: 50%;
        margin-top: 20px;
        height: 35px;
      }
      .el-input__wrapper {
        height: 35px;
      }
    }
  }
}
</style>
