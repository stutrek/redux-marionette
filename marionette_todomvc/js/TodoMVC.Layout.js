/*global TodoMVC:true, Backbone */

var TodoMVC = TodoMVC || {};

(function () {
	'use strict';

	var filterChannel = Backbone.Radio.channel('filter');

	TodoMVC.RootLayout = Backbone.Marionette.LayoutView.extend({

		el: '#todoapp',

		regions: {
			header: '#header',
			main: '#main',
			footer: '#footer'
		}
	});

	// Layout Header View
	// ------------------
	TodoMVC.HeaderLayout = Backbone.Marionette.ItemView.extend({

		template: '#template-header',

		// UI bindings create cached attributes that
		// point to jQuery selected objects
		ui: {
			input: '#new-todo'
		},

		events: {
			'keypress @ui.input': 'onInputKeypress',
			'keyup @ui.input': 'onInputKeyup'
		},

		// According to the spec
		// If escape is pressed during the edit, the edit state should be left and any changes be discarded.
		onInputKeyup: function (e) {
			var ESC_KEY = 27;

			if (e.which === ESC_KEY) {
				this.render();
			}
		},

		onInputKeypress: function (e) {
			var ENTER_KEY = 13;
			var todoText = this.ui.input.val().trim();

			if (e.which === ENTER_KEY && todoText) {
				var ids = this.collection.pluck('id');
				ids.push(0);
				var maxId = Math.max.apply(null, ids);
				this.collection.create({
					text: todoText,
					id: maxId + 1
				});
				this.ui.input.val('');
			}
		}
	});

	// Layout Footer View
	// ------------------
	TodoMVC.FooterLayout = Backbone.Marionette.ItemView.extend({
		template: '#template-footer',

		// UI bindings create cached attributes that
		// point to jQuery selected objects
		ui: {
			filters: '#filters a',
			completed: '.completed a',
			active: '.active a',
			all: '.all a',
			summary: '#todo-count',
			clear: '#clear-completed'
		},

		events: {
			'click @ui.clear': 'onClearClick'
		},

		collectionEvents: {
			all: 'render'
		},

		templateHelpers: {
			activeCountLabel: function () {
				return (this.activeCount === 1 ? 'item' : 'items') + ' left';
			}
		},

		initialize: function () {
			this.listenTo(filterChannel.request('filterState'), 'change:filter', this.updateFilterSelection, this);
		},

		serializeData: function () {
			var active = this.collection.getActive().length;
			var total = this.collection.length;

			return {
				activeCount: active,
				totalCount: total,
				completedCount: total - active
			};
		},

		onRender: function () {
			this.$el.parent().toggle(this.collection.length > 0);
			this.updateFilterSelection();
		},

		updateFilterSelection: function () {
			this.ui.filters.removeClass('selected');
			this.ui[filterChannel.request('filterState').get('filter')]
			.addClass('selected');
		},

		onClearClick: function () {
			var completed = this.collection.getCompleted();
			completed.forEach(function (todo) {
				todo.destroy();
			});
		}
	});
})();
