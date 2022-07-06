<template>
  <div class="todo">
    <v-text-field
      v-model="newTask"
      outlined
      class="pa-3"
      label="Add Task"
      append-icon="mdi-plus"
      hide-details
      clearable
      @click:append="addTask"
      @keyup.enter="addTask"
    ></v-text-field>
    <v-card
    class="mx-auto text-center align-self-center"
    max-width="344"
    v-if="this.tasks.length === 0"
    >
    <h1>~ No task todo ~</h1>
    </v-card>
    <v-list
      flat
    >
    <div v-for="task in tasks" :key="task.id">
      <v-list-item @click="doneTask(task.id)" :class="{'blue lighten-5' : task.done}">
        <template v-slot:default="{ active }">
          <v-list-item-action>
            <v-checkbox :input-value="task.done"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title :class="{'text-decoration-line-through' : task.done}">{{task.title}}</v-list-item-title>
          </v-list-item-content>
          <v-btn icon @click.stop="deleteTask(task.id)">
            <v-icon color="primary lighten-1">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item>
      <v-divider></v-divider>
    </div>
    </v-list>
  </div>
</template>

<script>
  export default {
    name: 'Todo',
    data() {
      return {
        tasks: [],
        newTask: ""
      }
    },
    components: {
    },
    methods:{
      doneTask(id){
        let task = this.tasks.filter(task => task.id === id)[0]
        task.done = !task.done;
      },
      deleteTask(id){
        this.tasks = this.tasks.filter(task => task.id !== id)
      },
      addTask(){
        let task = {
          id: Date.now(),
          title: this.newTask,
          done: false
        }
        this.tasks.push(task)
        this.newTask = ''
      }
    }
  }
</script>
