import { createStore } from "vuex";
import app from './modules/app';
import login from "./modules/login";
import common from "./modules/common";
import infoDetail from "./modules/infoDetail";

export default createStore({
  modules: {
    app,
    login,
    common,
    infoDetail
  }
});
