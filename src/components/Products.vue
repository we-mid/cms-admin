<template>
  <div>

    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品1007</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="card-title" slot="header">
        <i class="el-icon-arrow-down"></i>
        <span>商品列表</span>
      </div>

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
              <el-form-item label="商品分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="供应商">
                <span>{{ props.row.provider }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="操作">
                <el-button type="default" size="mini" icon="edit"></el-button>
                <el-button type="danger" size="mini" icon="delete"
                    @click="deleteItem(props.row.uid)"></el-button>
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
        <el-button type="primary" size="small" icon="plus">新增商品</el-button>
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </el-card>

    <el-card class="box-card">
      <div class="card-title" slot="header">
        <i class="el-icon-edit"></i>
        <span>编辑商品 1007</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px" class="demo-form">
        <el-form-item label="活动名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch on-text="" off-text="" v-model="form.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>


    <el-card class="box-card">
      <div class="card-title" slot="header">
        <i class="el-icon-edit"></i>
        <span>添加商品</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px" class="demo-form">
        <el-form-item label="商品名称">
          <el-input v-model="newItem.name"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input type="textarea" v-model="newItem.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="formSubmit">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import fetch from 'isomorphic-fetch'
import _ from 'lodash'

// fetch('http://localhost:3001/api/products/list')
//   .then(res => res.json())
//   .then(data => {
//     console.log('data', data)
//   })

let itemTemplate = {
  name: '',
  description: ''
}

export default {
  data () {
    return {
      listCardOpen: true,
      listTotal: 0,
      itemList: [],
      newItem: _.clone(itemTemplate),

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
      fetch('http://localhost:3001/api/products/list?sort=-1')
        .then(res => res.json())
        .then(data => {
          let { total, docs } = data
          this.itemList = docs
          this.listTotal = total
        })
        .catch(err => {
          console.error('err', err)
          alert(err)
        })
    },

    deleteItem (uid) {
      fetch('http://localhost:3001/api/products/delete', {
        method: 'POST',
        body: JSON.stringify({ uid })
      })
      .then(data => {
        this.loadList()
      })
      .catch(err => {
        console.error('err', err)
        alert(err)
      })
    },

    formSubmit () {
      fetch('http://localhost:3001/api/products/create', {
        method: 'POST',
        body: JSON.stringify(this.newItem)
      })
      .then(() => {
        this.newItem = _.clone(itemTemplate)
        this.loadList()
      })
      .catch(err => {
        console.error('err', err)
        alert(err)
      })
    },

    handleSizeChange () {},
    handleCurrentChange () {}
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

.demo-form {
  width: 440px;
}
.demo-form .line {
    text-align: center;
}

.box-card {
  margin-top: 20px;
  width: 500px;
}
.card-title {
  i {
    margin-right: 0.3em;
  }
}

.el-checkbox, .el-radio {
  margin-right: 15px;
  margin-left: 0 !important;
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

.el-button+.el-button {
  margin-left: 0 !important;
}
</style>
