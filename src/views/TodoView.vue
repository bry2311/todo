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
              <v-list-item-subtitle v-if="task.dueDate !== null" v-text="formatDate(task.dueDate)"></v-list-item-subtitle>
          </v-list-item-content>
          <!-- <v-btn icon @click.stop="$store.dispatch('deleteTask',{'id':task.id})">
            <v-icon class="mx-1" :color="item.iconColor">mdi-{{ item.icon }}</v-icon>
          </v-btn> -->
         

          <v-menu
            bottom
            origin="center center"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">          
              <v-icon 
                color="grey" 
                v-bind="attrs"
                v-on="on">
                mdi-dots-vertical
              </v-icon>
            </template>

            <v-list>
              <v-list-item key="1" @click.stop="showDialog(task.id,task.task)">
                <v-icon class="mx-1" color="primary">mdi-square-edit-outline</v-icon>
                <v-list-item-title class="mx-1">Edit</v-list-item-title>
              </v-list-item>
              <v-list-item key="2" @click.stop="openCalendar(task.id)">
                <v-icon class="mx-1" color="primary">mdi-calendar-clock</v-icon>
                <v-list-item-title class="mx-1">Due Date</v-list-item-title>
              </v-list-item>
              <v-list-item key="3" @click.stop="$store.dispatch('deleteTask',{'id':task.id})">
                <v-icon class="mx-1" color="red lighten-1">mdi-delete</v-icon>
                <v-list-item-title class="mx-1">Delete</v-list-item-title>
              </v-list-item>
              <!-- <v-list-item key="4" @click.stop="showSnackbar">
                <v-icon class="mx-1" color="grey">mdi-menu</v-icon>
                <v-list-item-title class="mx-1">Sort</v-list-item-title>
              </v-list-item> -->
            </v-list>
          </v-menu>
        </template>
      </v-list-item>
      <v-divider></v-divider>
    </div>
    </v-list>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      shaped
      color="primary"
    >
      {{ text }}
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      max-width="350"
    >
      <v-card>
        <v-card-title class="text-h5">
          Edit Task
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model:value="selectedTask" 
                  @keyup.enter="updateTask"
                  autofocus></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="black darken-1"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary darken-1"
            text
            @click="updateTask"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showCalendar"
      max-width="290"
    >
      <v-card>
          <v-date-picker v-model="picker"></v-date-picker>
          <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="black darken-1"
            text
            @click="showCalendar = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary darken-1"
            text
            @click="updateTaskDueDate"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'Todo',
    data() {
      return {
        newTask: "",
        snackbar: false,
        text: 'New Task coming up!',
        timeout: 2000,
        items: [
          { title: 'Edit', icon:"square-edit-outline", iconColor: "primary", fun: 'showSnackbar' },
          { title: 'Due Date', icon:"calendar-clock", iconColor: "primary", fun: "showCalendar" },
          { title: 'Delete', icon:"delete", iconColor: "red", fun: "showSnackbar()" },
          { title: 'Sort', icon:"menu", iconColor: "grey", fun: "showSnackbar()" },
        ],
        dialog: false,
        selectedTask: '',
        selectedId: '',
        picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        showCalendar: false
      }
    },
    components: {
    },
    methods:{
      clearField(){
        this.newTask = "",
        this.snackbar = true
      },
      showSnackbar(){
        this.snackbar = true
      },
      showDialog(id,name){
        this.dialog = true,
        this.selectedTask = name,
        this.selectedId = id
      },
      updateTask(){
        this.dialog = false,
        this.$store.dispatch('updateTask',{
          id: this.selectedId,
          task: this.selectedTask
        })
        this.text = "Task updated!"
        this.snackbar = true
      },
      openCalendar(id){
        this.showCalendar = true,
        this.selectedId = id
      },
      closeCalendar(){
        this.showCalendar = false
      },
      updateTaskDueDate(){
        this.dialog = false,
        this.$store.dispatch('updateTaskDueDate',{
          id: this.selectedId,
          dueDate: this.picker
        })
        this.text = "Due date updated!"
        this.snackbar = true
      },
      formatDate(date){
        if (date) {
          return moment(String(date)).format('dddd DD-MM-YYYY')
        }
      }
    },
    mounted(){
      this.$store.dispatch('loadTask');
    }
  }
</script>
