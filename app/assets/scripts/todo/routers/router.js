/*global Backbone */
import todos from 'todo/collections/todos';

// Todo Router
// ----------
var TodoFilter = '';
var TodoRouter = Backbone.Router.extend({
  routes: {
    '*filter': 'setFilter'
  },

  setFilter: function (param) {
    // Set the current filter to be used
    var TodoFilter = param || '';

    // Trigger a collection filter event, causing hiding/unhiding
    // of Todo view items
    todos.trigger('filter');
  }
});

var todoRouter = new TodoRouter();
Backbone.history.start();

export { TodoRouter, TodoFilter };
