import router from "@/router";
import { getToken } from "@/utils/auth";

const whiteList = ["/login", "/signUp", "/forgetWord", "/code"];

router.beforeEach((to, form, next) => {
  if (getToken()) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});
