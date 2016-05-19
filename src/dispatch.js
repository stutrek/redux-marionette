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
							if (action.type.substr(0, 8) === '@@router') {
								dispatch(action);
							} else {
								vent.reduxDispatchInProgress = action;
								dispatch(action);
								vent.reduxDispatchInProgress = false;
							}
						}
					}
				}.bind(this));
				oldInitialize.apply(this, arguments);
			}
		}

		Marionette.Application.prototype.dispatch = function (action) {
			if (action.type.substr(0, 8) === '@@router') {
				dispatch(action);
			} else {
				vent.reduxDispatchInProgress = action;
				dispatch(action);
				vent.reduxDispatchInProgress = false;
			}
		};

		wrapInitialize('Model');
		wrapInitialize('Collection');
	};
}
