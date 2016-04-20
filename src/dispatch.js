module.exports = function (vent) {
	return function marionetteDispatch (dispatch, Backbone, Marionette, _) {
		vent = vent.trigger ? vent : _.extend(vent, Backbone.Events);

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

		Marionette.Application.prototype.dispatch = function (action) {
			vent.reduxDispatchInProgress = true;
			dispatch(action);
			vent.reduxDispatchInProgress = false;
		};

		wrapInitialize('Model');
		wrapInitialize('Collection');
	};
}
