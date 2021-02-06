<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          非公開ページ
        </v-card-title>
        <v-card-text>
          <p>登録ユーザーのみ閲覧可</p>
          <p>メールアドレス：{{ authUser.email }}</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// storeの値を呼び出す例
import { mapState } from "vuex";
export default {
  middleware: "check-auth",
  computed: {
    ...mapState(["authUser"])
  }
};
</script>
