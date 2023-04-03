<template>
    <div class="list">
        <div v-for="vehicle in vehicles" :key="vehicle.id">
            <VehicleItem
                    :vehicle="vehicle"
                    @deleteVehicle="$emit('deleteVehicle', vehicle.id)"
                    @toggleTracking="$emit('toggleTracking', vehicle.id)"
            />
        </div>
        <AddVehicle/>
    </div>
    <h3 class="heading-right">{{ title }}</h3>
</template>

<script>
import VehicleItem from "@/components/VehicleItem.vue";
import AddVehicle from "@/components/AddVehicle.vue";

export default {
    name: "VehicleList",
    components: {
        AddVehicle,
        VehicleItem,
    },
    props: {
        title: String,
        vehicles: Array,
    },
    emits: ["addVehicle", "toggleTracking", "deleteVehicle", "programUpload"],
};
</script>

<style scoped>
.heading-right {
    position: absolute;
    color: steelblue;
    background: white;
    top: -9px;
    right: 40px;
}

.list {
    background: white;
    border: 5px solid steelblue;
    border-radius: 15px;
    display: block;
    height: 50vh;
    overflow-y: auto;
    scroll-behavior: smooth;
}
</style>
