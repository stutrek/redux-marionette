import { compose, createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'

import {marionetteMiddleware, marionetteDispatch} from '../../marionette-redux.js';

export default function configureStore(initialState) {
  const store = compose(
    applyMiddleware(marionetteMiddleware(window.Backbone, window.Backbone.Marionette, window._))
  )(createStore)(rootReducer, initialState)

  marionetteDispatch(store.dispatch, window.Backbone, window._);

  return store
}
