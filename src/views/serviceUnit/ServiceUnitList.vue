<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位名称">
              <j-input placeholder="请输入单位名称" v-model="queryParam.dwmc"></j-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="组织机构代码">
              <j-input placeholder="请输入组织机构代码" v-model="queryParam.zzjg"></j-input>
            </a-form-item>
          </a-col> -->
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="公布单位级别">
              <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.gbdwjb">
                <a-select-option value="省级"> 省级 </a-select-option>
                <a-select-option value="市级"> 市级 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位类型">
              <!-- <j-input placeholder="请输入单位类型" v-model="queryParam.dwlx"></j-input> -->
              <a-select
                style="width: 200px"
                placeholder="请选择单位类型"
                v-model="queryParam.unit"
              >
                <a-select-option value="医院"> 医院 </a-select-option>
                <a-select-option value="学校"> 学校 </a-select-option>
                <a-select-option value="机关"> 机关（单位） </a-select-option>
                <a-select-option value="宾馆"> 宾馆 </a-select-option>
                <a-select-option value="教育基地"> 节水教育基地 </a-select-option>
                <a-select-option value="其他"> 其他 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="单位所在地">
                <j-input placeholder="请输入单位所在地" v-model="queryParam.dwszd"></j-input>
              </a-form-item>
            </a-col>
            <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="单位地址">
                <j-input placeholder="请输入单位地址" v-model="queryParam.dwdz"></j-input>
              </a-form-item>
            </a-col> -->
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否节水型">
                <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.sfjsx_key">
                  <a-select-option value="1"> 省级节水型 </a-select-option>
                  <a-select-option value="3"> 市级节水型 </a-select-option>
                  <a-select-option value="2"> 非节水型 </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否节水技改">
                <a-select style="width: 200px" placeholder="请选择" v-model="queryParam.type">
                  <a-select-option value="1"> 节水技改 </a-select-option>
                  <a-select-option value="2"> 未节水技改 </a-select-option>
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
      <a-button type="primary" icon="download" @click="handleExportXls('省级-生活服务业单位')">导出</a-button>
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
    <serviceUnit-modal ref="modalForm" @ok="modalFormOk"></serviceUnit-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import ServiceUnitModal from './modules/ServiceUnitModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

export default {
  name: "ServiceUnitList",
  mixins: [JeecgListMixin],
  components: {
    ServiceUnitModal,
    JInput
  },
  data () {
    return {
      description: '省级-生活服务业单位管理页面',
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
          title: '单位名称',
          align: "center",
          fixed: "left",
          width: 240,
          dataIndex: 'dwmc'
        },
        {
          title: '组织机构代码',
          align: "center",
          dataIndex: 'zzjg'
        },
        {
          title: '单位所在地',
          align: "center",
          dataIndex: 'dwszd'
        },
        {
          title: '单位地址',
          align: "center",
          dataIndex: 'dwdz'
        },
        {
          title: '单位类型',
          align: "center",
          dataIndex: 'dwlx'
        },
        {
          title: '用水人数/面积数值',
          align: "center",
          dataIndex: 'ysrsz'
        },
        {
          title: '用水人数/面积数单位',
          align: "center",
          dataIndex: 'ysrsdw'
        },
        {
          title: '年实际用水量（万m³）',
          align: "center",
          dataIndex: 'sjysl'
        },
        {
          title: '人均或单位面积用水量值',
          align: "center",
          dataIndex: 'yslz'
        },
        {
          title: '定额值',
          align: "center",
          dataIndex: 'dez'
        },
        {
          title: '人均或单位面积用水量单位',
          align: "center",
          dataIndex: 'ysldw'
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
          title: '重复用水量（万m³）',
          align: "center",
          dataIndex: 'cfysl'
        },
        {
          title: '重复利用率（%）',
          align: "center",
          dataIndex: 'cflyl'
        },
        {
          title: '直接冷却循环率（%）',
          align: 'center',
          dataIndex: 'zjlqxhl'
        },
        {
          title: '冷凝水回用率（%）',
          align: 'center',
          dataIndex: 'llshyl'
        },
        {
          title: '废水回用率（%）',
          align: 'center',
          dataIndex: 'fshyl'
        },
        {
          title: '非常规水利用-水源',
          align: 'center',
          dataIndex: 'fcgssy'
        },
        {
          title: '非常规水源利用量（万m3）',
          align: 'center',
          dataIndex: 'fcgslyl'
        },
        {
          title: '非常规水源替代率（%）',
          align: 'center',
          dataIndex: 'fcgsytdl'
        },
        {
          title: '公布节水型生活服务业单位文件',
          align: "center",
          dataIndex: 'dwwj'
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
        list: "/serviceUnit/serviceUnit/list",
        delete: "/serviceUnit/serviceUnit/delete",
        deleteBatch: "/serviceUnit/serviceUnit/deleteBatch",
        exportXlsUrl: "serviceUnit/serviceUnit/exportXls",
        importExcelUrl: "serviceUnit/serviceUnit/importExcel",
        jgListUrl: 'serviceUnit/serviceUnit/staticData2'

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