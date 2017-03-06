<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <button class="number" :disabled="status === 'disabled' || disabled"
          @click="select">
    <i class="material-icons" v-if="status === 'submitted'">lock_outline</i>
    <template v-if="status === 'available' || status === 'disabled'">{{score}}</template>
  </button>
</template>
<!-- ### -->
<script>
import {SET_SCORE} from 'Store/mutations';

export default {
  data(){
    return {
      status: 'available'
    }
  },
  methods: {
    select(){
      this.status = 'submitted';
      this.$store.commit(SET_SCORE, this.score);
    }
  },
  props: {
    disabled: Boolean,
    score: Number
  }
}
</script>
