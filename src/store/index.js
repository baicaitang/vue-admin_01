import { createStore } from "vuex";
import app from './modules/app';
import login from "./modules/login";

export default createStore({
  modules: {
    app,
    login
  }
});
