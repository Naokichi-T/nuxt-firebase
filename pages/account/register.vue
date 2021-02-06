<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <h2 class="text-center title font-weight-bold mb-2">
          メールアドレスで登録
        </h2>
        <v-row>
          <v-col>
            <v-card flat>
              <v-card-text class="pa-0">
                <v-form
                  ref="register_form"
                  v-model="register_valid"
                  lazy-validation
                >
                  <v-text-field
                    v-model="register_email"
                    label="メールアドレス"
                    :rules="emailRules"
                    required
                    validate-on-blur
                  />

                  <v-text-field
                    ref="register_password"
                    v-model="register_password"
                    label="パスワード"
                    required
                    autocomplete="off"
                    :append-icon="
                      show_registerPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="show_registerPassword ? 'text' : 'password'"
                    :rules="register_passwordRules"
                    validate-on-blur
                    loading
                    @click:append="
                      show_registerPassword = !show_registerPassword
                    "
                  >
                    <template v-slot:progress>
                      <v-progress-linear absolute height="2" />
                    </template>
                  </v-text-field>
                  <v-text-field
                    v-model="register_password_again"
                    label="パスワード（確認）"
                    required
                    autocomplete="off"
                    :append-icon="
                      show_registerPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="show_registerPassword ? 'text' : 'password'"
                    validate-on-blur
                    :rules="register_passwordAgainRules"
                    @click:append="
                      show_registerPassword = !show_registerPassword
                    "
                  />

                  <v-alert v-if="registerErrorMsg" dense text type="error">
                    {{ registerErrorMsg }}
                  </v-alert>

                  <v-btn
                    :disabled="!register_valid"
                    color="primary"
                    class="mr-4 white--text"
                    @click="registEmail"
                  >
                    登録
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-divider class="my-8" />
        <v-row>
          <v-col sm="12">
            <h2 class="text-center title font-weight-bold mb-2">
              その他のアカウントでログイン
            </h2>
          </v-col>
        </v-row>
        <SocialLogin />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SocialLogin from "~/components/SocialLogin.vue";

export default {
  components: {
    SocialLogin
  },
  data() {
    return {
      registerErrorMsg: "",
      register_valid: true,
      register_email: "",
      register_password: "",
      register_password_again: "",
      emailRules: [
        v => {
          if (v) {
            return (
              /.+@.+\..+/.test(v) || "有効なメールアドレスを入力してください"
            );
          } else {
            return true;
          }
        }
      ],
      register_passwordRules: [
        v => !!v || "パスワードを入力してください",
        v =>
          /^[\w-]{6,100}$/.test(v) ||
          "6文字以上(半角英数字, ハイフン, アンダーバー)入力してください"
      ],
      register_passwordAgainRules: [
        v => {
          if (v) {
            return (
              this.$refs.register_password.value === v ||
              "パスワードと一致しません"
            );
          } else {
            return true;
          }
        }
      ],
      show_registerPassword: false
    };
  },
  methods: {
    registEmail() {
      if (this.$refs.register_form.validate()) {
        this.$fire.auth
          .createUserWithEmailAndPassword(
            this.register_email,
            this.register_password
          )
          .then(() => {
            this.registUser(); // Realtime Databaseに登録
          })
          .then(() => {
            this.$router.push("/account/mypage"); // ページ遷移
          })
          .catch(err => {
            if (err.code === "auth/email-already-in-use") {
              this.registerErrorMsg =
                "このメールアドレスは既に登録されています。";
            } else if (err.code === "auth/invalid-email") {
              this.registerErrorMsg = "無効なメールアドレスです。";
            } else {
              this.registerErrorMsg = "エラーにより登録できませんでした。";
            }
          });
      }
    },
    registUser() {
      const currentUser = this.$fire.auth.currentUser;
      this.$fire.database.ref("users/" + currentUser.uid).set({
        email: currentUser.email,
        name: currentUser.email.split("@")[0]
      });
    }
  }
};
</script>
