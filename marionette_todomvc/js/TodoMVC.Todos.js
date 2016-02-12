/*global Backbone, TodoMVC:true */

var TodoMVC = TodoMVC || {};

(function () {
	'use strict';

	// Todo Model
	// ----------
	TodoMVC.Todo = Backbone.Model.extend({
		defaults: {
			text: '',
			completed: false,
			id: 0
		},

		initialize: function () {
			Backbone.Model.prototype.initialize.call(this);
		},

		handleAction: function (action) {
			if (action.id !== this.id) {
				return;
			}

			switch (action.type) {
				case 'EDIT_TODO':
					this.set('text', action.text);
					return;

				case 'COMPLETE_TODO':
					this.set('completed', !this.get('completed'));
					return;

				case 'DELETE_TODO':
					this.destroy();
			}
		},

		createAction: function (eventName) {
			var action = this.toJSON();
			switch (eventName) {
				case 'change:text':
					action.type = 'EDIT_TODO';
					return action;

				case 'change:completed':
					action.type = 'COMPLETE_TODO'
					return action;
			}

			return;
		},

		toggle: function () {
			return this.set('completed', !this.isCompleted());
		},

		isCompleted: function () {
			return this.get('completed');
		},

		matchesFilter: function (filter) {
			if (filter === 'all') {
				return true;
			}

			if (filter === 'active') {
				return !this.isCompleted();
			}

			return this.isCompleted();
		}
	});

	// Todo Collection
	// ---------------
	TodoMVC.TodoList = Backbone.Collection.extend({
		model: TodoMVC.Todo,

		localStorage: new Backbone.LocalStorage('todos-backbone-marionette'),

		comparator: 'created',

		handleAction: function (action) {
			switch (action.type) {
				case 'ADD_TODO':
					var id = action.id;
					if (!id) {
						var ids = this.pluck('id');
						ids.push(0);
						id = Math.max.apply(null, ids) + 1;
					}
					this.create({
						text: action.text,
						completed: action.completed,
						id: id
					});
					break;

				case 'CLEAR_COMPLETED':
					var completed = this.getCompleted();
					completed.forEach(function (todo) {
						todo.destroy();
					});

			}
		},

		createAction: function (eventName, model) {
			switch (eventName) {
				case 'add':
					return {
						type: 'ADD_TODO',
						text: model.get('text'),
						id: model.get('id'),
						completed: model.get('completed')
					};

				case 'remove':
					return {
						type: 'DELETE_TODO',
						id: model.get('id')
					};
			}
		},

		getCompleted: function () {
			return this.filter(this._isCompleted);
		},

		getActive: function () {
			return this.reject(this._isCompleted);
		},

		_isCompleted: function (todo) {
			return todo.isCompleted();
		}
	});
})();
