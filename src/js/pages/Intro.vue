<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <div class="intro">
    <h1 class="title">Opinionated</h1>
    <div class="intro-buttons">
      <button class="outline-button" @click="changeDialog('Join')">Join Room</button>
      <button class="outline-button" @click="changeDialog('Create')">New Room</button>
    </div>
  </div>
</template>
<!-- ### -->
<script>
import change from 'Mixins/change';

export default {
  data(){
    return {}
  },
  mixins: [change],
  props: ['ws']
}
</script>
