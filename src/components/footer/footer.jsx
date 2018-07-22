import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './footer.less';
import { Layout, Row, Col, Icon } from "antd";
const { Footer } = Layout
export default class PublicFooter extends Component{
  
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
      <Footer className='footer'>
            <Row>
                <Col span={2}></Col>
                <Col span={4}><Layout><Icon type='home' /><div>首页</div></Layout></Col>
                <Col span={4}></Col>
                <Col span={4}><Layout><Icon type="schedule" /><div>订单</div></Layout></Col>
                <Col span={4}></Col>
                <Col span={4}><Layout><Icon type='user' /><div>我的</div></Layout></Col>
                <Col span={2}></Col>
            </Row>
      </Footer>
    );
  }
}