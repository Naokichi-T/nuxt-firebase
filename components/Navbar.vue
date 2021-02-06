<template>
  <v-app-bar color="primary" dark app>
    <v-toolbar-title>
      <b class="title">Nuxt App</b>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <template v-if="isAuth">
      <v-btn class="mx-1 px-1" outlined @click="logout">
        ログアウト
      </v-btn>
      <v-btn class="mx-1 px-1" outlined nuxt to="/account/mypage">
        マイページ
      </v-btn>
    </template>
    <template v-else>
      <v-btn class="mx-1 px-1" outlined nuxt to="/account/login">
        ログイン
      </v-btn>
      <v-btn class="mx-1 px-1" outlined nuxt to="/account/register">
        新規登録
      </v-btn>
    </template>
    <template v-slot:extension>
      <v-tabs align-with-title show-arrows>
        <v-tab nuxt to="/">トップ</v-tab>
        <v-tab nuxt to="/page1">ページ1</v-tab>
        <v-tab nuxt to="/page2">ページ2</v-tab>
        <v-tab nuxt to="/private" v-if="isAuth">非公開</v-tab>
        <v-tabs-slider></v-tabs-slider>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      isAuth: "isAuthenticated",
      isAdmin: "isAdmin"
    })
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut();
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 2rem !important;
}
</style>
