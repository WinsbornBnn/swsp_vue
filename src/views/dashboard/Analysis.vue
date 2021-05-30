<template>
  <div class="body">
    <iframe
      name="iframeMap"
      id="iframeMapViewComponent"
      width="100%"
      height="100%"
      :src="url_token"
      frameborder="0"
      scrolling="no"
      ref="iframeDom"
    ></iframe>
    <!-- <YzswHtml></YzswHtml> -->
    <!-- <index-chart v-if="indexStyle==1"></index-chart>
    <index-bdc v-if="indexStyle==2"></index-bdc>
    <index-task v-if="indexStyle==3"></index-task> -->
    <!-- <div style="width: 100%;text-align: right;margin-top: 20px">
      请选择首页样式：
      <a-radio-group v-model="indexStyle">
        <a-radio :value="1">统计图表</a-radio>
        <a-radio :value="2">统计图表2</a-radio>
        <a-radio :value="3">任务表格</a-radio>
      </a-radio-group>
    </div> -->
  </div>
</template>

<script>
import IndexChart from './IndexChart'
import IndexTask from "./IndexTask"
import IndexBdc from './IndexBdc'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import Vue from 'vue'

export default {
  name: "Analysis",
  components: {
    IndexChart,
    IndexTask,
    IndexBdc
  },
  data () {
    return {
      indexStyle: 1,
      url_token: ''
    }
  },
  created () {
    this.url_token = "/yzsw_html/index.html?token=" + Vue.ls.get(ACCESS_TOKEN)
  },
  methods: {

  }
}
</script>
<style lang="less">
.body {
  height: 850px;
  width: 100%;
  min-width: 1200px;
  min-height: 600px;
}
</style>