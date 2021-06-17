<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="小区名称">
              <j-input placeholder="请输入小区名称" v-model="queryParam.xqmc"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="小区所在地">
              <j-input placeholder="请输入小区所在地" v-model="queryParam.xqszd"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否节水型">
                <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.sfjsx_key">
                  <a-select-option value="1"> 省级节水型 </a-select-option>
                  <a-select-option value="3"> 市级节水型 </a-select-option>
                  <a-select-option value="2"> 非节水型 </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          <template v-if="toggleSearchStatus">
            <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="小区地址">
                <j-input placeholder="请输入小区地址" v-model="queryParam.xqdz"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="物业管理单位">
                <j-input placeholder="请输入物业管理单位" v-model="queryParam.wygldw"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="年住户人口数量（人）">
                <j-input placeholder="请输入年住户人口数量（人）" v-model="queryParam.zhrs"></j-input>
              </a-form-item>
            </a-col> -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否节水技改">
                <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.type">
                  <a-select-option value="1"> 节水技改</a-select-option>
                  <a-select-option value="2"> 未节水技改</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="公布时间">
                <a-date-picker :value-format="'YYYY年MM月DD日'" v-model="queryParam.gbsj" />
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('省级-居民小区')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
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
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
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
    <residentialQuarters-modal ref="modalForm" @ok="modalFormOk"></residentialQuarters-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import ResidentialQuartersModal from './modules/ResidentialQuartersModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

export default {
  name: 'ResidentialQuartersList',
  mixins: [JeecgListMixin],
  components: {
    ResidentialQuartersModal,
    JInput
  },
  data () {
    return {
      description: '省级-居民小区管理页面',
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
          // customRender: function(t, r, index) {
          //   return parseInt(index) + 1
          // }
        },
        {
          title: '小区名称',
          align: 'center',
          fixed: "left",
          width: 240,
          dataIndex: 'xqmc'
        },
        {
          title: '小区所在地',
          align: 'center',
          dataIndex: 'xqszd'
        },
        {
          title: '小区地址',
          align: 'center',
          dataIndex: 'xqdz'
        },
        {
          title: '物业管理单位',
          align: 'center',
          dataIndex: 'wygldw'
        },
        {
          title: '年住户人口数量（人）',
          align: 'center',
          dataIndex: 'zhrs'
        },
        {
          title: '年住户用水总量（万m³）',
          align: 'center',
          dataIndex: 'zhysl'
        },
        {
          title: '人均月用水量（m3/（人·月））',
          align: 'center',
          dataIndex: 'rjyys'
        },
        {
          title: '人均日用水量（L/人·d）',
          align: 'center',
          dataIndex: 'rjys'
        },
        {
          title: '省定额值（L/（人·d））',
          align: 'center',
          dataIndex: 'dez'
        },
        {
          title: '节水技改-项目名称',
          align: 'center',
          dataIndex: 'xmmc'
        },
        {
          title: '节水技改-项目级别',
          align: 'center',
          dataIndex: 'xmjb'
        },
        {
          title: '节水技改-财政投入（万元）',
          align: 'center',
          dataIndex: 'cztr'
        },
        {
          title: '节水技改-单位投入（万元）',
          align: 'center',
          dataIndex: 'dwtr'
        },
        {
          title: '节水技改投入（万元）',
          align: 'center',
          dataIndex: 'jsjgtr'
        },
        {
          title: '公布节水型居民小区文件',
          align: 'center',
          dataIndex: 'jsxjm'
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
        list: '/residentialQuarters/residentialQuarters/list',
        delete: '/residentialQuarters/residentialQuarters/delete',
        deleteBatch: '/residentialQuarters/residentialQuarters/deleteBatch',
        exportXlsUrl: 'residentialQuarters/residentialQuarters/exportXls',
        importExcelUrl: 'residentialQuarters/residentialQuarters/importExcel',
        jgListUrl: 'residentialQuarters/residentialQuarters/staticData2'
      }
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {}
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>