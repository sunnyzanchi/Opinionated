<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <div class="numbers-container">
    <number-button v-for="score in scores"
                   @select="selectScore(score)"
                   :disabled="currentScore !== null"
                   :score="score" />
  </div>
</template>
<!-- ### -->
<script>
import NumberButton from 'Components/NumberButton.vue';

export default {
  components: {
    NumberButton
  },
  data(){
    return {
      currentScore: null
    }
  },
  methods: {
    selectScore(newScore){
      return this.currentScore = newScore;
    }
  },
  props: ['scores']
}
</script>
