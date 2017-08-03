'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _middleware = require('./src/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _dispatch = require('./src/dispatch');

var _dispatch2 = _interopRequireDefault(_dispatch);

var _Component = require('./src/Component');

var _Component2 = _interopRequireDefault(_Component);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var vent = {};

function wrapView(MarionetteView, optionsFromProps) {
	var WrappedView = function (_MarionetteComponent) {
		_inherits(WrappedView, _MarionetteComponent);

		function WrappedView() {
			_classCallCheck(this, WrappedView);

			return _possibleConstructorReturn(this, (WrappedView.__proto__ || Object.getPrototypeOf(WrappedView)).apply(this, arguments));
		}

		_createClass(WrappedView, [{
			key: 'shouldComponentUpdate',
			value: function shouldComponentUpdate(newProps) {
				if (optionsFromProps) {
					var newOptions = optionsFromProps(newProps);
					if (!_underscore2.default.isEqual(this.marionetteComponent.options, newOptions)) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		}, {
			key: 'createMarionetteComponent',
			value: function createMarionetteComponent(props) {
				if (optionsFromProps) {
					return new MarionetteView(optionsFromProps(props));
				} else {
					return new MarionetteView();
				}
			}
		}]);

		return WrappedView;
	}(_Component2.default);

	return WrappedView;
}

module.exports = {
	marionetteMiddleware: (0, _middleware2.default)(vent),
	marionetteDispatch: (0, _dispatch2.default)(vent),
	MarionetteComponent: _Component2.default,
	wrapView: wrapView
};
//# sourceMappingURL=redux-marionette.js.map