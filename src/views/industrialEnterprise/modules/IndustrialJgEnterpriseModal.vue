<template>
  <j-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="企业名称">
          <a-input placeholder="请输入企业名称" v-decorator="['qymc', { rules: [{ required: true, message: '请输入企业名称 ' }]}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="组织机构代码">
          <a-input placeholder="请输入组织机构代码" v-decorator="['zzjgdm', { }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所在地">
          <a-input placeholder="请输入所在地" v-decorator="['qyszd', { }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地址">
          <a-input-search placeholder="请输入地址" size="large" v-decorator="['qydz', { }]" @search="onSearch">
            <a-button slot="enterButton"> 打开地图 </a-button>
          </a-input-search>
          <j-map-input-desc
            ref="mapInputDesc"
            :inputValue="model.qydz"
            @mapLocationSave="mapLocationSave"
          ></j-map-input-desc>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="行业分类">
          <a-input placeholder="请输入行业分类" v-decorator="['hyfl', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主要产品">
          <a-input placeholder="请输入主要产品" v-decorator="['zycp', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主要产品产量">
          
          <a-row>
            <a-col :span="6" :push="18">
              <a-input placeholder="产量单位"  v-decorator="['zycpcldw', {}]" />
            </a-col>
            <a-col :span="18" :pull="6">
              <a-input placeholder="产量" @change="changeVal" v-decorator="['zycpclz', {}]" />
            </a-col>
          </a-row>

        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"  label="实际新水用水量（万m³）">
          <a-input-number @change="changeVal"  v-decorator="['sjysl', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位产品用水量">
          
          <a-row>
            <a-col :span="6" :push="18">
              <a-input placeholder="用水量单位" v-decorator="['dwcpysdw', {}]" />
            </a-col>
            <a-col :span="18" :pull="6">
              <a-input placeholder="用水量" v-decorator="['dwcpysz', {}]" />
            </a-col>
          </a-row>
          
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="节水技改-项目名称">
          <a-input placeholder="请输入节水技改-项目名称" v-decorator="['xmmc', {}]" />
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="节水技改-项目级别">
          <a-input placeholder="请输入节水技改-项目级别" v-decorator="['xmjb', {}]" />
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="节水技改-财政投入（万元）">
          <a-input placeholder="请输入节水技改-财政投入（万元）" v-decorator="['cztr', {}]" />
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="节水技改-企业投入（万元）">
          <a-input placeholder="请输入节水技改-企业投入（万元）" v-decorator="['qytr', {}]" />
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="节水技改投入（万元）">
          <a-input placeholder="请输入节水技改投入（万元）" v-decorator="['jsjgtr', {}]" />
        </a-form-item>
        
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="重复用水量（万m³）">
          <a-input placeholder="请输入重复用水量（万m³）" v-decorator="['cfysl', {}]" />
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="重复利用率（%）">
          <a-input placeholder="请输入重复利用率（%）" v-decorator="['cflyl', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="节水量（万m³）">
          <a-input placeholder="请输入节水量（万m³）" v-decorator="['jsx', {}]" />
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="非常规水源">
          <a-input placeholder="请输入非常规水源）" v-decorator="['fcgsy', {}]" />
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="非常规水源利用量（万m³）">
          <a-input placeholder="请输入非常规水源利用量（万m³）" v-decorator="['fcgsylyl', {}]" />
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="非常规水源替代率(%)">
          <a-input placeholder="请输入非常规水源替代率" v-decorator="['fcgsytdl', {}]" />
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
import JMoreImageUpload from '../../../components/jeecg/JMoreImageUpload'
import JMapInputDesc from '../../../components/jeecg/JMapInputDesc.vue'
import JImageUpload from '../../../components/jeecg/JImageUpload'

export default {
  name: "IndustrialEnterpriseModal",
  components: {
    JMoreImageUpload,
    JMapInputDesc,
    JImageUpload
  },
  data () {
    return {
      title: "操作",
      mapVisible: false,
      visible: false,
      fileList: [],
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
        add: "/industrialEnterprise/industrialEnterprise/add",
        edit: "/industrialEnterprise/industrialEnterprise/edit",
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
      this.model.qydz = data.address
      this.model.ycoor = data.latitude
      this.model.xcoor = data.longitude
      this.form.setFieldsValue(pick(this.model, 'qydz'))
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
      console.log(record);
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'xmmc','cztr','qytr','xmjb','jsjgtr','xmjb','qymc','zzjgdm','qyszd','qydz','hyfl','zycp','zycpclz','zycpcldw','sjysl','dwcpysz','dez','dwcpysdw','cfysl','cflyl','jsx','fcgsy','fcgsylyl','fcgsytdl','sfghs','zdys','sfgm','qywj','gbdw','lhgbdw','gbdwjb','gbsj','fhsj','bz'))
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
    changeVal(){
      alert(1);
      var zycpclz = this.form.getFieldValue('zycpclz');
      var sjysl = this.form.getFieldValue('sjysl');
      var val = Math.floor(sjysl*10000/zycpclz * 100) / 100;
      this.form.setFieldsValue({'dwcpysz':val});
    }

  }
}
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
</style>