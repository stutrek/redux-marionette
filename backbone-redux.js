var Backbone = window.Backbone;
var Marionette = window.Backbone.Marionette
var _ = window._;

var vent = _.extend({}, Backbone.Events);

const backboneMiddleware = () => {
	return (next) => (action) => {
		vent.trigger('action', action);
		return next(action);
	};
};

var oldViewInitialize = Marionette.ItemView.prototype.initialize;

Marionette.ItemView.prototype.initialize = function () {
	this.listenTo(vent, 'action', function (action) {
		if (this.model && this.model.handleAction) {
			this.reduxActionInProgress = true;
			this.model.handleAction(action);
			this.reduxActionInProgress = false;
		}
		if (this.collection && this.collection.handleAction) {
			this.collection.handleAction(action);
		}
	});

	oldViewInitialize.apply(this, arguments);
};


function backboneDispatch (dispatch) {
	function wrapInitialize(type) {
		var oldInitialize = Backbone[type].prototype.initialize;
		Backbone[type].prototype.initialize = function () {
			console.log('init');
			this.on('all', function (eventType, event) {
				console.log('all!', eventType);
				if (this.reduxActionInProgress) {
					return;
				}
				if (this.createAction) {
					var action = this.createAction(eventType, event);
					if (action) {
						dispatch(action);
					}
				}
			}.bind(this));
			oldInitialize.apply(this, arguments);
		}
	}

	wrapInitialize('Model');
	wrapInitialize('Collection');
}
module.exports = {
	backboneMiddleware: backboneMiddleware,
	backboneDispatch: backboneDispatch
};
