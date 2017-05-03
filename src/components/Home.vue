<template>
  <div class="page-login">
    <div class="page-topbar">
      <h1>点餐管理后台</h1>
      <ul>
        <li @click="logout()">退出登录</li>
      </ul>
    </div>

    <div class="page-body">
      <div class="page-sidebar">
        <el-menu :default-active="activeTab" class="el-menu-vertical-demo"
            @select="handleSideNavSelect">
          <!--<el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>导航一</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="/products">商品管理</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>-->
          <el-menu-item index="products"><i class="el-icon-menu"></i>商品管理</el-menu-item>
          <el-menu-item index="orders"><i class="el-icon-document"></i>订单管理</el-menu-item>
          <el-menu-item index="exchanges"><i class="el-icon-date"></i>交易管理</el-menu-item>
        </el-menu>
      </div>

      <div class="page-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    let activeTab = this.$route.path.substr(1) // remove leading `/`
    return {
      activeTab
    }
  },

  methods: {
    logout () {
      // todo
    },

    handleSideNavSelect (key, keyPath) {
      console.log('handleSideNavSelect', key, keyPath)
      this.$router.push(key)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.page-login {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.page-body {
  flex: 1;
  display: flex;
  flex-direction: row;
}
.page-sidebar {
  width: 200px;
  overflow: auto;
  >ul {
    height: 100%;
  }
}
.page-main {
  flex: 1;
  padding: 20px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.page-topbar {
  // background-color: #44a8f2;
  // color: white;
  background-color: rgb(50, 65, 87);
  color: rgb(191, 203, 217);
  height: 60px;
  display: flex;
  align-items: center;
  h1 {
    font-size: 20px;
    font-weight: normal;
    margin-left: 20px;
  }
  ul {
    flex: 1;
  }
  li {
    display: inline-block;
    cursor: pointer;
    float: right;
    margin-right: 20px;
    font-size: 14px;
  }
}
.pull-right {
  float: right !important;
}
</style>

<style lang="less">
  [class^="el-icon-fa"], [class*=" el-icon-fa"] {
    font-family:"FontAwesome" !important;
    display: inline-block;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  @import url("../../node_modules/font-awesome/less/font-awesome");
  @fa-css-prefix: el-icon-fa;
  @import url("../../node_modules/element-ui/lib/theme-default/index.css");
</style>
