<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <h2 class="text-center title font-weight-bold mb-2">
          メールアドレスでログイン
        </h2>
        <v-row>
          <v-col>
            <v-card flat>
              <v-card-text class="pa-0">
                <v-form ref="login_form" v-model="login_valid" lazy-validation>
                  <v-text-field
                    v-model="login_email"
                    label="メールアドレス"
                    required
                  />

                  <v-text-field
                    v-model="login_password"
                    label="パスワード"
                    required
                    autocomplete="off"
                    :append-icon="
                      show_loginpassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="show_loginpassword ? 'text' : 'password'"
                    @click:append="show_loginpassword = !show_loginpassword"
                  />

                  <v-alert v-if="loginErrorMsg" dense text type="error">
                    {{ loginErrorMsg }}
                  </v-alert>

                  <v-btn
                    :disabled="!login_valid"
                    color="primary"
                    class="my-4 white--text"
                    @click="emailLogin"
                  >
                    ログイン
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
        <v-alert v-if="socialLoginErrorMsg" dense text type="error" dismissible>
          {{ socialLoginErrorMsg }}
        </v-alert>
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
      login_valid: true,
      login_email: "",
      login_password: "",
      show_loginpassword: false,
      loginErrorMsg: "",
      socialLoginErrorMsg: ""
    };
  },
  methods: {
    emailLogin() {
      this.$fire.auth
        .signInWithEmailAndPassword(this.login_email, this.login_password)
        .then(() => {
          this.$router.push("/private"); // 非公開ページへ遷移（"/"にすればトップへ）
        })
        .catch(err => {
          this.loginErrorMsg = "メールアドレスまたはパスワードが間違っています";
        });
    }
  }
};
</script>
