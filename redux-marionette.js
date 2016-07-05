import middleware from './src/middleware';
import dispatch from './src/dispatch';
import MarionetteComponent from './src/Component';
import _ from 'underscore';

var vent = {}

function wrapView (MarionetteView, optionsFromProps) {

	class WrappedView extends MarionetteComponent {

		shouldComponentUpdate (newProps) {
			if (optionsFromProps) {
				var newOptions = optionsFromProps(newProps);
				if (!_.isEqual(this.marionetteComponent.options, newOptions)) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

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
