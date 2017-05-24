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
        <el-table :data="itemList">
          <el-table-column type="expand">
            <template scope="s">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item :label="rtype + 'UID'">
                  <span>{{ s.row.uid }}</span>
                </el-form-item>
                <el-form-item label="用户AD">
                  <span>{{ getRefValue(s.row, 'user', 'users', 'ad') }}</span>
                </el-form-item>
                <el-form-item label="商品 * 数量">
                  <span>
                    {{ getRefValue(s.row, 'product', 'products', 'name') }}
                    *
                    {{ s.row.amount }}
                  </span>
                </el-form-item>
                <el-form-item label="订单总额">
                  <span>{{ s.row.sum }} 元</span>
                </el-form-item>
                <el-form-item label="配送地址">
                  <span>{{ s.row.address }}</span>
                </el-form-item>
                <el-form-item label="创建日期">
                  <span>{{ new Date(s.row.createdAt).toLocaleString() }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :label="rtype + 'UID'"
            prop="uid">
          </el-table-column>
          <el-table-column
            label="用户AD">
            <template scope="s">
              {{ getRefValue(s.row, 'user', 'users', 'ad') }}
            </template>
          </el-table-column>
          <el-table-column
            label="商品 * 数量">
            <template scope="s">
              {{ getRefValue(s.row, 'product', 'products', 'name') }}
              *
              {{ s.row.amount }}
            </template>
          </el-table-column>
          <el-table-column
            :label="rtype + '总额'">
            <template scope="s">
              {{ s.row.sum }} 元
            </template>
          </el-table-column>
        </el-table>

        <div class="table-footer">
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
  </div>
</template>

<script>
import { fetchApi } from '../api'
import access from 'object-access'
import _ from 'lodash'

let rtype = '订单'

export default {
  data () {
    return {
      rtype,
      refMap: null,
      listLoading: false,
      listTotal: 0,
      itemList: [],
      pageCurrent: 1,
      pageSizes: [10, 20, 50],
      pageSize: 10
    }
  },

  created () {
    this.loadList()
  },

  methods: {
    // object-access: fromKey should not include `.`
    getRefValue (srcObj, fromKey, tarRes, toKey) {
      let uid = access(srcObj, fromKey)
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
        '/a/orders/list?sort=-1&limit=',
        pageSize, '&page=', pageCurrent
      ].join('')
      fetchApi(url)
        .then(data => {
          let { total, docs, refs } = data
          this.refMap = this.toRefMap(refs)
          this.itemList = docs
          this.listTotal = total
          this.listLoading = false
        })
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
