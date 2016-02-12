var Backbone = window.Backbone;
var Marionette = window.Backbone.Marionette
var _ = window._;

var vent = _.extend({}, Backbone.Events);

const backboneMiddleware = () => {
	return (next) => (action) => {
		if (vent.reduxDispatchInProgress || vent.reduxActionInProgress) {
			next(action);
			return;
		}
		vent.reduxActionInProgress = true;
		vent.trigger('action', action);
		next(action);
		vent.reduxActionInProgress = false;
	};
};

['ItemView', 'CollectionView', 'CompositeView'].forEach(function (viewType) {
	var oldViewInitialize = Marionette[viewType].prototype.initialize;
	Marionette[viewType].prototype.initialize = function () {
		this.listenTo(vent, 'action', function (action) {
			if (this.model && this.model.handleAction && this.model.__lastAction !== action) {
				this.model.handleAction(action);
				this.model.__lastAction = action;
			}
			if (this.collection && this.collection.handleAction && this.collection.__lastAction !== action) {
				this.collection.handleAction(action);
				this.collection.__lastAction = action;
			}
		});

		oldViewInitialize.apply(this, arguments);
	};
});


function backboneDispatch (dispatch) {
	function wrapInitialize(type) {
		var oldInitialize = Backbone[type].prototype.initialize;
		Backbone[type].prototype.initialize = function () {
			this.on('all', function (eventType, event) {
				if (vent.reduxDispatchInProgress || vent.reduxActionInProgress) {
					return;
				}
				if (this.createAction) {
					var action = this.createAction(eventType, event);
					if (action) {
						vent.reduxDispatchInProgress = true;
						dispatch(action);
						vent.reduxDispatchInProgress = false;
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
