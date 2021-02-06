/*
mutations： stateで設定した変数を更新する処理を記載
*/

import initialState from "./state";

export default {
  resetStore: state => {
    Object.assign(state, initialState());
  },

  setAuthUser: (state, authUser) => {
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email
    };
  }
};
