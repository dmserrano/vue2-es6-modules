'use strict';

import { taskListComp } from './components/taskList.js';
import { taskComp } from './components/task.js';
import { errorAlertComp } from './components/erroralert.js';
import { taskDisplayModalComp } from './components/modal.js';
import { homeInlineTemp } from './components/inlineTemp.js';
import { counterComp } from './components/counter.js';

const store = new Vuex.Store({
  // global data
  state: {
    count: 0,
    taskList: [
      { task: 'Groceries', desc: 'Need milk and eggs', completed: false },
      { task: 'Bank', desc: 'Need checks', completed: false },
      { task: 'Oil Change', desc: '6:30 Friday 2/24', completed: false },
      { task: 'Pay Bills', desc: 'Electric and Water due', completed: false },
    ],
    completedTaskList: [],
    people: [
      { name: 'Marisa', age: 26 },
      { name: 'Thomas', age: 24 },
      { name: 'Lauren', age: 17 },
    ]

  },

  // global getter functions, great for filters
  getters: {
    // getTaskList: (state) => state.taskList,
    // getCompletedTaskList: (state) => state.completedTaskList,
    getPeopleNameList: (state) => state.people.map(({ name }) => name).join(', '),
    getAdults: (state) => state.people.filter(({ age }) => age >= 18),
  },

  // mutations enable us to better log our changes of state
  // they are synchronous in nature, so they shouldn't be called directly in some cases
  mutations: {
    increment (state) {
      state.count++
    },

    addNewPerson(state, person) {
      state.people.push(person);
    },

    completeTask(state, task) {
      state.taskList.splice(state.taskList.indexOf(task), 1);
      state.completedTaskList.push(task);
    },
  },
  // actions dispatch mutations, and can handle async tasks
  actions: {

  }
});


// Creating root event hub for components
const EventMain = new Vue();
// Adding eventhub as a global mixin, e.g. available to all components
Vue.mixin({
  data() {
    return {
      EventMain: EventMain
    }
  }
});

new Vue({
  el: '#root',

  store,

  data: {
    message: 'I am Groot',
    newName: null,
    newAge: null,
    nameError: false,
    ageError: false,
    newNamePlaceholder: 'Enter a name to add',
    addingName: false,
  },

  created() {

    // Complete a task when a done button is clicked. Received from task comp
    this.EventMain.$on('completed', (task) => this.taskCompleted(task));

  },

  components: {
    'task-list': taskListComp,
    'task': taskComp,
    'error-alert': errorAlertComp,
    'msg-modal': taskDisplayModalComp,
    'home-inline-template': homeInlineTemp,
    'counter': counterComp
  },

  methods: {

    validateNewPerson() {
      if (!this.newName) {
        this.nameError = true;
      } else {
        this.nameError = false;
      }

      if (!this.newAge) {
        this.ageError = true;
      } else {
        this.ageError = false;
      }

      if (this.ageError || this.nameError) {
        return;
      }

      this.addNewPerson();
    },

    addNewPerson() {
      // Playing around with dynamically toggling a button disable
      this.addingName = true;
      setTimeout(() => {
        this.addingName = false
        this.$store.commit({ type: 'addNewPerson', name: this.newName, age: this.newAge });
        this.newName = null;
        this.newAge = null;
      }, 1000);
    },

  }

});
