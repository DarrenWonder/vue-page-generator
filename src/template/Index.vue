<template>
  <slide-transition>
    <router-view></router-view>
  </slide-transition>
</template>
<script>
import SlideTransition from 'components/slide-transition'
export default {
  components: {
    SlideTransition
  }
}
</script>
