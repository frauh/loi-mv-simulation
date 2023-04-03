import {createApp} from "vue";
import App from "./App.vue";
import VueModal from "@kouts/vue-modal";
import "@kouts/vue-modal/dist/vue-modal.css";

createApp(App).use(VueModal).mount("#app");
