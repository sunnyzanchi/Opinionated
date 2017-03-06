<style lang="css">
.modal{
  color: #333;
}
.modal button{
  margin: 10px;
}
</style>
<template lang="html">
  <div class="modal-container">
    <div class="modal">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {}
</script>
