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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="灌区名称">
          <a-input placeholder="请输入灌区名称" v-decorator="['gqmc', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="灌区所在地">
          <a-input placeholder="请输入灌区所在地" v-decorator="['gqszd', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="灌区地址">
          <!-- <a-input placeholder="请输入灌区地址" v-decorator="['gqdz', {}]" /> -->
          <a-input-search placeholder="请输入灌区地址" size="large" v-decorator="['gqdz', {}]" @search="onSearch">
            <a-button slot="enterButton"> 打开地图 </a-button>
          </a-input-search>
          <j-map-input-desc
            ref="mapInputDesc"
            :inputValue="model.gqdz"
            @mapLocationSave="mapLocationSave"
          ></j-map-input-desc>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="灌区管理单位">
          <a-input placeholder="请输入灌区管理单位" v-decorator="['gqgldw', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="灌区规模类型">
          <a-input placeholder="请输入灌区规模类型" v-decorator="['gqgmlx', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设计灌溉面积（万亩）">
          <a-input-number v-decorator="['ssgg', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实际灌溉面积（万亩）">
          <a-input-number v-decorator="['sjgg', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主要作物">
          <a-input placeholder="请输入主要作物" v-decorator="['zyzw', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="年实际用水量（万m³）">
          <a-input-number v-decorator="['sjysl', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位作物用水量">
          <a-input placeholder="请输入单位作物用水量" v-decorator="['dwlzss', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公布节水型农业灌区文件">
          <a-input placeholder="请输入公布节水型农业灌区文件" v-decorator="['gbjsxwj', {}]" />
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
  name: "IrrigationAreaModal",
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
        add: "/irrigationArea/irrigationArea/add",
        edit: "/irrigationArea/irrigationArea/edit",
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
      this.model.gqdz = data.address
      this.model.xcoor = data.latitude
      this.model.ycoor = data.longitude
      this.form.setFieldsValue(pick(this.model,'gqdz'))
    },
    change(data){
      this.model.images = data
      this.form.setFieldsValue(pick(this.model, 'images'))
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
        this.form.setFieldsValue(pick(this.model, 'gqmc', 'gqszd', 'gqdz', 'gqgldw', 'gqgmlx', 'ssgg', 'sjgg', 'zyzw', 'sjysl', 'dwlzss', 'gbjsxwj', 'gbdw', 'lhgbdw', 'gbdwjb', 'gbsj', 'fhsj', 'bz', 'nd', 'jscs','images'))
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