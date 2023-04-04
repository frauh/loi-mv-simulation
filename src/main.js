import {createApp} from "vue";
import App from "./App.vue";
import VueKonva from 'vue-konva';
import VueModal from "@kouts/vue-modal";
import "@kouts/vue-modal/dist/vue-modal.css";

createApp(App).use(VueKonva).use(VueModal).mount("#app");
