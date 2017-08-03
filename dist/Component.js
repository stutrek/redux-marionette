'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MarionetteComponent = function (_React$Component) {
	_inherits(MarionetteComponent, _React$Component);

	function MarionetteComponent() {
		_classCallCheck(this, MarionetteComponent);

		return _possibleConstructorReturn(this, (MarionetteComponent.__proto__ || Object.getPrototypeOf(MarionetteComponent)).apply(this, arguments));
	}

	_createClass(MarionetteComponent, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate() {
			return false;
		}
	}, {
		key: 'createMarionetteComponent',
		value: function createMarionetteComponent() {
			throw new Error('You must override createMarionetteComponent(props). If you need your component to update from this.props you\'ll also have to override shouldComponentUpdate.');
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.marionetteComponent = this.createMarionetteComponent(this.props);
			var reactContainer = _reactDom2.default.findDOMNode(this);

			this.marionetteComponent.render();

			reactContainer.appendChild(this.marionetteComponent.el);
			this.marionetteComponent.triggerMethod('show');
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.marionetteComponent.close) {
				this.marionetteComponent.close();
			} else if (this.marionetteComponent.destroy) {
				this.marionetteComponent.destroy();
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			this.componentWillUnmount();
			this.componentDidMount();
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement('div', null);
		}
	}]);

	return MarionetteComponent;
}(_react2.default.Component);

exports.default = MarionetteComponent;
//# sourceMappingURL=Component.js.map