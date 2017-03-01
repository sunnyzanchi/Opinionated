<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <button class="number" :disabled="status === 'disabled'"
          @click="select">
    <i class="material-icons" v-if="status === 'primed'">lock_open</i>
    <i class="material-icons" v-if="status === 'submitted'">lock_outline</i>
    <template v-if="status === 'available' || status === 'disabled'">{{score}}</template>
  </button>
</template>
<!-- ### -->
<script>
export default {
  components: {},
  computed: {

  },
  data(){
    return {}
  },
  methods: {
    select(){
      this.$emit('select', this.score);
    }
  },
  mounted(){},
  props: ['score', 'status']
}
</script>
