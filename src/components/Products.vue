<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>{{ rtype }}管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card ref="cardItemList">
      <div class="card-title" slot="header">
        <i class="el-icon-arrow-down"></i>
        <span>{{ rtype }}列表</span>
      </div>

      <div>
        <!--<el-input class="search-input"
          placeholder="关键词搜索"
          icon="search"
          v-model="searchInput">
        </el-input>-->

        <el-table :data="itemList">
          <el-table-column type="expand">
            <template scope="s">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item :label="rtype + 'UID'">
                  <span>{{ s.row.uid }}</span>
                </el-form-item>
                <el-form-item :label="rtype + '名称'">
                  <span>{{ s.row.name }}</span>
                </el-form-item>
                <el-form-item label="供应商">
                  <span>{{ getRefValue(s.row, 'provider', 'providers', 'name') }}</span>
                </el-form-item>
                <el-form-item label="时段">
                  <span>{{ getRefValue(s.row, 'category', 'categories', 'name') }}</span>
                </el-form-item>
                <el-form-item label="价格">
                  <span>{{ s.row.price }} 元</span>
                </el-form-item>
                <el-form-item :label="rtype + '描述'">
                  <span>{{ s.row.description }}</span>
                </el-form-item>
                <el-form-item label="创建日期">
                  <span>{{ new Date(s.row.createdAt).toLocaleString() }}</span>
                </el-form-item>
                <el-form-item label="操作">
                  <el-button type="default" size="mini" icon="edit"
                      @click="editItem(s.row)"></el-button>
                  <el-button type="danger" size="mini" icon="delete"
                      @click="deleteItem(s.row)"></el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :label="rtype + 'UID'"
            prop="uid">
          </el-table-column>
          <el-table-column
            :label="rtype + '名称'"
            prop="name">
          </el-table-column>
          <el-table-column
              label="时段">
            <template scope="s">
              {{ getRefValue(s.row, 'category', 'categories', 'name') }}
            </template>
          </el-table-column>
          <el-table-column
              label="价格">
            <template scope="s">
              {{ s.row.price }} 元
            </template>
          </el-table-column>
        </el-table>

        <div class="table-footer">
          <el-button type="primary" size="small" icon="plus"
              @click="gotoItemCreate()">添加{{ rtype }}</el-button>
          <el-pagination
            class="pagination"
            @size-change="handlePageSize"
            @current-change="handlePageCurrent"
            :current-page="pageCurrent"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <item-form v-show="itemInEdit"
      ref="cardItemEdit"
      action="edit" :name="rtype"
      :schema="formSchema"
      @cancel="itemEditCancel"
      @submit="itemEditSubmit">
    </item-form>

    <item-form
      ref="cardItemCreate"
      action="create" :name="rtype"
      :schema="formSchema"
      @submit="itemCreateSubmit">
    </item-form>
  </div>
</template>

<script>
import { categories, providers } from '../const'
import { fetchApi } from '../api'
import ItemForm from './ItemForm'
import _ from 'lodash'

let rtype = '商品'

export default {
  components: { ItemForm },

  data () {
    return {
      rtype,
      searchInput: '',
      listLoading: false,
      listTotal: 0,
      itemList: [],
      pageCurrent: 1,
      pageSizes: [10, 20, 50],
      pageSize: 10,

      searchList: _.debounce(this._searchList, 500),
      refMap: this.toRefMap({
        categories,
        providers
      }),
      itemInEdit: false,

      // todo: request /produts, /categories, /providers seperately
      formSchema: {
        fields: [
          { input: 'text', key: 'name', label: `${rtype}名称` },
          {
            input: 'radio-group',
            key: 'provider',
            label: '供应商',
            options: providers.map(({ uid, name }) => {
              return { value: uid, label: name }
            })
          },
          {
            input: 'radio-group',
            key: 'category',
            label: '时段',
            options: categories.map(({ uid, name }) => {
              return { value: uid, label: name }
            })
          },
          {
            input: 'number',
            key: 'price',
            label: '价格'
          },
          { input: 'image-upload', key: 'image', label: '图片' },
          { input: 'textarea', key: 'description', label: `${rtype}描述` }
        ]
      }
    }
  },

  created () {
    this.loadList()
  },

  watch: {
    searchInput: 'searchList'
  },

  methods: {
    getRefValue (srcObj, fromKey, tarRes, toKey) {
      let uid = srcObj[fromKey]
      let refObj = this.refMap[tarRes][uid]
      return refObj ? refObj[toKey] : null
    },
    toRefMap (refs) {
      return _.reduce(refs, (acc, docs, k) => {
        acc[k] = docs.reduce((ac, doc) => {
          ac[doc.uid] = doc
          return ac
        }, {})
        return acc
      }, {})
    },

    _searchList () {
      this.loadList()
    },
    loadList () {
      this.listLoading = true
      let { pageSize, pageCurrent, searchInput } = this
      let url = [
        '/products/list?sort=-1&limit=',
        pageSize, '&page=', pageCurrent,
        '&search=', searchInput
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
      if (this.itemInEdit) { // has item being edited
        this.$alert('有一条记录正在修改中，请先关闭当前修改。', '正在修改记录')
        return
      }
      this.$refs.cardItemEdit.reset(row)
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
        this.$refs.cardItemEdit.reset()
        this.itemInEdit = false
      })
    },
    itemEditSubmit (model) {
      fetchApi('/products/update', {
        method: 'POST',
        body: JSON.stringify(model)
      })
      .then(() => {
        // this.$refs.cardItemEdit.reset()
        this.loadList()
        // this.gotoItemList()
        // this.itemInEdit = false
        this.$notify({
          type: 'success',
          title: '修改成功',
          message: `${rtype}信息已成功修改`
        })
      })
    },
    itemCreateSubmit (model) {
      fetchApi('/products/create', {
        method: 'POST',
        body: JSON.stringify(model)
      })
      .then(() => {
        this.$refs.cardItemCreate.reset()
        this.loadList()
        this.gotoItemList()
        this.$notify({
          type: 'success',
          title: '添加成功',
          message: `${rtype}信息已成功添加`
        })
      })
    },

    gotoItemList () {
      this.$refs.cardItemList.$el.scrollIntoView()
    },
    gotoItemCreate () {
      this.$refs.cardItemCreate.$el.scrollIntoView()
      this.$refs.cardItemCreate.$el.querySelector('input').focus()
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

<style lang="scss" src="./ItemManage.scss"></style>
