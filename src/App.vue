<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
html, body, #app {
  height: 100%;
}
body {
  margin: 0;
  overflow: hidden;
  background-color: #f7f7f7;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.card-title {
  i {
    margin-right: 0.3em;
  }
}
</style>

<!--<style lang="less">
  [class^="el-icon-fa"], [class*=" el-icon-fa"] {
    font-family:"FontAwesome" !important;
    display: inline-block;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  @import url("../node_modules/font-awesome/less/font-awesome");
  @fa-css-prefix: el-icon-fa;
  @import url("../node_modules/element-ui/lib/theme-default/index.css");
</style>-->

