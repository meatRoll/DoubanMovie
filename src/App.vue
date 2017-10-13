<template>
  <div id="app">
    <drawer width="16.67rem" :show.sync="drawerVisibility" :show-mode="showModeValue" :placement="showPlacementValue" :drawer-style="{'background-color':'#35495e', width: `${250 / 15}rem`}">
      <!-- left content -->
      <div slot="drawer" class="drawer">
        <group label-align="left" class="drawer-group">
          <group-title slot="title" class="drawer-movie-search">电影搜索</group-title>
          <x-input title="电影名称" placeholder="请输入电影名称" v-model="movienameVal" ref="moviename"></x-input>
          <x-input title="电影类型" placeholder="请输入电影类型" v-model="movietypeVal"></x-input>
          <x-button class="drawer-movie-search-btn" @click.native="submit" :show-loading="$store.state.isSearch">点击搜索</x-button>
        </group>
        <group class="drawer-group drawer-group-img">
          <img :src="both" alt="nini&mimi">
        </group>
      </div>

      <!-- main content -->
      <x-header :title="title" ref='header' :left-options="{showBack}">
        <x-icon slot="overwrite-left" type="ios-search-strong" size="30" class="overwrite-left" @click="showDrawer" v-if="!showBack"></x-icon>
      </x-header>
      <router-view :heightData='heightData' @drawerVisibilityChange='changeDrawerVisibility'></router-view>
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
    </drawer>
  </div>
</template>

<script>
import { XHeader, TransferDom, Tabbar, TabbarItem, Drawer, Group, GroupTitle, XInput, XButton, XImg } from 'vux';
import both from './assets/both.jpeg';

export default {
  created() {
    // 设置html字体大小
    document.documentElement.style.fontSize = `${window.innerWidth / 25}px`;

    this.setTabbarIndex();
    if (this.routesArr.some(elem => elem === this.$route.path)) this.showBack = false;
    else this.showBack = true;
  },
  mounted() {
    // 设置app大小
    document.getElementById('app').style.height = `${document.body.offsetHeight}px`;
    this.heightData = `${document.body.offsetHeight - this.$refs.header.$el.offsetHeight - this.$refs.tabbar.$el.offsetHeight}px`;
  },
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Tabbar,
    TabbarItem,
    Drawer,
    Group,
    GroupTitle,
    XInput,
    XButton,
    XImg
  },
  data() {
    return {
      title: '',
      index: 0,
      routeViewHeight: '',
      heightData: '',
      showBack: false,
      routesArr: ['/in_theaters', '/coming_soon', '/top250', '/us_box', '/search', '/moviedetail'],
      showModeValue: 'push',
      showPlacementValue: 'left',
      both,
      movienameVal: '',
      movietypeVal: '',
      drawerVisibility: false
    }
  },
  methods: {
    // 设置title
    changeText(index) {
      if (index >= 0 && index <= 3) this.title = this.$refs[`tabbarItem${index}`].innerText;
      else if (index === 4) this.title = '电影搜索结果';
      else if (index === 5) this.title = '电影详情';
    },
    // 根据route设置相应选中项
    setTabbarIndex() {
      this.routesArr.forEach((item, index) => {
        if (new RegExp(item).test(this.$route.path)) {
          this.index = index;
        }
      }, this);
    },
    // 显示Drawer
    showDrawer() {
      this.drawerVisibility = true;
      // 获得焦点
      setTimeout(() => {
        this.$refs.moviename.focus();
      }, 250);
    },
    // 提交
    submit() {
      if (this.movienameVal.trim() === '' && this.movietypeVal.trim() === '') {
        this.$vux.toast.show({
          text: '不能为空',
          type: 'warn',
          position: 'middle'
        });
      } else {
        this.$router.push({ path: '/search', query: { q: this.movienameVal, tag: this.movietypeVal } });
        this.$store.commit('changeIsSearch');
      }
    },
    // 改变Drawer状态
    changeDrawerVisibility() {
      this.drawerVisibility = !this.drawerVisibility;
    }
  },
  watch: {
    // Xheader左边图标的切换
    $route(newval) {
      this.setTabbarIndex();
      if (this.routesArr.some(elem => elem === newval.path)) this.showBack = false;
      else this.showBack = true;
    },
    // 隐藏Drawer时清空输入框
    drawerVisibility(newval) {
      if (newval === false) {
        this.movienameVal = '';
        this.movietypeVal = '';
      }
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
  overflow: hidden;
}

.router-view {
  overflow: hidden;
}

.overwrite-left {
  fill: #fff;
  position: relative;
  top: -8rem / @param;
  left: -3rem / @param;
}

.weui-cells__title.drawer-movie-search {
  font-size: 22px;
  margin: 30px 0;
}

.vux-drawer-content .weui-cells {
  margin: 0 5rem / @param;
  border-radius: 2rem / @param;
}

.drawer-movie-search-btn {
  margin-top: 10px;
}

.drawer-group-img {
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  bottom: 15px;
}

.drawer-group-img img {
  display: block;
  width: 100%;
}
</style>
