import { compose, createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'

export default function configureStore(initialState) {
  const store = compose(
  )(createStore)(rootReducer, initialState)

  return store
}
