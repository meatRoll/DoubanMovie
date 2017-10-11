<template>
  <div id="app">
    <x-header :title="title" ref='header' :left-options="{showBack}"></x-header>
    <router-view :heightData='heightData'></router-view>
    <tabbar @on-index-change='changeText' v-model="index" ref='tabbar'>
      <tabbar-item link="/in_theaters">
        <span slot="label" ref='tabbarItem0'>正在热映</span>
      </tabbar-item>
      <tabbar-item link="/coming_soon">
        <span slot="label" ref='tabbarItem1'>即将上映</span>
      </tabbar-item>
      <tabbar-item link="/top250">
        <span slot="label" ref='tabbarItem2'>Top250</span>
      </tabbar-item>
      <tabbar-item link="/us_box">
        <span slot="label" ref='tabbarItem3'>北美票房榜</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { XHeader, TransferDom, Tabbar, TabbarItem } from 'vux';

export default {
  created() {
    // 设置html字体大小
    document.documentElement.style.fontSize = `${window.innerWidth / 25}px`;

    this.setTabbarIndex();
    if (this.routesArr.some(elem => elem === this.$route.path)) this.showBack = false;
    else this.showBack = true;
  },
  mounted() {
    this.heightData = `${document.body.offsetHeight - this.$refs.header.$el.offsetHeight - this.$refs.tabbar.$el.offsetHeight}px`;
  },
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Tabbar,
    TabbarItem
  },
  data() {
    return {
      title: '',
      index: 0,
      routeViewHeight: '',
      heightData: '',
      showBack: false,
      routesArr: ['/in_theaters', '/coming_soon', '/top250', '/us_box']
    }
  },
  methods: {
    // 设置title
    changeText(index) {
      this.title = this.$refs[`tabbarItem${index}`].innerText;
    },
    // 根据route设置相应选中项
    setTabbarIndex() {
      this.routesArr.forEach((item, index) => {
        if (item === this.$route.path) {
          this.index = index;
        }
      }, this);
    }
  },
  watch: {
    $route(newval) {
      this.setTabbarIndex();
      if (this.routesArr.some(elem => elem === newval.path)) this.showBack = false;
      else this.showBack = true;
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import './assets/css/common.less';

html,
body,
#app {
  width: 100%;
  height: 100%;
}

.router-view {
  overflow: hidden;
}
</style>
