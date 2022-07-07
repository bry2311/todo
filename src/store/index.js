import Vue from 'vue'
import Vuex from 'vuex'
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore' 
import { db } from '@/config/config'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: [],
  },
  getters: {
  },
  mutations: {
    doneTask(state,payload){
      let task = state.tasks.filter(task => task.id === payload.id)[0]
      task.done = !task.done;
    },
    deleteTask(state,payload){
      state.tasks = state.tasks.filter(task => task.id !== payload.id)
    },
    addTask(state,payload){
      let task = {
        id: Date.now(),
        task: payload.newTask,
        done: false
      }
      state.tasks.push(task)
    },
    updateTasks(state,payload){
      state.tasks = payload.tmpTodos
    }
  },
  actions: {
    async addTask(context,payload){
      await addDoc(collection(db, "todos"), {
        task: payload.newTask,
        done: false,
        date: Date.now(),
        dueDate : null
      });
    },
    loadTask(){
      // const querySnapshot = await getDocs(collection(db, "todos"))
      // let tmpTodos = []
      // querySnapshot.forEach((doc) => {
      //   const todo = {
      //     id: doc.id,
      //     task: doc.data().task,
      //     done: doc.data().done
      //   }
      //   tmpTodos.push(todo)
      // })
      // this.commit('updateTasks',{tmpTodos})

      const que = query(collection(db, "todos"),orderBy('date','desc'));
      onSnapshot(que, (querySnapshot) => {
        let tmpTodos = []
        querySnapshot.forEach((doc) => {
          const todo = {
            id: doc.id,
            task: doc.data().task,
            done: doc.data().done,
            dueDate: doc.data().dueDate
          }
          tmpTodos.push(todo)
        })
        this.commit('updateTasks',{tmpTodos})
      })
    },
    async deleteTask(context, payload){
      await deleteDoc(doc(db, "todos", payload.id));
    },
    async doneTask(context,payload){
      await updateDoc(doc(db, "todos", payload.id), {
        done: !payload.done
      });
    },
    async updateTask(context,payload){
      await updateDoc(doc(db, "todos", payload.id), {
        task: payload.task
      });
    },
    async updateTaskDueDate(context,payload){
      await updateDoc(doc(db, "todos", payload.id), {
        dueDate: payload.dueDate
      });
    },
  },
  modules: {
  }
})
