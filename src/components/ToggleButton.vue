<template>
    <ControlButton
            :class="isEnabled ? 'enabled' : 'disable'"
            :color="isEnabled ? 'steelblue' : 'lightsteelblue'"
            :description="isEnabled ? descriptionEnabled : descriptionDisabled"
            :icon="icon"
            @btn-click="$emit('toggle')"
    />
</template>

<script>
import ControlButton from "@/components/ControlButton.vue";

export default {
    name: "ToggleButton",
    components: {
        ControlButton,
    },
    props: {
        icon: String,
        descriptionEnabled: String,
        descriptionDisabled: String,
        isEnabled: Boolean,
    },
};
</script>

<style scoped>
.enabled {
    border: 2px solid steelblue;
    border-radius: 5px;
}

.disabled {
    border: initial;
}
</style>
