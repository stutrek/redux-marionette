module.exports = function (vent) {
	return function marionetteMiddleware (Backbone, Marionette, _) {
		vent = vent.trigger ? vent : _.extend(vent, Backbone.Events);

		['ItemView', 'CollectionView', 'CompositeView', 'Layout', 'LayoutView'].forEach(function (viewType) {
			if (!Marionette[viewType]) {
				// the name Layout was changed to LayoutView
				return;
			}
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

		var oldAppStart = Marionette.Application.prototype.start;
		Marionette.Application.prototype.start = function () {
			this.listenTo(vent, 'action', function (action) {
				if (this.handleAction && this.__lastAction !== action) {
					this.handleAction(action);
					this.__lastAction = action;
				}
			});

			oldAppStart.apply(this, arguments);
		};

		return function () {
			return function (next) {
				return function (action) {
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
		}
	};
}
