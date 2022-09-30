<template>
  <div>
    <v-app-bar>
      laravel vue学習
    </v-app-bar>
    <v-data-table :headers="headers" :items="todos" sort-by="calories" class="elevation-1 ma-10">
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> 追加 </v-btn>
            </template>
  
            <v-card>
              <v-card-title>
                <span class="text-h6">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.name" label="タスク名"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-autocomplete v-model="editedItem.priority" :items="priority" label="優先度"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="editedItem.status"
                        :items="status"
                        label="ステータス"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-menu
                        v-model="isStartDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.startDate"
                            label="開始日"
                            hint="YYYY/MM/DD format"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.startDate" no-title @input="isStartDate = false"></v-date-picker>
                      </v-menu>
                    </v-col>
  
  
                    <v-col cols="12" md="6">
                      <v-menu
                        v-model="isDeadline"
                        :close-on-content-click="false"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.deadline"
                            label="期限日"
                            hint="YYYY/MM/DD format"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.deadline" no-title @input="isDeadline = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">キャンセル</v-btn>
                <v-btn color="blue darken-1" text @click="save">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h6 justify-center">本当に削除してもよろしいですか？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">キャンセル</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">削除</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  data: () => ({
    editName: '',
    deleteName: '',
    status: [
      '未対応',
      '対応中',
      '対応済み',
      '完了'
    ],
    priority: ['A', 'B', 'C', 'D'],
    isStartDate: false,
    isDeadline: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'タスク名', value: 'name' },
      { text: '開始日', value: 'startDate' },
      { text: '期限日', value: 'deadline' },
      { text: '優先度', value: 'priority' },
      { text: 'ステータス', value: 'status' },
      { text: '操作', value: 'actions' },
    ],
    todos: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      startDate: '',
      deadline: '',
      priority: '',
      status: '',
    },
    defaultItem: {
      name: '',
      startDate: '',
      deadline: '',
      priority: '',
      status: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '追加' : '編集';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    Vue.axios.get('/api/todo/list')
    .then( response => {
      response.data.map( item => {
        let todo = {
          id: item.id,
          name: item.name,
          startDate: item.startDate,
          deadline: item.deadline,
          priority: item.priority,
          status: item.status
        }
        this.todos.push(todo)
      })
    });
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.todos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.editName = this.todos[this.editedIndex].name;
    },

    deleteItem(item) {
      this.editedIndex = this.todos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
      this.deleteName = this.todos[this.editedIndex].name;
    },

    deleteItemConfirm() {
      this.todos.splice(this.editedIndex, 1);
      Vue.axios.post('/api/todo/delete', {
        name: this.deleteName
      });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.todos[this.editedIndex], this.editedItem);
        Vue.axios.post('/api/todo/update', {
          editName: this.editName,
          id: this.editedItem.id,
          name: this.editedItem.name,
          startDate: this.editedItem.startDate,
          deadline: this.editedItem.deadline,
          priority: this.editedItem.priority,
          status: this.editedItem.status
        })
      } else {
        this.todos.push(this.editedItem);
        Vue.axios.post('/api/todo/store', {
          id: this.editedItem.id,
          name: this.editedItem.name,
          startDate: this.editedItem.startDate,
          deadline: this.editedItem.deadline,
          priority: this.editedItem.priority,
          status: this.editedItem.status
        })
      }
      this.close();
    },
  },
};
</script>

<style>
</style>