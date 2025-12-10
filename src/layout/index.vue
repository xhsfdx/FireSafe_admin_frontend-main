<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-if="!isDigitalScreen" class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView && !isDigitalScreen}" class="main-container">
      <div v-if="!isDigitalScreen" :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
       <!-- 去除右侧设置
      <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
    </div> 
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    isDigitalScreen() {
      return this.$route.path.includes('/digital-screen') || this.$route.name === 'DigitalScreenMain'
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened || this.isDigitalScreen,
        openSidebar: this.sidebar.opened && !this.isDigitalScreen,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
        'digital-screen-mode': this.isDigitalScreen
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  /* Hide layout elements for digital screen */
  .digital-screen-mode {
    .sidebar-container {
      display: none !important;
    }
    
    .main-container {
      margin-left: 0 !important;
      width: 100% !important;
    }
    
    .fixed-header {
      display: none !important;
    }
  }
</style>
