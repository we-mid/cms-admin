<template>
  <div>

    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品1007</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card ref="cardItemList">
      <div class="card-title" slot="header">
        <i class="el-icon-arrow-down"></i>
        <span>商品列表</span>
      </div>

      <div>
        <el-table
          :data="itemList"
          style="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品ID">
                  <span>{{ props.row.uid }}</span>
                </el-form-item>
                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="供应商">
                  <span>{{ props.row.provider }}</span>
                </el-form-item>
                <el-form-item label="商品分类">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
                <el-form-item label="商品描述">
                  <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="操作">
                  <el-button type="default" size="mini" icon="edit"
                      @click="editItem(props.row)"></el-button>
                  <el-button type="danger" size="mini" icon="delete"
                      @click="deleteItem(props.row)"></el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="商品ID"
            prop="uid">
          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="name">
          </el-table-column>
          <el-table-column
            label="描述"
            prop="description">
          </el-table-column>
        </el-table>

        <div class="table-footer">
          <el-button type="primary" size="small" icon="plus"
              @click="gotoItemCreate()">添加商品</el-button>
          <el-pagination
            class="pagination"
            @size-change="handlePageSize"
            @current-change="handlePageCurrent"
            :current-page="pageCurrent"
            :page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <el-card ref="cardItemCreate" class="box-card">
      <div class="card-title" slot="header">
        <i class="el-icon-plus"></i>
        <span>添加商品</span>
      </div>
      <item-form ref="formItemCreate" action="create"
          :schema="formSchema"
          @submit="itemCreateSubmit"></item-form>
    </el-card>

    <el-card v-show="itemInEdit" ref="cardItemEdit" class="box-card">
      <div class="card-title" slot="header">
        <i class="el-icon-edit"></i>
        <span>修改商品</span>
      </div>
      <item-form ref="formItemEdit" action="edit"
          :schema="formSchema"
          @cancel="itemEditCancel"
          @submit="itemEditSubmit"></item-form>
    </el-card>
  </div>
</template>

<script>
import { fetchApi } from '../api'
import ItemForm from './ItemForm'
import _ from 'lodash'

let itemTemplate = {
  name: '',
  provider: '',
  category: '',
  description: ''
}

export default {
  components: { ItemForm },

  data () {
    return {
      listLoading: false,
      listTotal: 0,
      itemList: [],
      newItem: _.clone(itemTemplate),
      pageCurrent: 1,
      pageSize: 10,

      itemInEdit: false,

      formSchema: {
        fields: [
          { input: 'text', key: 'name', label: '商品名称' },
          {
            input: 'radio-group',
            key: 'provider',
            label: '供应商',
            options: [
              { value: 'jyj', label: '吉野家' },
              { value: 'ksf', label: '可颂坊' },
              { value: 'mdw', label: '面点王' }
            ]
          },
          {
            input: 'radio-group',
            key: 'category',
            label: '商品分类',
            options: [
              { value: 'breakfast', label: '早餐' },
              { value: 'lunch', label: '午餐' },
              { value: 'supper', label: '晚餐' }
            ]
          },
          { input: 'textarea', key: 'description', label: '商品描述' }
        ]
      },

      currentPage: 1,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },

  created () {
    this.loadList()
  },

  methods: {
    loadList () {
      this.listLoading = true
      let { pageSize, pageCurrent } = this
      let url = [
        '/products/list?sort=-1&limit=',
        pageSize, '&page=', pageCurrent
      ].join('')
      fetchApi(url)
        .then(data => {
          let { total, docs } = data
          this.itemList = docs
          this.listTotal = total
          this.listLoading = false
        })
    },

    deleteItem ({ uid }) {
      this.$confirm('是否确认删除该条记录？', '删除记录', {
        confirmButtonText: '立即删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        return fetchApi('/products/delete', {
          method: 'POST',
          body: JSON.stringify({ uid })
        })
      })
      .then(data => {
        this.loadList()
      })
    },

    editItem (row) {
      this.$refs.formItemEdit.reset(row)
      this.itemInEdit = true
      this.$nextTick(() => { // wait to be shown
        this.gotoItemEdit()
      })
    },

    itemEditCancel () {
      this.$confirm('是否确认放弃修改该条记录？', '放弃修改', {
        confirmButtonText: '放弃修改',
        cancelButtonText: '继续修改',
        type: 'warning'
      })
      .then(() => {
        this.$refs.formItemEdit.reset()
        this.itemInEdit = false
      })
    },
    itemEditSubmit (model) {
      fetchApi('/products/update', {
        method: 'POST',
        body: JSON.stringify(model)
      })
      .then(() => {
        this.$refs.formItemEdit.reset()
        this.loadList()
        this.gotoItemList()
        this.itemInEdit = false
      })
    },
    itemCreateSubmit (model) {
      fetchApi('/products/create', {
        method: 'POST',
        body: JSON.stringify(model)
      })
      .then(() => {
        this.$refs.formItemCreate.reset()
        this.loadList()
        this.gotoItemList()
      })
    },

    gotoItemList () {
      this.$refs.cardItemList.$el.scrollIntoView()
    },
    gotoItemCreate () {
      this.$refs.cardItemCreate.$el.scrollIntoView()
    },
    gotoItemEdit () {
      this.$refs.cardItemEdit.$el.scrollIntoView()
    },

    handlePageSize (v) {
      this.pageSize = v
      this.loadList()
    },
    handlePageCurrent (v) {
      this.pageCurrent = v
      this.loadList()
    }
  }
}
</script>

<style lang="scss">
.breadcrumb {
  margin-bottom: 20px;
}

.demo-table-expand {
  /* display: inline-block extra margin [duplicate]
  http://stackoverflow.com/questions/1833734/display-inline-block-extra-margin */
  font-size: 0;
}
.demo-table-expand .el-form-item {
  margin-right: 0 !important;
  margin-bottom: 0;
  width: 50%;
}

.demo-table-expand .el-form-item__content {
  padding-right: 10px;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand {
  .el-button+.el-button {
    margin-left: 0 !important;
  }
}

.box-card {
  display: inline-block;
  margin-right: 20px;
  margin-top: 20px;
  width: 450px;
}
.card-title {
  i {
    margin-right: 0.3em;
  }
}
.card-collapse {
  .card-title {
    cursor: pointer;
    user-select: none;
  }
}

.card--collapsed {
  .el-card__body {
    height: 0;
    padding: 0;
  }
}

.table-footer {
  margin-top: 16px;
  display: flex;
  display-direction: row;
  align-items: center;
}
.pagination {
  display: inline-block;
}
</style>
