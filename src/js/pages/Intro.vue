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
const change = require('../mixins/change.js');

module.exports = {
  components: {},
  computed: {},
  data(){
    return {}
  },
  methods: {
    log(){
      ;;console.log(this.ws);
    }
  },
  mixins: [change],
  mounted(){},
  props: ['ws']
}
</script>
