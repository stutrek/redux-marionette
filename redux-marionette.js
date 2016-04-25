import middleware from './src/middleware';
import dispatch from './src/dispatch';
import MarionetteComponent from './src/Component';

var vent = {}

function wrapView (MarionetteView, optionsFromProps) {
	class WrappedView extends MarionetteComponent {
		createMarionetteComponent (props) {
			if (optionsFromProps) {
				return new MarionetteView(optionsFromProps(props));
			} else {
				return new MarionetteView();
			}
		}
	}
	return WrappedView;
}

module.exports = {
	marionetteMiddleware: middleware(vent),
	marionetteDispatch: dispatch(vent),
	MarionetteComponent,
	wrapView
};
