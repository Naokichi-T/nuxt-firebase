/*
actions： 基本的に、mutationsを非同期処理したくなった時に記載
*/

export default {
  // サーバーからログイン情報を取得
  // see https://lab.astamuse.co.jp/entry/2019/05/29/114500
  async nuxtServerInit({ dispatch }, ctx) {
    if (this.$fire.auth === null) {
      throw "nuxtServerInit Example not working - this.$fire.auth cannot be accessed.";
    }
    if (ctx.$fire.auth === null) {
      throw "nuxtServerInit Example not working - ctx.$fire.auth cannot be accessed.";
    }
    if (ctx.app.$fire.auth === null) {
      throw "nuxtServerInit Example not working - ctx.$fire.auth cannot be accessed.";
    }
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      const { allClaims: claims, ...authUser } = ctx.res.locals.user;
      console.info(
        "Auth User verified on server-side. User: ",
        authUser,
        "Claims:",
        claims
      );
      await dispatch("onAuthStateChanged", {
        authUser,
        claims
      });
    }
  },

  // 認証情報を監視し、変更があればリセット
  onAuthStateChanged({ commit }, { authUser }) {
    if (!authUser) {
      commit("resetStore");
      return;
    }
    console.log("AuthStateChangedAction", authUser); // 本番ではコメントアウトする
    commit("setAuthUser", authUser);
  }
};
