import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import user from "./modules/user";
import system from "./modules/system";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    system,
  },
  getters,
});
