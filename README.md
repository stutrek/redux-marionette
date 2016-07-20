# Redux-Marionette

This is a simple connection between Marionette and redux made to ease a transition to redux. It could be used to bring elements of the one way data flow to Marionette but the mess you end up with will be yours and yours alone.

It consists of two parts: Views and Components that let you put React in Marionette and vice versa, and model/dispatch based connections to keep your models in sync.

[See it in action](http://stutrek.github.io/redux-marionette/)

[The best way to learn to connect your models may be the tutorial PR](https://github.com/stutrek/redux-marionette/pull/1/files).

## Putting Marionette inside React Components

A Component is provided that can contain a Marionette view. It will start the View when the Component is rendered and destroy it when the Component is unmounted. There is also a convenience function that can take a view and return a component.

### The Convenience Function

This will wrap a view and rerenders it when the values in this.props change.

```javascript
import { wrapView } from 'redux-marionette';

import ViewToWrap from 'somewhere/in/your/old/app';

function convertOptionsToProps (props) {
	return props;
}

const wrappedView = wrapView(ViewToWrap, convertOptionsToProps);
```

_note: it will destroy and recreate the Marionette view, it does not do a simple rerender_

### Using The Component Directly

By using the component directly you can call methods on `this.marionetteComponent` when `this.props` change.

```javascript
import { MarionetteComponent } from 'redux-marionette'

export default class WrappedView extends MarionetteComponent {

	componentWillReceiveProps (newProps) {
		if (newProps.thingy !== this.props.thingy) {
			this.marionetteComponent.toggleThingy();
		}
	}

	createMarionetteComponent (props) {
		var options = {
			// stuff from props
		};
		return new MarionetteView(options);
	}
}
```

## Putting React inside Marionette Views

Doing this requires that the view be connected to your store. Because this would be importing something (your store) from your app I haven't included it in this package. You can find an example [here](https://gist.github.com/stutrek/650be2f8b40a51318a16a6ad9c716eef).


## Connecting Marionette to Redux

Add this to your store:

```javascript
import {marionetteMiddleware, marionetteDispatch} from 'redux-marionette';

export default function configureStore(initialState) {
  const store = compose(
    applyMiddleware(marionetteMiddleware(Backbone, Marionette, _))
  )(createStore)(rootReducer, initialState)
  
  marionetteDispatch(store.dispatch, Backbone, Marionette, _);

  return store
}

```

_note: you have to pass in Backbone, Marionette, and underscore becase we're not going to judge your old architecture._

## Dispatching actions from Marionette

Redux-Marionette binds to the lifecycle of your views, so any model or collection attached to a view will transparently be attached to your reducer and dispatcher then disconnected when the view is removed.

### Directly On The App Object

```javascript
var MyApp = Marionette.Application.extend({
	handleAction: function (action) {
		// act on global actions
	}
});

myApp.dispatch({
	type: 'MY_ACTION',
	meta: {
		foo: 'bar'
	}
});
```
_note: you may also assign `app.handleAction` after your app has been created._

### Connecting Specific Backbone Models or Collections

```javascript
// this will work exactly the same way for Collections
var MyModel = Backbone.Model.extend({

	initialize: function () {
		// if you're overriding initialize, you must do this.
		Backbone.Model.prototype.initialize.call(this);
	},

	// this will be called on every Redux action
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
	
	// this will be called on every event this model triggers
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
