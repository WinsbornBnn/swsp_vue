<template>
  <j-modal
    :title="title"
    :width="980"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="小区名称">
          <a-input
            placeholder="请输入小区名称"
            v-decorator="['xqmc', { rules: [{ required: true, message: '请输入小区名称 ' }] }]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="小区所在地">
          <a-input placeholder="请输入小区所在地" v-decorator="['xqszd', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="小区地址">
          <!-- <a-input placeholder="请输入小区地址" v-decorator="['xqdz', {}]" /> -->
          <a-input-search placeholder="请输入小区地址" size="large" v-decorator="['xqdz', {}]" @search="onSearch">
            <a-button slot="enterButton"> 打开地图 </a-button>
          </a-input-search>
          <j-map-input-desc
            ref="mapInputDesc"
            :inputValue="model.xqdz"
            @mapLocationSave="mapLocationSave"
          ></j-map-input-desc>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物业管理单位">
          <a-input placeholder="请输入物业管理单位" v-decorator="['wygldw', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="年住户人口数量（人）">
          <a-input-number @change="onPeopleNum" v-decorator="['zhrs', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="年住户用水总量（万m³）">
          <a-input-number @change="onWaterNum" v-decorator="['zhysl', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="人均月用水量（m³/（人·月））">
          <a-input-number v-decorator="['rjyys', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="人均日用水量（L/人·d）">
          <a-input-number v-decorator="['rjys', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公布节水型居民小区文件">
          <a-input placeholder="请输入公布节水型居民小区文件" v-decorator="['jsxjm', {}]" />
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
        <a-form-item label="大门" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload class="avatar-uploader" text="上传" v-model="avatarList" ></j-image-upload>
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
import JImageUpload from '../../../components/jeecg/JImageUpload'

export default {
  name: "ResidentialQuartersModal",
  components: {
    JImageUpload,
    JMapInputDesc,
    JMoreImageUpload
  },
  data () {
    return {
      title: "操作",
      waterNum: 0,
      peopleNum: 0,
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
      avatarList:[],
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
      },
      url: {
        add: "/residentialQuarters/residentialQuarters/add",
        edit: "/residentialQuarters/residentialQuarters/edit",
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
      this.model.xqdz = data.address
      this.model.ycoor = data.latitude
      this.model.xcoor = data.longitude
      this.form.setFieldsValue(pick(this.model, 'xqdz'))
    },
    change (data) {
      this.model.images = data
    },
    add () {
      this.edit({});
    },
    edit (record) {
      setTimeout(() => {
        this.fileList = record.images;
      }, 5)
      setTimeout(() => {
        this.avatarList = record.dm;
      }, 5)
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'xqmc', 'xqszd', 'xqdz', 'wygldw', 'zhrs', 'zhysl', 'rjys', 'rjyys', 'jsxjm', 'gbdw', 'lhgbdw', 'gbdwjb', 'gbsj', 'fhsj', 'bz', 'nd', 'jscs'))
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
          if(that.avatarList != ''){
              formData.dm = that.avatarList;
          }else{
              formData.dm = null;
          }
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
    // 人均月用水量 = (年住户总量 / 年住户人口数 / 12 ) * 10000
    // 人均日用水量 = (年住户总量 / 年住户人口数 / 365 ) * 1000,0000
    onWaterNum (value) {
      this.waterNum = value
      this.model.rjys = this.dayNum
      this.model.rjyys = this.moonNum
      this.form.setFieldsValue(pick(this.model, 'rjys','rjyys'))
    },
    onPeopleNum (value) {
      this.peopleNum = value
      this.model.rjys = this.dayNum
      this.model.rjyys = this.moonNum
      this.form.setFieldsValue(pick(this.model, 'rjys','rjyys'))
    }
  },
  computed: {
    moonNum () {
      return ((this.waterNum / this.peopleNum / 12) * 10000).toFixed(2)
    },
    dayNum () {
      return ((this.waterNum / this.peopleNum / 365) * 10000000).toFixed(2)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-form-item-label{
  width: 27%;
}
</style>