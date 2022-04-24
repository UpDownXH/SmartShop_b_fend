<template>
  <div class="layout">
    <el-container class="container">
      <el-aside class="aside">
        <!-- 系统名称，logo -->
        <div class="head">
          <div>
            <img src="@/assets/logo.png" alt="logo">
            <span>智购-后台</span>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="line"></div>
        <!-- menu主菜单 -->
        <el-menu :router="true" background-color="#222832" text-color="#fff">
          <!-- menu子菜单 -->
          <el-sub-menu>
            <!-- 子菜单标题 -->
            <template #title>
              <span>
                Dashboard
              </span>
            </template>
            <!-- menu子子菜单 -->
            <el-menu-item-group>
              <!-- menu子子子菜单 -->
              <el-menu-item index="/">
                <el-icon>
                  <home-filled />
                </el-icon>首页
              </el-menu-item>
              <el-menu-item index="/add">
                <el-icon>
                  <home-filled />
                </el-icon>添加商品
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container class="content">
        <Header />
        <div class="main">
          <!--路径匹配到的组件，将会展示在这里-->
          <router-view></router-view>
        </div>
        <Footer />
      </el-container>
    </el-container>
  </div>

</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style scoped>
.layout {
  min-width: 100vh;
  background-color: #61b498;
}

.container {
  height: 100vh;
}

.aside {
  width: 200px !important;
  background-color: #3d4955;
}

.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.head>div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.head span {
  font-size: 20px;
  color: #ffffff;
}

.line {
  border-top: 1px solid hsla(0, 0%, 100%, .05);
  border-bottom: 1px solid rgba(0, 0, 0, .2);
}

.content {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}

.main {
  /* 添加 Header 和 Footer 之后，main 的高度应该是 100vh - 100px */
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px;
}
</style>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>