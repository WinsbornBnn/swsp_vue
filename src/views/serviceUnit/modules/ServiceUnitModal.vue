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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位名称">
          <a-input placeholder="请输入单位名称" v-decorator="['dwmc', {rules: [{ required: true, message: '请输入单位名称 ' }]}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="组织机构代码">
          <a-input placeholder="请输入组织机构代码" v-decorator="['zzjg', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位所在地">
          <a-input placeholder="请输入单位所在地" v-decorator="['dwszd', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位地址">
          <!-- <a-input placeholder="请输入单位地址" v-decorator="['dwdz', {}]" /> -->
          <a-input-search placeholder="请输入单位地址" size="large" v-decorator="['dwdz', {}]" @search="onSearch">
            <a-button slot="enterButton"> 打开地图 </a-button>
          </a-input-search>
          <j-map-input-desc
            ref="mapInputDesc"
            :inputValue="model.dwdz"
            @mapLocationSave="mapLocationSave"
          ></j-map-input-desc>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位类型">
          <a-input placeholder="请输入单位类型" v-decorator="['dwlx', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用水人数（人）">
          <a-input placeholder="请输入用水人数（人）" v-decorator="['ysrs', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="年实际用水量（万m³）">
          <a-input-number v-decorator="['sjysl', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="人均用水量（m³）">
          <a-input placeholder="请输入人均用水量（m³）" v-decorator="['rjysl', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公布节水型生活服务业单位文件">
          <a-input placeholder="请输入公布节水型生活服务业单位文件" v-decorator="['dwwj', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公布单位名称">
          <a-input placeholder="请输入公布单位名称" v-decorator="['gbdw', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联合公布单位名称">
          <a-input placeholder="请输入联合公布单位名称" v-decorator="['lhgbdw', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公布单位级别">
          <a-input placeholder="请输入公布单位级别" v-decorator="['gbdwjb', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公布时间">
          <a-input placeholder="请输入公布时间" v-decorator="['gbsj', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="复核时间">
          <a-input placeholder="请输入复核时间" v-decorator="['fhsj', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-input placeholder="请输入备注" v-decorator="['bz', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="年度">
          <a-input placeholder="请输入年度" v-decorator="['nd', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="节水措施">
          <a-input placeholder="请输入节水措施" v-decorator="['jscs', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传图片">
          <j-more-image-upload
            class="avatar-uploader"
            text="上传"
            v-model="fileList"
            @change="change"
          ></j-more-image-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from "moment"
import JMapInputDesc from '../../../components/jeecg/JMapInputDesc.vue'
import JMoreImageUpload from '../../../components/jeecg/JMoreImageUpload'

export default {
  name: "ServiceUnitModal",
  components: {
    JMapInputDesc,
    JMoreImageUpload
  },
  data () {
    return {
      title: "操作",
      mapVisible: false,
      fileList: [],
      visible: false,
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
        add: "/serviceUnit/serviceUnit/add",
        edit: "/serviceUnit/serviceUnit/edit",
      },
    }
  },
  created () {
  },
  methods: {
    onSearch (value) {
      this.mapVisible = !this.mapVisible
      this.$refs.mapInputDesc.show()
    },
    mapLocationSave (data) {
      this.model.dwdz = data.address
      this.model.xcoor = data.latitude
      this.model.ycoor = data.longitude
      this.form.setFieldsValue(pick(this.model,'dwdz'))
    },
    change(data){
      this.model.images = data
    },
    add () {
      this.edit({});
    },
    edit (record) {
      setTimeout(() => {
        this.fileList = record.images;
      }, 5)
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'dwmc', 'zzjg', 'dwszd', 'dwdz', 'dwlx', 'ysrs', 'sjysl', 'rjysl', 'dwwj', 'gbdw', 'lhgbdw', 'gbdwjb', 'gbsj', 'fhsj', 'bz', 'nd', 'jscs'))
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