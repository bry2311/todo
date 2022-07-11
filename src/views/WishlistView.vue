<template>
  <div class="todo">
    <v-text-field
      v-model="newWishlist"
      outlined
      class="pa-3"
      label="Add Wishlist"
      append-icon="mdi-plus"
      hide-details
      clearable
      @click:append="$store.dispatch('addWishlist',{'newWishlist':newWishlist});clearField()"
      @keyup.enter="$store.dispatch('addWishlist',{'newWishlist':newWishlist});clearField()"
    ></v-text-field>
    <v-card
    class="mx-auto text-center align-self-center"
    max-width="344"
    v-if="$store.state.addWishlist"
    >
    <h1>~ You got all of your dream ~</h1>
    </v-card>
    <v-list
      flat
    >
    <div v-for="wish in $store.state.wishlist" :key="wish.id">
      <v-list-item @click="$store.dispatch('doneWishlist',{'id':wish.id,'done': wish.done})" :class="{'blue lighten-5' : wish.done}">
        <template v-slot:default="{ active }">
          <v-list-item-action>
            <v-checkbox :input-value="wish.done"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
              <v-list-item-title :class="{'text-decoration-line-through' : wish.done}">{{wish.wish}}</v-list-item-title>
              <v-list-item-subtitle v-if="wish.dueDate !== null" v-text="formatDate(wish.dueDate)"></v-list-item-subtitle>
          </v-list-item-content>
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
              <v-list-item key="1" @click.stop="showDialog(wish.id,wish.wish)">
                <v-icon class="mx-1" color="primary">mdi-square-edit-outline</v-icon>
                <v-list-item-title class="mx-1">Edit</v-list-item-title>
              </v-list-item>
              <v-list-item key="2" @click.stop="openCalendar(wish.id)">
                <v-icon class="mx-1" color="primary">mdi-calendar-clock</v-icon>
                <v-list-item-title class="mx-1">Due Date</v-list-item-title>
              </v-list-item>
              <v-list-item key="3" @click.stop="$store.dispatch('deleteWishlist',{'id':wish.id})">
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
          Edit Wish
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model:value="selectedWish" 
                  @keyup.enter="updateWish"
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
            @click="updateWish"
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
            @click="updateWishDueDate"
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
    name: 'Wishlist',
    data() {
      return {
        newWishlist: "",
        snackbar: false,
        text: 'New Wishlist was added! :)',
        timeout: 2000,
        dialog: false,
        selectedWish: '',
        selectedId: '',
        picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        showCalendar: false
      }
    },
    components: {
    },
    methods:{
      clearField(){
        this.newWishlist = "",
        this.snackbar = true
      },
      showSnackbar(){
        this.snackbar = true
      },
      showDialog(id,name){
        this.dialog = true,
        this.selectedWish = name,
        this.selectedId = id
      },
      updateWish(){
        this.dialog = false,
        this.$store.dispatch('updateWishlist',{
          id: this.selectedId,
          wish: this.selectedWish
        })
        this.text = "Wish updated!"
        this.snackbar = true
      },
      openCalendar(id){
        this.showCalendar = true,
        this.selectedId = id
      },
      closeCalendar(){
        this.showCalendar = false
      },
      updateWishDueDate(){
        this.dialog = false,
        this.$store.dispatch('updateWishDueDate',{
          id: this.selectedId,
          dueDate: this.picker
        })
        this.text = "Due date updated!"
        this.snackbar = true
      },
      formatDate(date){
        if (date) {
          return moment(String(date)).format('dddd, DD - MM - YYYY')
        }
      }
    },
    mounted(){
      this.$store.dispatch('loadWishlist');
    }
  }
</script>
