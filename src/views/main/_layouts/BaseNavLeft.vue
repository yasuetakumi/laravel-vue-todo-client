<template>
  <v-navigation-drawer v-model="drawerOpen" app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ $t('general.nav.projectName') }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ $t('general.nav.grune') }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item-group>
        <template v-for="menu in navLeftMenus">
          <v-list-item v-if="!menu.hasChildren" :key="menu.id" :to="menu.route">
            <v-list-item-icon>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(menu.label) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="menu.id">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>{{ menu.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $t(menu.label) }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="submenu in menu.children" :key="submenu.title" :to="submenu.route" exact>
              <v-list-item-icon>
                <v-icon>{{ submenu.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $t(submenu.label) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
const navLeftMenus = [
  {
    id: 'dashboard',
    label: 'general.nav.dashboard',
    route: { name: 'dashboard' },
    icon: 'mdi-home-city',
    hasChildren: false,
  },
  {
    id: 'users',
    label: 'general.nav.users',
    icon: 'mdi-account-group-outline',
    hasChildren: true,
    children: [
      {
        id: 'users.datatable',
        label: 'general.crud.list',
        route: { name: 'users' },
        hasChildren: false,
      },
      {
        id: 'users.form',
        label: 'general.crud.createNew',
        route: { name: 'users.create' },
        hasChildren: false,
      },
    ],
  },
  {
    id: 'dummy_meetings',
    label: 'general.demo.dummyMeetings',
    icon: 'mdi-account-group-outline',
    hasChildren: true,
    children: [
      {
        id: 'dummy_meetings.datatable',
        label: 'general.crud.list',
        route: { name: 'dummy_meetings' },
        hasChildren: false,
      },
      {
        id: 'dummy_meetings.form',
        label: 'general.crud.createNew',
        route: { name: 'dummy_meetings.create' },
        hasChildren: false,
      },
    ],
  },
  {
    id: 'customers',
    label: 'general.nav.customers',
    icon: 'mdi-account-group-outline',
    hasChildren: true,
    children: [
      {
        id: 'customers.datatable',
        label: 'general.crud.list',
        route: { name: 'customers' },
        hasChildren: false,
      },
      {
        id: 'customers.form',
        label: 'general.crud.createNew',
        route: { name: 'customers.create' },
        hasChildren: false,
      },
    ],
  },
  {
    id: 'dummy_filter_column',
    label: 'general.demo.dummyFilterColumn',
    route: { name: 'dummy_filter_column' },
    icon: 'mdi-account-group-outline',
    hasChildren: false,
  },
  {
    id: 'dummy_import_user',
    label: 'general.demo.dummyImportUser',
    route: { name: 'dummy_import_user' },
    icon: 'mdi-account-group-outline',
    hasChildren: false,
  },
];
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      navLeftMenus,
    };
  },
  computed: {
    drawerOpen: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  created() {},
};
</script>
