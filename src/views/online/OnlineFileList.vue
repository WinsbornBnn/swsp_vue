<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="文件名称">
              <a-input placeholder="请输入文件名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="文件地址">
              <a-input placeholder="请输入文件地址" v-model="queryParam.file"></a-input>
            </a-form-item>
          </a-col>
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
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('在线文件')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

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
              <a-menu-item @click="showFile(record)"><a>查看并下载</a></a-menu-item>
              <!-- <a-menu-item><a herf="#" @click="doenloadFile(record)">下载</a></a-menu-item> -->
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <onlineFile-modal :importExcelUrl="importExcelUrl" ref="modalForm" @ok="modalFormOk"></onlineFile-modal>
    <el-dialog title="预览" :visible.sync="showFileVisible" width="70%" :before-close="handleClose">
      <template v-if="fileType !== 'pdf'">
        <div>
          <a herf="#" @click="doenloadFile">下载</a>
        </div>
      </template>
      <div class="fileOverViewBox">
        <div class="fileOverViewContentBox">
          <div v-if="fileType === 'pdf'">
            <div style="height: 60px">
              <div class="arrow rowCenter">
                <span @click="changePdfPage(0)" class="turn" :class="{ grey: currentPage === 1 }">上一页</span>
                <div class="pageBox rowCenter">
                  <span> {{ currentPage }}</span>
                  <span>/</span>
                  <span>{{ pageCount }}</span>
                </div>
                <span @click="changePdfPage(1)" class="turn" :class="{ grey: currentPage === pageCount }">下一页</span>
                <div style="margin-top: 5px"><a herf="#" @click="doenloadFile">下载</a></div>
              </div>
            </div>
            <pdf
              :src="pdfsrc"
              :page="currentPage"
              @num-pages="pageCount = $event"
              @page-loaded="currentPage = $event"
              @loaded="loadPdfHandler"
            >
            </pdf>
          </div>
          <div v-if="/docx/.test(fileType)" v-html="viewHtml" class="docViewBox"></div>
        </div>
      </div>
      <!-- <iframe :src="showFileUrl" frameborder="0" width="100%" height="600"></iframe> -->
    </el-dialog>
  </a-card>
</template>

<script>
import pdf from 'vue-pdf'
import mammoth from 'mammoth'
import '@/assets/less/TableExpand.less'
import OnlineFileModal from './modules/OnlineFileModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: "OnlineFileList",
  mixins: [JeecgListMixin],
  components: {
    OnlineFileModal,
    pdf
  },
  data () {
    return {
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      pdfsrc: '',
      fileType: '',
      viewHtml: '',
      showFileVisible: false,
      showFileUrl: '',
      downloadFileUrl: '',
      description: '在线文件管理页面',
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
          title: '文件名称',
          align: "center",
          dataIndex: 'name'
        },
        {
          title: '文件地址',
          align: "center",
          dataIndex: 'file'
        }, {
          title: '上传人员',
          align: "center",
          dataIndex: 'createBy'
        }, {
          title: '上传时间',
          align: "center",
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          scopedSlots: { customRender: 'action' },
        }
      ],
      url: {
        list: "/onlie/onlineFile/list",
        delete: "/onlie/onlineFile/delete",
        deleteBatch: "/onlie/onlineFile/deleteBatch",
        exportXlsUrl: "onlie/onlineFile/exportXls",
        importExcelUrl: "onlie/onlineFile/importExcel",
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    showFile (record) {
      let fileName = record.file.split('/')[record.file.split('/').length - 1]
      this.fileType = fileName.split('.')[1]
      this.downloadFileUrl = `${window._CONFIG['staticDomainURL']}/${record.file}`
      if (/pdf/.test(this.fileType)) {
        // pdf 格式
        this.showFileVisible = true
        this.pdfsrc = pdf.createLoadingTask(this.downloadFileUrl)
      } else if (/docx/.test(this.fileType)) {
        this.showFileVisible = true
        const xhr = new XMLHttpRequest();
        xhr.open("get", this.downloadFileUrl, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
          if (xhr.status == 200) {
            mammoth.convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) }).then((resultObject) => {
              this.$nextTick(() => {
                this.viewHtml = resultObject.value;
              });
            });
          }
        };
        xhr.send();
      } else {
        this.$message.error('文件格式不支持，仅支持pdf,docx文件预览,请直接下载预览！');
        location.href = this.downloadFileUrl
      }
    },
    handleClose (done) {
      this.showFileVisible = false
    },
    doenloadFile () {
      location.href = this.downloadFileUrl
    },
    changePdfPage (val) {
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },
    // pdf加载时
    loadPdfHandler (e) {
      this.currentPage = 1 // 加载的时候先加载第一页
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>
.fileOverViewBox {
  // background: #000000;
  min-width: 100vh;
  .fileOverViewContentBox {
    width: 1000px;
    margin: 0 auto;
    background: #ffffff;
    .arrow {
      position: fixed;
      width: 100%;
      height: 60px;
      z-index: 100;
      .turn {
        cursor: pointer;
        &:hover {
          color: #58a5fe;
        }
      }
      .pageBox {
        margin: 0 20px;
      }
    }
    .docViewBox {
      padding: 20px;
    }
  }
}
</style>