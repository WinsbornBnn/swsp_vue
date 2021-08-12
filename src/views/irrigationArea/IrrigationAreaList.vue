<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="灌区名称">
              <j-input placeholder="请输入灌区名称" v-model="queryParam.gqmc"></j-input>
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
            <a-form-item label="灌区规模类型">
              <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.gqgmlx">
                <a-select-option value="大型"> 大型 </a-select-option>
                <a-select-option value="中型"> 中型 </a-select-option>
                <a-select-option value="小型"> 小型 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="灌区所在地">
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

            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="公布时间">
                <j-input  v-model="queryParam.gbsj" placeholder="请输入年份 例如 2021" ></j-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'irrigation:add'">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('省级-农业灌区')" v-has="'irrigation:out'">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
         v-has="'irrigation:imp'"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0" v-has="'irrigation:delete'">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
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
          <a @click="handleEdit(record)" v-has="'irrigation:edit'">编辑</a>

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
    <irrigationArea-modal ref="modalForm" @ok="modalFormOk"></irrigationArea-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IrrigationAreaModal from './modules/IrrigationAreaModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

export default {
  name: "IrrigationAreaList",
  mixins: [JeecgListMixin],
  components: {
    IrrigationAreaModal,
    JInput
  },
  data () {
    return {
      description: '省级-农业灌区管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 40,
          fixed: "left",
          align: "center",
          scopedSlots: { customRender: 'num' },
          // customRender: function (t, r, index) {
          //   return parseInt(index) + 1;
          // }
        },
        {
          title: '灌区名称',
          align: "center",
          fixed: "left",
          width: 240,
          dataIndex: 'gqmc'
        },
        {
          title: '灌区所在地',
          align: "center",
          dataIndex: 'gqszd'
        },
        {
          title: '灌区地址',
          align: "center",
          dataIndex: 'gqdz'
        },
        {
          title: '灌区管理单位',
          align: "center",
          dataIndex: 'gqgldw'
        },
        {
          title: '灌区规模类型',
          align: "center",
          dataIndex: 'gqgmlx'
        },
        {
          title: '设计灌溉面积（万亩）',
          align: "center",
          dataIndex: 'ssgg'
        },
        {
          title: '实际灌溉面积（万亩）',
          align: "center",
          dataIndex: 'sjgg'
        },
        {
          title: '主要作物',
          align: "center",
          dataIndex: 'zyzw'
        },
        {
          title: '年实际用水量（万m³）',
          align: "center",
          dataIndex: 'sjysl'
        },

        {
          title: '单位面积用水量（m³/亩）',
          align: "center",
          dataIndex: 'dwmjysl'
        },
        {
          title: '灌溉水有效利用系数',
          align: "center",
          dataIndex: 'ggsyxlyxs'
        },
        {
          title: '公布节水型农业灌区文件',
          align: "center",
          dataIndex: 'gbjsxwj'
        },
        {
          title: '公布单位名称',
          align: "center",
          dataIndex: 'gbdw'
        },
        {
          title: '联合公布单位名称',
          align: "center",
          dataIndex: 'lhgbdw'
        },
        {
          title: '公布单位级别',
          align: "center",
          dataIndex: 'gbdwjb'
        },
        {
          title: '公布时间',
          align: "center",
          dataIndex: 'gbsj'
        },
        {
          title: '复核时间',
          align: "center",
          dataIndex: 'fhsj'
        },
        {
          title: '备注',
          align: "center",
          dataIndex: 'bz'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: "right",
          width: 100,
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: "/irrigationArea/irrigationArea/list",
        delete: "/irrigationArea/irrigationArea/delete",
        deleteBatch: "/irrigationArea/irrigationArea/deleteBatch",
        exportXlsUrl: "irrigationArea/irrigationArea/exportXls",
        importExcelUrl: "irrigationArea/irrigationArea/importExcel",
        jgListUrl: 'irrigationArea/irrigationArea/staticData2'
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {

  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>