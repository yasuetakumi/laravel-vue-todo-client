<template>
  <v-main>
    <GDebugLabel></GDebugLabel>
    <v-container class="login-card d-flex flex-column">
      <v-container class="d-flex justify-center">
        <v-card :loading="isLoading" width="390">
          <template slot="progress">
            <v-progress-linear height="10" indeterminate></v-progress-linear>
          </template>

          <v-card-title>{{ $t('general.auth.welcome') }}</v-card-title>
          <v-card-subtitle>{{ $t('general.auth.signInMessage') }}</v-card-subtitle>
          <v-form class="ma-3" @submit.prevent="login">
            <v-text-field
              :label="$t('general.auth.email')"
              v-model="email"
              :placeholder="$t('general.placeholder.email')"
              :rules="emailRules"
              outlined
              required
            ></v-text-field>
            <v-text-field
              :label="$t('general.auth.password')"
              v-model="password"
              type="password"
              placeholder=""
              :rules="passwordRules"
              outlined
              required
            ></v-text-field>
            <v-card-text class="py-1 px-1 " style="border-radius: 8px; background-color:#ddeeff; color:#4466aa;">
              <div class="ml-3">
                <p>以下のログイン情報をお使いください。</p>
                <p>
                  Email: admin@company.com<br />Password: 12345678
                  <v-btn
                    class="ml-12"
                    small
                    v-on:click="
                      email = 'admin@company.com';
                      password = '12345678';
                    "
                    >SET</v-btn
                  >
                </p>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn block class="pa-2" color="primary" type="submit">{{ $t('general.auth.login') }}</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-container>
      <v-container>
        <locale-selector style="width:150px"></locale-selector>
      </v-container>
    </v-container>
    <v-overlay v-if="loading_hand_shake" value="Loading...">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-main>
</template>

<script>
import { mapState } from 'vuex';
import LocaleSelector from '@components/LocaleSelector.vue';
import GDebugLabel from '@views/_components/GDebugLabel.vue';
import Vue from 'vue';

const laravelURL = 'https://laravel-vue-todo-api-production.up.railway.app/api' 

export default {
  components: { LocaleSelector, GDebugLabel },
  data: () => ({
    email: '',
    password: '',
    remember: false,
    loading_hand_shake: true,
    emailRules: [
      v => !!v || 'E-mail is required',
      v =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || 'E-mail must be valid',
    ],
    passwordRules: [v => !!v || 'Password is required'],
  }),

  computed: mapState({
    isLoading: state => state.auth.isLoading,
  }),

  methods: {
    login() {
      let credentials = {
        email: this.email,
        password: this.password,
        remember: this.remember,
      };
      this.$store.dispatch('auth/login', { credentials });
    },
    initHandShake: async function() {
      if (!this.loading_hand_shake) {
        // End this method if you are already hand shaked.
        return;
      }
      try {
        const res = await Vue.axios.get(`${laravelURL}/hand-shake`);
        if (res.data.result == '___SUCCESS___') {
          this.loading_hand_shake = false;
        } else {
          throw new Error('hand shaking is not succeed.');
        }
      } catch (err) {
        console.error(
          'Hand shaking is not succeed. 1. If Request url is not correct,you can check client/.env file. 2.If file access is denied, please execute artisan config:clear in docker container, not on host. '
        );
        console.error(err);
      }
    },
  },
  created: async function() {
    console.debug('begin:created');
    this.initHandShake();
  },
};
</script>

<style lang="scss" scoped>
.login-card {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
