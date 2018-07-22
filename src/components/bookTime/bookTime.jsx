import React, { Component } from 'react';
import { is, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './bookTime.less';
import { Row, Col, Modal, Button } from "antd";
export default class BookTime extends Component{

    static propTypes={
        visible:PropTypes.bool.isRequired,
        changeVisible:PropTypes.func.isRequired
    }

    // css动画组件设置为目标组件
    FirstChild = props => {
        const childrenArray = React.Children.toArray(props.children);
        return childrenArray[0] || null;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps))|| !is(fromJS(this.state),fromJS(nextState))
    }
    render(){
        return(
            <Modal
                visible={this.props.visible}
                title="Title"
                onCancel={this.props.changeVisible}
                footer={null}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        );
    }
}