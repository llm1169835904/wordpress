<template>
  <div class="main">
    <div class="content">
      <el-card class="box-card">
        <div class="l">
          <div class="btn_content">
            <!-- <button @click="add">新增</button>
          <button @click="confirm">现存</button> -->
            <div>
              <button @click="go">返回</button>
            </div>
          </div>
          <div id="chart"></div>
        </div>
        <div class="r">
          <div id="main"></div>
          <div id="main1"></div>
        </div>
      </el-card>
    </div>
  </div>
  <loading></loading>
</template>
<script>
import * as echarts from "echarts";
import chinaMapJson from "@/map/china.json";
import { toRefs, reactive, onMounted } from "vue";
import { echList, echList1, echList2 } from "@/apis/api.js";
import loading from "@/components/loading";
import { useStore } from "vuex";
export default {
  components: { loading },
  setup() {
    const store = useStore();
    const state = reactive({
      map: "china",
      data: [], //现有确诊
      data1: [], //现有确诊
      province_data: [],
      all_data: [],
      name: "",
      date: [],
      local_data: [], //现有确诊
      confirm_data_l: [], //现存确诊
      confirm_data_r: [], //现存确诊
      switch: 1, //1现存 2新增
    });
    const getEchList = async () => {
      const resp = await echList();
      state.all_data = resp.data.data.diseaseh5Shelf.areaTree;
      let arr = resp.data.data.diseaseh5Shelf.areaTree[0].children;
      state.data = dataFilter(arr);
      state.confirm_data_l = dataFilter(arr);
      state.province_data = state.data;
      console.log(resp);
    };
    const getEchList1 = async () => {
      const res = await echList1();
      let arr = res.data.data.chinaDayAddListNew;
      let arr1 = res.data.data.chinaDayListNew;
      state.date = [];
      arr1.forEach((i) => {
        state.data1.push(i.localConfirm);
      }); //现有

      //   arr.forEach((i) => {
      //     state.add_data_r.push(i.localConfirmadd);
      //   }); //新增
      arr1.forEach((i) => {
        state.confirm_data_r.push(i.localConfirm);
      }); //现有

      arr.forEach((i) => {
        state.date.push(i.date);
      }); //时间
      list();
    };
    const getEchList2 = async (params) => {
      const res = await echList2({ adCode: params });
      console.log(res, "++");
      state.data1 = [];
      res.data.data.forEach((i) => {
        state.data1.push(i.all_local_confirm_add);
      });
      list();
    };
    var myChart;
    var myChart1;
    var myChart2;
    if (myChart != null && myChart != "" && myChart != undefined) {
      myChart.dispose();
    }
    if (myChart1 != null && myChart1 != "" && myChart1 != undefined) {
      myChart1.dispose();
    }
    if (myChart2 != null && myChart2 != "" && myChart2 != undefined) {
      myChart2.dispose();
    }
    const list = () => {
      store.commit("setLoad", false);
      myChart = echarts.init(document.getElementById("chart"));
      myChart1 = echarts.init(document.getElementById("main"));
      myChart2 = echarts.init(document.getElementById("main1"));
      let options = {
        // title: {
        //   text: state.switch == 1 ? "现存" : "新增",
        // },
        tooltip: {
          show: false,
        },
        visualMap: {
          min: 0,
          max: 1000,
          text: ["High", "Low"],
          realtime: false,
          calculable: true,
          inRange: {
            color: ["#ffffff", "#b80909"],
          },
        },
        series: [
          {
            type: "map",
            map: state.map,
            data: state.data,
          },
        ],
      };
      let options1 = {
        title: {
          text: "Referer of a Website",
          subtext: "Fake Data",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: state.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      let options2 = {
        xAxis: {
          type: "category",
          data: state.date,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: state.data1,
            type: "line",
            smooth: true,
          },
        ],
      };
      myChart.setOption(options);
      myChart1.setOption(options1);
      myChart2.setOption(options2);
      myChart.off("click");
      myChart.on("click", (params) => {
        goDown(params.name);
        state.name = params.name;
        let adCode = {
          新疆: 630000,
          西藏: 540000,
          内蒙古: 150000,
          青海: 630000,
          四川: 510000,
          黑龙江: 230000,
          甘肃: 620000,
          云南: 530000,
          广西: 450000,
          湖南: 430000,
          陕西: 610000,
          广东: 440000,
          吉林: 220000,
          河北: 130000,
          湖北: 420000,
          贵州: 520000,
          山东: 370000,
          江西: 360000,
          河南: 410000,
          辽宁: 210000,
          山西: 140000,
          安徽: 340000,
          福建: 350000,
          浙江: 330000,
          江苏: 320000,
          重庆: 500000,
          宁夏: 640000,
          海南: 430000,
          台湾: 710000,
          北京: 110000,
          天津: 120000,
          上海: 310000,
          香港: 810000,
          澳门: 820000,
        }[params.name];
        getEchList2(adCode);
        console.log(adCode);
        let arr = state.all_data[0].children;
        arr.some((i) => {
          if (i.name == state.name) {
            state.data = dataFilter(i.children);
            return;
          }
        });
      });
    };
    const go = () => {
      state.map = "china";
      goChinaDown();
      state.name = "";
      if (state.switch == 1) {
        state.data = state.confirm_data_l;
        state.data1 = state.confirm_data_r;
      } else {
        state.data = state.add_data_l;
        state.data1 = state.add_data_r;
      }
    };
    //跳转下级
    const goDown = async (name) => {
      const newMapJson = await getMapJson(name);
      echarts.registerMap(state.map, newMapJson);
      list();
    };
    const getMapJson = async (name) => {
      const jsonData = await import("@/map/province/" + name + ".json");
      state.map = name;
      return jsonData.default;
    };
    //返回
    const goChinaDown = async () => {
      const newMapJson = await getChinaMapJson();
      echarts.registerMap(state.map, newMapJson);
      list();
    };
    const getChinaMapJson = async () => {
      const jsonData = await import("@/map/china.json");
      return jsonData.default;
    };
    onMounted(() => {
      store.commit("setLoad", true);
      echarts.registerMap("china", chinaMapJson);
      setTimeout(() => {
        list();
      }, 500);
    });
    //现有数据处理
    const dataFilter = (arr) => {
      return arr.map((item) => {
        return Object.assign({
          name: item.name,
          value: item.total.nowConfirm,
        });
      });
    };
    getEchList();
    getEchList1();
    return {
      ...toRefs(state),
      getEchList,
      dataFilter,
      list,
      goDown,
      getMapJson,
      goChinaDown,
      getChinaMapJson,
      getEchList1,
      getEchList2,
      go,
      store,
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  .content {
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 100%;
    }
    //   background: #fff;
    .l {
      // float: left;
      position: relative;
      #chart {
        width: 800px;
        height: 500px;
        margin: 0 auto;
        // border: 1px solid black;
      }
      .btn_content {
        position: absolute;
        left: 50px;
        top: 150px;
        z-index: 10;
        button {
          padding: 5px 20px;
        }
      }
    }
    .r {
      // float: right;
      display: flex;
      justify-content: center;
      #main {
        width: 650px;
        height: 450px;
        // border: 1px solid black;
      }
      #main1 {
        width: 650px;
        height: 450px;
        // border: 1px solid black;
      }
    }
  }
}
</style>
