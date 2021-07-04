<template>
  <j-modal
    :title="title"
    :width="980"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
      
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="节水型工业企业用水量（万m³）">
          <a-input placeholder="请输入节水型工业企业用水量（万m³）" v-decorator="['jsqyysl', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="市区工业企业用水量（万m³）">
          <a-input placeholder="请输入市区工业企业用水量（万m³）" v-decorator="['qyysl', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="节水型单位用水量（万m³）">
          <a-input placeholder="请输入节水型单位用水量（万m³）" v-decorator="['jsdw', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="市区单位用水量（万m³）">
          <a-input placeholder="请输入市区单位用水量（万m³）" v-decorator="['dw', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="节水型学校">
          <a-input placeholder="请输入节水型学校" v-decorator="['jsxx', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="学校总数">
          <a-input placeholder="请输入学校总数" v-decorator="['xx', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="节水型小区户数">
          <a-input placeholder="请输入节水型小区户数" v-decorator="['jsxq', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="市区小区总户数">
          <a-input placeholder="请输入市区小区总户数" v-decorator="['xq', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="区县">
            <a-select style="width: 200px" placeholder="请选择" v-decorator="['qx', {}]">
              <a-select-option value="市区"> 市区 </a-select-option>
              <a-select-option value="高邮市"> 高邮市 </a-select-option>
              <a-select-option value="仪征市"> 仪征市 </a-select-option>
              <a-select-option value="邗江区"> 邗江区 </a-select-option>
              <a-select-option value="广陵区"> 广陵区 </a-select-option>
              <a-select-option value="江都区"> 江都区 </a-select-option>
              <a-select-option value="宝应县"> 宝应县 </a-select-option>
            </a-select>
          
        </a-form-item>
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="年度">
          <a-input placeholder="请输入年度" type="number" v-decorator="['nd', {}]" />
        </a-form-item> -->
		
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "StatisticsDataModal",
    data () {
      return {
        title:"操作",
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
        validatorRules:{
        },
        url: {
          add: "/data/statisticsData/add",
          edit: "/data/statisticsData/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'jsqyysl','qyysl','jsdw','dw','jsxx','xx','jsxq','xq','qx','nd'))
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
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            
            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
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