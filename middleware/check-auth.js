// ログインされていない場合は自動的にトップページにリダイレクト
// （middlewareは pages の読み込み前に実行される）
export default function({ store, redirect }) {
  const isAuth = store.getters["isAuthenticated"];
  if (!isAuth) {
    return redirect("/");
  }
}
