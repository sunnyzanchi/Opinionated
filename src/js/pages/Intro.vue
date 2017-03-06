<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <div class="intro">
    <!-- Dialog box -->
    <router-view></router-view>
    <h1 class="title">Opinionated</h1>
    <div class="intro-buttons">
      <button class="outline-button" @click="$router.push('join')">Join Room</button>
      <button class="outline-button" @click="$router.push('create')">New Room</button>
    </div>
  </div>
</template>
<!-- ### -->
<script>
import Create from 'Dialogs/Create.vue';
import Join from 'Dialogs/Join.vue';

export default {
  components: {
    Create,
    Join
  },
  data(){
    return {}
  }
}
</script>
