<template>
  <div class="area">
  </div>
  <h3 class="heading-right">{{ title }}</h3>
</template>

<script>
export default {
  name: "LogArea",
  props: {
    title: String
  }
}
</script>

<style scoped>
.area {
  background: white;
  border: 5px solid steelblue;
  border-radius: 15px;
  /*height: 36vh;*/
  margin-top: 2vh;
  flex:1;
}

.heading-right {
  position: absolute;
  color: steelblue;
  background: white;
  top: 51.25vh;
  right: 40px;
}
</style>