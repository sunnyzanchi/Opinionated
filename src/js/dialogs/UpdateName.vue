<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <div class="modal-container">
    <div class="modal">
      <h2>Change Name</h2>
      <div class="modal-content">
        <label for="new-name">New Name</label>
        <input type="text"
               id="new-name"
               @keyup.enter="updateName"
               v-model="newName">
      </div>
      <div class="button-inliner">
        <button @click="closeDialog">Cancel</button>
        <button @click="updateName">Change Name</button>
      </div>
    </div>
  </div>
</template>
<!-- ### -->
<script>
const change = require('../mixins/change.js');
const wsOut = require('../wsOut.js');
module.exports = {
  components: {},
  computed: {},
  data () {
    return {
      newName: ''
    }
  },
  methods: {
    updateName(){
      wsOut.updateName(this.ws, this.newName);
      this.closeDialog();
    }
  },
  mixins: [change],
  mounted () {},
  props: ['ws']
}
</script>
