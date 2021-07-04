<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图片名称">
          <a-input placeholder="请输入图片名称" v-decorator="['picturename', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图片">
            <j-image-upload @change="change" class="avatar-uploader" text="上传" v-model="fileList"></j-image-upload>
        </a-form-item>
        
        <a-form-item label="位置"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select style="width: 200px" placeholder="请选择" v-decorator="['picturetwo', {}]" >
            <a-select-option value="左下"> 左下</a-select-option>
            <a-select-option value="右上"> 右上</a-select-option>
            <a-select-option value="右中"> 右中</a-select-option>
            <a-select-option value="右下"> 右下</a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from "moment"
import JImageUpload from '../../../components/jeecg/JImageUpload'

export default {
  name: "SysPictureModal",
  components: {
    JImageUpload
  },
  data () {
    return {
      title: "操作",
      visible: false,
      fileList:[],
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
      },
      url: {
        add: "/sysPicture/sysPicture/add",
        edit: "/sysPicture/sysPicture/edit",
      },
    }
  },
  created () {
  },
  methods: {
    change(data){
      this.model.pictureone = data
    },
    add () {
      this.edit({});
    },
    edit (record) {
      console.log(record);
      setTimeout(() => {
            this.fileList = record.pictureone;
          }, 5)
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'picturename','picturetwo'))
        //时间格式化
      });

    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk () {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          //时间格式化

          console.log(formData)
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })



        }
      })
    },
    handleCancel () {
      this.close()
    },


  }
}
</script>

<style lang="less" scoped>
</style>