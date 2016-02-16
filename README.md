# Redux-Marionette

This is a simple connection between Marionette and redux. It's designed to ease a transition to redux, but could be used to bring elements of the one way data flow to Marionette, but the mess you end up with will be yours and yours alone.

To use it add `model.handleAction` and `model.createAction` to the models (and collections) that you want integrated into redux and add the Backbone Middleware and Dispatch to redux.

[See it in action](http://stutrek.github.io/redux-marionette/)

## Usage

[The best way to learn may be the tutorial PR](https://github.com/stutrek/redux-marionette/pull/1/files).

### In Your Redux

Add this to your dispatch:

```javascript
import {marionetteDispatch} from 'marionette-redux';

function mapDispatchToProps(dispatch) {
  marionetteDispatch(dispatch, window.Backbone, window._);
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

```

Add this to your store creator:

```javascript
import {marionetteMiddleware} from 'marionette-redux';

export default function configureStore(initialState) {
  const store = compose(
    applyMiddleware(marionetteMiddleware(window.Backbone, window.Backbone.Marionette, window._))
  )(createStore)(rootReducer, initialState)

  return store
}

```

_note: you have to pass in Backbone, Marionette, and underscore becase we're not going to judge your old architecture._

### In Your Backbone

Redux-Marionette binds to the lifecycle of your views, so any model or collection attached to a view will transparently be attached to your reducer and dispatcher then disconnected when the view is removed.

```javascript
// this will work exactly the same way for MrCollection
var MrModel = Backbone.Model.extend({

	initialize: function () {
		// if you're overriding initialize, you must do this.
		Backbone.Model.prototype.initialize.call(this);
	},

	handleAction: function (action) {
		if (action.id !== this.id) {
			return;
		}

		switch (action.type) {
			case 'VALUE_CHANGE':
				this.set('value', action.value);
				return;
		}
	},

	createAction: function (eventName) {
		var action = this.toJSON();
		switch (eventName) {
			case 'change:value':
				action.type = 'VALUE_CHANGE';
				return action;
		}

		return;
	},
});
```
