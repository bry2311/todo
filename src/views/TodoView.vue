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
      @click:append="$store.dispatch('addTask',{'newTask':newTask});clearField()"
      @keyup.enter="$store.dispatch('addTask',{'newTask':newTask});clearField()"
    ></v-text-field>
    <v-card
    class="mx-auto text-center align-self-center"
    max-width="344"
    v-if="$store.state.tasks.length === 0"
    >
    <h1>~ No task todo ~</h1>
    </v-card>
    <v-list
      flat
    >
    <div v-for="task in $store.state.tasks" :key="task.id">
      <v-list-item @click="$store.dispatch('doneTask',{'id':task.id,'done': task.done})" :class="{'blue lighten-5' : task.done}">
        <template v-slot:default="{ active }">
          <v-list-item-action>
            <v-checkbox :input-value="task.done"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title :class="{'text-decoration-line-through' : task.done}">{{task.task}}</v-list-item-title>
          </v-list-item-content>
          <v-btn icon @click.stop="$store.dispatch('deleteTask',{'id':task.id})">
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
        newTask: ""
      }
    },
    components: {
    },
    methods:{
      clearField(){
        this.newTask = ""
      }
    },
    mounted(){
      this.$store.dispatch('loadTask');
    }
  }
</script>
