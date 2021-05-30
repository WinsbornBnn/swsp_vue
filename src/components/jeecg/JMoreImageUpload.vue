<template>
  <div class="clearfix">
    <a-upload
      name="file"
      listType="picture-card"
      :action="uploadAction"
      :headers="headers"
      :multiple="isMultiple"
      :fileList="fileList"
      :data="{ biz: bizPath }"
      :beforeUpload="beforeUpload"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 5">
        <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">{{ text }}</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
      <img alt="example" style="width: 100%" :src="getAvatarView()" />
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { getFileAccessHttpUrl } from '@/api/manage'

const uidGenerator = () => {
  return '-' + parseInt(Math.random() * 10000 + 1, 10);
}
const getFileName = (path) => {
  if (path.lastIndexOf("\\") >= 0) {
    let reg = new RegExp("\\\\", "g");
    path = path.replace(reg, "/");
  }
  return path.substring(path.lastIndexOf("/") + 1);
}
export default {
  name: 'JMoreImageUpload',
  props: {
    value:{
        type:[String,Array],
        required:false
      },
    text: {
      type: String,
      required: false,
      default: "上传",
    }
  },
  data () {
    return {
      uploadAction: window._CONFIG['domianURL'] + "/sys/common/upload",
      previewVisible: false,
      previewImage: '',
      fileList: [],
      headers: {},
      uploadLoading: false,
      picUrl: false,
      uploadFiles: [],
      bizPath: 'images',
      isMultiple: false,
      disabled:false
    };
  },
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token }
  },
  watch:{
      value(val){
        if (val instanceof Array) {
          this.initFileList(val.join(','))
        } else {
          this.initFileList(val)
        }
        if(!val || val.length==0){
          this.picUrl = false;
        }
      }
    },
  methods: {
    initFileList(paths){
        if(!paths || paths.length==0){
          this.fileList = [];
          return;
        }
        this.picUrl = true;
        let fileList = [];
        let arr = paths.split(",")
        for(var a=0;a<arr.length;a++){
          let url = getFileAccessHttpUrl(arr[a]);
          fileList.push({
            uid: uidGenerator(),
            name: getFileName(arr[a]),
            status: 'done',
            url: url,
            response:{
              status:"history",
              message:arr[a]
            }
          })
        }
        this.fileList = fileList
      },
    // 图片上传之前
    beforeUpload: function (file) {
      var fileType = file.type;
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片');
        return false;
      }
    },
    handleChange (info) {
      this.picUrl = false;
      let fileList = info.fileList
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          this.picUrl = true;
          fileList = fileList.map((file) => {
            if (file.response) {
              file.url = file.response.message;
            }
            return file;
          });
        }
        //this.$message.success(`${info.file.name} 上传成功!`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`);
      } else if (info.file.status === 'removed') {
        this.handleDelete(info.file)
      }
      this.fileList = fileList
      if (info.file.status === 'done' || info.file.status === 'removed') {
        this.handlePathChange()
      }
    },
    handlePathChange () {
      let arr = []
      this.fileList.forEach(item => {
        arr.push(item.response.message)
      });
      let path = arr.join(",")
      this.$emit('change', path);
    },
    handleDelete (file) {
      //如有需要新增 删除逻辑
      this.fileList.unshift()
    },
    handleCancel () {
      this.previewVisible = false;
    },
    // 预览图片
    handlePreview (file) {
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    getAvatarView(){
        if(this.fileList.length>0){
          let url = this.fileList[0].url
          return getFileAccessHttpUrl(url)
        }
      }
  },
  model: {
    prop: 'value',
    event: 'change'
  }
};
</script>
<style scoped>
</style>
