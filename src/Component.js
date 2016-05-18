import React from 'react';
import ReactDOM from 'react-dom';

export default class MarionetteComponent extends React.Component {
	shouldComponentUpdate () {
		return false;
	}

	createMarionetteComponent () {
		throw new Error('You must override createMarionetteComponent(props). If you need your component to update from this.props you\'ll also have to override shouldComponentUpdate.');
	}

	componentDidMount () {
		this.marionetteComponent = this.createMarionetteComponent(this.props);
		var reactContainer = ReactDOM.findDOMNode(this);

		this.marionetteComponent.render();

		reactContainer.appendChild(this.marionetteComponent.el);
		this.marionetteComponent.triggerMethod('show');
	}

	componentWillUnmount () {
		if (this.marionetteComponent.close) {
			this.marionetteComponent.close();
		} else if (this.marionetteComponent.destory) {
			this.marionetteComponent.destory()
		}
	}

	componentDidUpdate () {
		this.componentWillUnmount();
		this.componentDidMount();
	}

	render () {
		return <div />
	}

}
