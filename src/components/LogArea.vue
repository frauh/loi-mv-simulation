<template>
    <div ref="container" class="container" v-html="output"/>
    <h3 class="heading-right">{{ title }}</h3>
</template>

<script>
export default {
    name: "LogArea",
    props: {
        title: String,
    },
    data() {
        return {
            output: "",
        };
    },
    updated() {
        this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
    },
};
</script>

<style scoped>
.container {
    background: white;
    border: 5px solid steelblue;
    border-radius: 15px;
    margin-top: 2vh;
    padding-top: 3px;
    flex: 1;
    overflow-y: auto;
    scroll-behavior: smooth;
}

.heading-right {
    position: absolute;
    color: steelblue;
    background: white;
    top: 51.25vh;
    right: 40px;
}
</style>
