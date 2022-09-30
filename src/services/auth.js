import Vue from 'vue';
const laravelURL = 'https://laravel-vue-todo-api-production.up.railway.app' 

/*
 * A cookie based auth using native laravel session
 */
const cookieAuth = {
  async login(credentials, guard) {
    let loginEndpoint = guard !== '' ? `${laravelURL}/${guard}/login` : `${laravelURL}/login`;
    try {
      const csrfCookie = await Vue.axios.get(`${laravelURL}/api/sanctum/csrf-cookie`);
      if (csrfCookie) {
        const login = await Vue.axios.post(loginEndpoint, credentials);
        if (login.data.status) {
          return login.data;
        } else {
          throw new Error('Failed to login');
        }
      }
    } catch (err) {
      return {
        status: false,
        messages: err.message,
      };
    }
  },

  async logout(guard) {
    let logoutEndpoint = guard !== '' ? `${laravelURL}/${guard}/logout` : `${laravelURL}/logout`;
    try {
      const res = await Vue.axios.get(logoutEndpoint);
      if (res.status) {
        console.log(res);
        return {
          status: true,
        };
      } else {
        return {
          status: false,
          message: 'Error logging out',
        };
      }
    } catch (err) {
      return {
        status: false,
        message: err.message,
      };
    }
  },

  async checkAuth() {
    try {
      const res = await Vue.axios.get(`${laravelURL}/auth-check`);
      console.log(res);
      return res.data;
    } catch (err) {
      return {
        status: false,
        message: err.message,
      };
    }
  },
};

export default cookieAuth;

// @TODO: implement different auth mechanism
