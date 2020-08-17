<template>
  <div>
    <keep-alive v-if="isRouterAlive" >
      <transition name="el-zoom-in-center">
      <component   v-bind:is="off"></component>
      </transition>
    </keep-alive>
<!--    <NavMenu></NavMenu>-->
    <router-view/>
    <Header></Header>
  </div>
</template>

<script>
import NavMenu from '@/views/NavMenu'

export default {
  name: 'Main',
  components: { NavMenu },
  data () {
    return {
      off: 'NavMenu',
      isRouterAlive: true
    }
  },
  provide () {
    return {
      myReload: this.myReload
    }
  },
  methods: {
    myReload: function () {
      console.log('myReload')
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style scoped>

</style>
