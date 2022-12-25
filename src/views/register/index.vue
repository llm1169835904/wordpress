<template>
  <div>
    <el-icon :size="50" :color="color">
      <Edit />
    </el-icon>
    <el-icon :size="50" :color="color">
      <FullScreen />
    </el-icon>
    <el-icon :size="50" :color="color">
      <CirclePlus />
    </el-icon>
    <el-icon :size="50" :color="color">
      <Lock />
    </el-icon>
  </div>
</template>
<script>
import { Edit,FullScreen,Lock,CirclePlus } from "@element-plus/icons-vue";

export default {
  components: {
    Edit,FullScreen,Lock,CirclePlus
  },
  name: "Aside",
};
</script>