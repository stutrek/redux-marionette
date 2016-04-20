import middleware from './src/middleware';
import dispatch from './src/dispatch';
import MarionetteComponent from './src/Component';

var vent = {}

module.exports = {
	marionetteMiddleware: middleware(vent),
	marionetteDispatch: dispatch(vent),
	MarionetteComponent: MarionetteComponent
};
