<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="企业名称">
              <j-input placeholder="请输入企业名称" v-model="queryParam.qymc"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="公布单位级别">
              <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.gbdwjb">
                <a-select-option value="省级"> 省级 </a-select-option>
                <a-select-option value="市级"> 市级 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="行业分类">
              <j-input placeholder="请输入行业分类" v-model="queryParam.hyfl"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否高耗水">
                <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.sfghs_key">
                  <a-select-option value="1"> 高耗水</a-select-option>
                  <a-select-option value="2"> 非高耗水</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否重点监控">
                <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.zdys_key">
                  <a-select-option value="1"> 重点监控</a-select-option>
                  <a-select-option value="2"> 一般用水户</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="公布时间">
                <j-input  v-model="queryParam.gbsj" placeholder="请输入年份 例如 2021" ></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="企业所在区县">
                <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.addr">
                  <a-select-option value="高邮市"> 高邮市 </a-select-option>
                  <a-select-option value="仪征市"> 仪征市 </a-select-option>
                  <a-select-option value="邗江区"> 邗江区 </a-select-option>
                  <a-select-option value="广陵区"> 广陵区 </a-select-option>
                  <a-select-option value="江都区"> 江都区 </a-select-option>
                  <a-select-option value="宝应县"> 宝应县 </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'industry:add'" >新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('省级-工业企业')" v-has="'industry:out'" >导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
        v-has="'industry:imp'"
      >
        <a-button type="primary" icon="import" v-has="'industry:imp'">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0" v-has="'industry:delete'">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px;margin-right: 24px" @click="onClearSelected">清空</a>
        查询结果：查询到<a>{{ countNum }}</a>个
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: true }"
        class="j-table-force-nowrap"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="num" slot-scope="text, record, index">{{
          ipagination.current === 1
            ? parseInt(index) + 1
            : ipagination.pageSize * (ipagination.current - 1) + parseInt(index) + 1
        }}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-has="'industry:edit'">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown  v-has="'industry:delete'">
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <industrialEnterprise-modal ref="modalForm" @ok="modalFormOk"></industrialEnterprise-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IndustrialEnterpriseModal from './modules/IndustrialEnterpriseModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

export default {
  name: 'IndustrialEnterpriseList',
  mixins: [JeecgListMixin],
  components: {
    IndustrialEnterpriseModal,
    JInput
  },
  data () {
    return {
      description: '省级-工业企业管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 40,
          fixed: "left",
          align: 'center',
          scopedSlots: { customRender: 'num' },
          // customRender: function (t, r, index) {
          //   return parseInt(index) + 1
          // }
        },
        {
          title: '企业名称',
          align: 'center',
          fixed: "left",
          width: 240,
          dataIndex: 'qymc'
        },
        {
          title: '组织机构代码',
          align: 'center',
          dataIndex: 'zzjgdm'
        },
        {
          title: '企业所在地',
          align: 'center',
          dataIndex: 'qyszd'
        },
        {
          title: '企业地址',
          align: 'center',
          dataIndex: 'qydz'
        },
        {
          title: '行业分类',
          align: 'center',
          dataIndex: 'hyfl'
        },
        {
          title: '主要产品',
          align: 'center',
          dataIndex: 'zycp'
        },
        {
          title: '主要产品产量-值',
          align: 'center',
          dataIndex: 'zycpclz'
        },

        {
          title: '主要产品产量单位',
          align: 'center',
          dataIndex: 'zycpcldw'
        },
        {
          title: '实际新水用水量（万m³））',
          align: 'center',
          dataIndex: 'sjysl'
        },

        {
          title: '单位产品用水量-值',
          align: 'center',
          dataIndex: 'dwcpysz'
        },
        {
          title: '定额值',
          align: 'center',
          dataIndex: 'dez'
        },
        {
          title: '单位产品用水量-单位',
          align: 'center',
          dataIndex: 'dwcpysdw'
        },

        // {
        //   title: '节水技改-项目名称',
        //   align: 'center',
        //   dataIndex: 'xmmc'
        // },
        // {
        //   title: '节水技改-项目级别',
        //   align: 'center',
        //   dataIndex: 'xmjb'
        // },
        // {
        //   title: '节水技改-财政投入（万元）',
        //   align: 'center',
        //   dataIndex: 'cztr'
        // },
        // {
        //   title: '节水技改-企业投入（万元）',
        //   align: 'center',
        //   dataIndex: 'qytr'
        // },
        // {
        //   title: '节水技改投入（万元）',
        //   align: 'center',
        //   dataIndex: 'jsjgtr'
        // },
        {
          title: '重复用水量（万m³）',
          align: 'center',
          dataIndex: 'cfysl'
        },
        {
          title: '重复利用率（%）',
          align: 'center',
          dataIndex: 'cflyl'
        },

        // {
        //   title: '冷却水循环率（%）',
        //   align: 'center',
        //   dataIndex: 'lqsxhl'
        // },
        // {
        //   title: '冷凝水回用率（%）',
        //   align: 'center',
        //   dataIndex: 'lnshyl'
        // },
        // {
        //   title: '废水回用率（%）',
        //   align: 'center',
        //   dataIndex: 'fshyl'
        // },
        {
          title: '节水量（万m³）',
          align: 'center',
          dataIndex: 'jsx'
        },
        {
          title: '非常规水源',
          align: 'center',
          dataIndex: 'fcgsy'
        },
        {
          title: '非常规水源利用量（万m³）',
          align: 'center',
          dataIndex: 'fcgsylyl'
        },
        {
          title: '非常规水源替代率（%）',
          align: 'center',
          dataIndex: 'fcgsytdl'
        },
        {
          title: '按是否高耗水行业分类',
          align: 'center',
          dataIndex: 'sfghs'
        },
        {
          title: '按是否重点用水用水监控企业分类',
          align: 'center',
          dataIndex: 'zdys'
        },
        {
          title: '按是否规模以上',
          align: 'center',
          dataIndex: 'sfgm'
        },

        {
          title: '公布节水型工业企业文件',
          align: 'center',
          dataIndex: 'qywj'
        },
        {
          title: '公布单位名称',
          align: 'center',
          dataIndex: 'gbdw'
        },
        {
          title: '联合公布单位名称',
          align: 'center',
          dataIndex: 'lhgbdw'
        },
        {
          title: '公布单位级别',
          align: 'center',
          dataIndex: 'gbdwjb'
        },
        {
          title: '公布时间',
          align: 'center',
          dataIndex: 'gbsj'
        },
        {
          title: '复核时间',
          align: 'center',
          dataIndex: 'fhsj'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'bz'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: "right",
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/industrialEnterprise/industrialEnterprise/list',
        delete: '/industrialEnterprise/industrialEnterprise/delete',
        deleteBatch: '/industrialEnterprise/industrialEnterprise/deleteBatch',
        exportXlsUrl: 'industrialEnterprise/industrialEnterprise/exportXls',
        importExcelUrl: 'industrialEnterprise/industrialEnterprise/importExcel',
        jgListUrl: 'industrialEnterprise/industrialEnterprise/staticData2'
      }
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>