<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-row class="mb-8">
          <h2>マイページ</h2>
        </v-row>
        <v-row class="mb-8">
          <v-avatar color="grey lighten-3" size="85">
            <v-img :src="img_src" :alt="img_alt"></v-img>
          </v-avatar>
          <v-btn
            class="mt-11 ml-3"
            color="primary"
            v-if="!iconChange"
            @click="iconChange = true"
            >変更</v-btn
          >
        </v-row>
        <template v-if="iconChange">
          <ChangeUserIcon />
        </template>
        <v-row>
          <p class="pt-1">ユーザー名：{{ name }}</p>
          <v-btn
            class="ml-2"
            color="primary"
            v-if="!nameChange"
            @click="nameChange = true"
            >変更</v-btn
          >
        </v-row>
        <v-row class="mb-3" v-if="nameChange">
          <p class="pt-4">ユーザー名変更：</p>
          <v-text-field
            class="mt-0"
            autocomplete="off"
            v-model="new_name"
            :rules="nameRules"
          ></v-text-field>
          <v-btn class="mt-1" color="primary" @click="registName">登録</v-btn>
          <v-btn class="mt-1 ml-2" color="secondary" @click="nameChange = false"
            >キャンセル</v-btn
          >
        </v-row>
        <v-row>
          <p>メールアドレス：{{ email }}</p>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  middleware: "check-auth",
  data() {
    return {
      uid: "",
      name: "",
      new_name: "",
      email: "",
      img_src: "/default_photo.png",
      img_alt: "",
      iconChange: false,
      nameChange: false,
      nameRules: [
        v => !!v || "新しいユーザー名が未入力です",
        v => v.length <= 20 || "20文字以内で入力してください"
      ]
    };
  },
  async created() {
    this.uid = this.$store.state.authUser.uid;
    // TODO: Storageからユーザーの画像を取得
    const usersRef = this.$fire.database.ref("users/" + this.uid);
    const snapshot = await usersRef.once("value");
    const UserData = snapshot.val();
    this.name = UserData.name;
    this.email = UserData.email;
    this.img_alt = this.name + "'s photo";
  },
  methods: {
    registName() {
      alert(this.new_name);
    }
  }
};
</script>

<style scoped>
p {
  font-size: large;
}
</style>
