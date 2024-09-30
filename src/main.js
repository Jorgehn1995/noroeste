import Vue from "vue";
import App from "./App.vue";

// VUEX - https://vuex.vuejs.org/
import store from "./store";

// VUE-ROUTER - https://router.vuejs.org/
import router from "./router";

// PLUGINS
import vuetify from "./plugins/vuetify";

import "./plugins/vue-google-maps";
import "./plugins/vue-shortkey";
import "./plugins/vue-head";
import "./plugins/vue-gtag";
import "./plugins/apexcharts";
import "./plugins/echarts";
import "./plugins/animate";
import "./plugins/clipboard";
import "./plugins/moment";

// FILTERS
import "./filters/capitalize";
import "./filters/lowercase";
import "./filters/uppercase";
import "./filters/formatCurrency";
import "./filters/formatDate";

// STYLES
// Main Theme SCSS
import "./assets/scss/theme.scss";

// Animation library - https://animate.style/
import "animate.css/animate.min.css";

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false;

import AOS from "aos";
import "aos/dist/aos.css";

/*
|---------------------------------------------------------------------
| Main Vue Instance
|---------------------------------------------------------------------
|
| Render the vue application on the <div id="app"></div> in index.html
|
| https://vuejs.org/v2/guide/instance.html
|
*/
export default new Vue({
  vuetify,
  router,
  store,
  mounted() {
    AOS.init({
      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 120, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 400, // values from 0 to 3000, with step 50ms
      easing: "ease", // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
    });
  },
  render: (h) => h(App),
}).$mount("#app");
