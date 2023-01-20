<template>
  <button :style="{color: color}"
          :title="description"
          class="btn"
          @click="onClick()">
    <i :class="icon"/>
  </button>
</template>

<script>
export default {
  name: "ControlButton",
  props: {
    description: String,
    icon: String,
    color: String
  },
  methods: {
    onClick() {
      this.$emit('btn-click')
    }
  }
}
</script>

<style scoped>
.btn {
  width: 5vw;
  cursor: pointer;
  margin-left: auto;
  margin-right: auto;
  aspect-ratio: 1;
  font-size: 1vw;
}
</style>