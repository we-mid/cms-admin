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
                <el-form-item :label="rtype + '角色'">
                  <span>{{ props.row.rolesText }}</span>
                </el-form-item>
                <el-form-item :label="rtype + 'AD'">
                  <span>{{ props.row.ad || '-' }}</span>
                </el-form-item>
                <el-form-item :label="rtype + '昵称'">
                  <span>{{ props.row.name }}</span>
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
            :label="rtype + 'AD'">
            <template scope="s">{{ s.row.ad || '-' }}</template>
          </el-table-column>
          <el-table-column
            :label="rtype + '昵称'"
            prop="name">
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

let rtype = '用户'

let roleTextMap = {
  '8': '供应商',
  '5': '行政管理员',
  '1': '点餐用户'
}

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
        '/a/users/list?limit=',
        pageSize, '&page=', pageCurrent
      ].join('')
      fetchApi(url)
        .then(data => {
          let { total, docs } = data
          docs = docs.map(this.wrapItem)
          this.itemList = docs
          this.listTotal = total
          this.listLoading = false
        })
    },
    wrapItem (doc) {
      let { roles } = doc
      roles = roles.sort().reverse() // 逆序
      return {
        ...doc,
        rolesText: roles.map(v => roleTextMap[v])
          .join(', ') || '-'
      }
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
