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
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item :label="rtype + 'UID'">
                  <span>{{ props.row.uid }}</span>
                </el-form-item>
                <el-form-item label="用户AD">
                  <span>{{ props.row.user }}</span>
                </el-form-item>
                <el-form-item label="创建日期">
                  <span>{{ new Date(props.row.createdAt).toLocaleString() }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :label="rtype + 'UID'"
            prop="uid">
          </el-table-column>
          <el-table-column
            :label="rtype + '用户AD'">
            <template scope="s">
              adadad
            </template>
          </el-table-column>
          <el-table-column
            :label="rtype + '总额'">
            <template scope="s">
              123 元
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

let rtype = '订单'

export default {
  data () {
    return {
      rtype,
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
    loadList () {
      this.listLoading = true
      let { pageSize, pageCurrent } = this
      let url = [
        '/orders/list?sort=-1&limit=',
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
