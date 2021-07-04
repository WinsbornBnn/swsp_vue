<template>
  <a-card :bordered="false">
		<a-form :form="form">
		  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="首页介绍">
		    <a-textarea
		          v-model="description_info"
		          placeholder="请输入首页介绍"
		          :auto-size="{ minRows: 5, maxRows: 20 }"
		        />
		  </a-form-item>
      
		</a-form>
    
    <div style="text-align: center;">
        <a-button type="primary" v-on:click="submit_form()" >
          提交
        </a-button>
    </div>
    
  </a-card>
</template>

<script>
  import '@/assets/less/TableExpand.less'
  import { httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  

  export default {
    name: "SysPictureList",
    mixins:[JeecgListMixin],
    components: {
      httpAction
    },
    data () {
      return {
        description: '编辑介绍',
        description_info:'',
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        url: {
              list: "/sys/dict/getDictItems/js_info",
              save: "/sys/dict/editByCode"
           },
        }
  },
  mounted: function () {
    this.init_data()
  },
	methods: {
	  init_data(){
      var that = this;
      httpAction(this.url.list, {}, "GET").then((res) => {
        if (res.success) {
          that.description_info = res.result[0].value;
        } else {
          
        }
      })
    },
    submit_form(){
      var that = this;
      httpAction(this.url.save, {description:this.description_info,dictCode:'js_info'}, "PUT").then((res) => {
        if (res.success) {
          that.$message.success(res.message);
        } else {
          that.$message.warning(res.message);
        }
      })
    }
	}
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>