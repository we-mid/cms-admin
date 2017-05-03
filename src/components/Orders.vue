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
        <el-table
          :data="itemList"
          style="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item :label="rtype + 'UID'" style="width: 100%">
                  <span>{{ props.row.uid }}</span>
                </el-form-item>
                <el-form-item :label="rtype + '名称'">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="供应商">
                  <span>{{ getRefValue(props.row, 'provider', 'providers', 'name') }}</span>
                </el-form-item>
                <el-form-item label="时段分类">
                  <span>{{ getRefValue(props.row, 'category', 'categories', 'name') }}</span>
                </el-form-item>
                <el-form-item label="价格分类">
                  <span>{{ getRefValue(props.row, 'priceCategory', 'categories', 'name') }}</span>
                </el-form-item>
                <el-form-item :label="rtype + '描述'" style="width: 100%">
                  <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="创建日期">
                  <span>{{ new Date(props.row.createdAt).toLocaleString() }}</span>
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
              :label="rtype + 'UID'">
            <template scope="s">
              {{ s.row.uid.substr(0, 9) }}
            </template>
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
              {{ getRefValue(s.row, 'priceCategory', 'categories', 'name') }}
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
      @cancel="itemEditCancel"
      @submit="itemEditSubmit">
    </item-form>
  </div>
</template>

<script>
import { categories, providers } from '../const'
import { fetchApi } from '../api'
import ItemForm from './ItemForm'
import _ from 'lodash'

let refDocs = {
  categories,
  providers
}

let rtype = '订单'

export default {
  components: { ItemForm },

  data () {
    return {
      rtype,
      listLoading: false,
      listTotal: 0,
      itemList: [],
      pageCurrent: 1,
      pageSizes: [10, 20, 50],
      pageSize: 10,

      refMap: this.toRefMap(refDocs),
      itemInEdit: false,

      // todo: request /produts, /categories, /providers seperately
      formSchema: {
        fields: [
          { input: 'text', key: 'name', label: `${rtype}名称` },
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
            label: '时段',
            options: [
              { value: 'breakfast', label: '早餐' },
              { value: 'lunch', label: '午餐' },
              { value: 'supper', label: '晚餐' }
            ]
          },
          {
            input: 'radio-group',
            key: 'priceCategory',
            label: '价格',
            options: [
              { value: '20y', label: '20元套餐' },
              { value: '25y', label: '25元套餐' },
              { value: '30y', label: '30元套餐' }
            ]
          },
          { input: 'textarea', key: 'description', label: `${rtype}描述` }
        ]
      }
    }
  },

  created () {
    this.loadList()
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
        // this.loadList()
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
