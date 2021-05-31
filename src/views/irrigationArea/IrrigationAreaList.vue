<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="灌区名称">
              <a-input placeholder="请输入灌区名称" v-model="queryParam.gqmc"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="灌区所在地">
              <a-input placeholder="请输入灌区所在地" v-model="queryParam.gqszd"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="灌区地址">
                <a-input placeholder="请输入灌区地址" v-model="queryParam.gqdz"></a-input>
              </a-form-item>
            </a-col> -->
            <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="灌区管理单位">
                <a-input placeholder="请输入灌区管理单位" v-model="queryParam.gqgldw"></a-input>
              </a-form-item>
            </a-col> -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="灌区规模类型">
                <a-input placeholder="请输入灌区规模类型" v-model="queryParam.gqgmlx"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="主要作物">
                <a-input placeholder="请输入主要作物" v-model="queryParam.zyzw"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否节水型">
                <a-select
                  style="width: 200px"
                  placeholder="请选择"
                  v-model="queryParam.sfjsx"
                >
                  <a-select-option value="1"> 省级节水型 </a-select-option>
                  <a-select-option value="3"> 市级节水型 </a-select-option>
                  <a-select-option value="2"> 非节水型 </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否节水技改">
                <a-select
                  style="width: 200px"
                  placeholder="请选择"
                  v-model="queryParam.type"
                >
                  <a-select-option value="1"> 节水技改 </a-select-option>
                  <a-select-option value="2"> 未节水技改 </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="公布时间">
                <a-date-picker :value-format="'YYYY年MM月DD日'" v-model="queryParam.gbsj"/>
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
      <a-button type="primary" icon="download" @click="handleExportXls('省级-农业灌区')">导出</a-button>
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
        class="j-table-force-nowrap"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
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
    <irrigationArea-modal ref="modalForm" @ok="modalFormOk"></irrigationArea-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IrrigationAreaModal from './modules/IrrigationAreaModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: "IrrigationAreaList",
  mixins: [JeecgListMixin],
  components: {
    IrrigationAreaModal
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
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '灌区名称',
          align: "center",
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
          title: '单位面积用水量（m3/亩）',
          align: "center",
          dataIndex: 'dwmjysl'
        },
        {
          title: '灌溉水有效利用系数',
          align: "center",
          dataIndex: 'ggsyxlyxs'
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
          title: '节水技改灌区投入（万元）',
          align: 'center',
          dataIndex: 'gqtr'
        },
        {
          title: '节水技改投入（万元）',
          align: 'center',
          dataIndex: 'jsjgtr'
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