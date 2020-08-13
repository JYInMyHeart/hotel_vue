<template>
  <div>
    <NavMenu></NavMenu>
    <router-view/>
    <Header></Header>
  </div>
</template>

<script>
import NavMenu from '@/views/NavMenu'
export default {
  name: 'Main',
  components: { NavMenu }
}
</script>

<style scoped>

</style>
