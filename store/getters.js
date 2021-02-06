/*
getters： stateの値を加工して値を取得する処理を記載
*/

export default {
  // ユーザー情報を返す
  authUser(state) {
    return state.authUser || null;
  },
  // ユーザー情報がある場合はtrue
  isAuthenticated(state) {
    return !!state.authUser;
  }
  // 管理者の場合はtrue ※未実装
  // isAdmin(state) {
  //   return state.authUser.role === 'admin'
  // }
};
