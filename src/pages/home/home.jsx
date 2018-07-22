import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import API from '@/api/api';
import envconfig from '@/envconfig/envconfig';
import { saveFormData, saveImg, clearData } from '@/store/home/action';
import { clearSelected } from '@/store/production/action';
import PublicHeader from '@/components/header/header';
import PublicAlert from '@/components/alert/alert';
import TouchableOpacity from '@/components/TouchableOpacity/TouchableOpacity';
import mixin, { padStr } from '@/utils/mixin';
import './home.less';
import { Layout, Carousel, Row, Col, Input } from "antd"
import { NavLink } from 'react-router-dom';
import PublicFooter from "@/components/footer/footer";


const Search = Input.Search
@mixin({padStr})
class Home extends Component {
  static propTypes = {
    formData: PropTypes.object.isRequired,
    saveFormData: PropTypes.func.isRequired,
    saveImg: PropTypes.func.isRequired,
    clearData: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
  }

  state = {
    alertStatus: false, //弹框状态
    alertTip: '',
    LinkList:[
      {
        link:"",
        name:"汽车美容",
        iconUrl:""
      },
      {
        link:"",
        name:"家政预约",
        imgLink:""
      },
      {
        link:"",
        name:"家政预约",
        imgLink:""
      },
      {
        link:"",
        name:"家政预约",
        imgLink:""
      }
    ],
    dataList:[
      {
        ItemImg:"",
        ItemId:"1",
        ItemName:"car1"
      },
      {
        ItemImg:"",
        ItemId:"2",
        ItemName:"car2"
      }
    ] //弹框提示文字
  }
  /**
   * 已选择的商品数据
   * @type {Array}
   */
  selectedProList = []; 

  /**
   * 将表单数据保存至redux，保留状态
   * @param  {string} type  数据类型 orderSum||name||phoneNo
   * @param  {object} event 事件对象
   */
  handleInput = (type, event) => {
    let value = event.target.value;
    switch(type){
      case 'orderSum':
        value = value.replace(/\D/g, '');
      break;
      case 'name':
      break;
      case 'phoneNo':
        value = this.padStr(value.replace(/\D/g, ''), [3, 7], ' ', event.target);
      break;
      default:;
    }
    this.props.saveFormData(value, type);
  }
  
  /*
  上传图片，并将图片地址存到redux，保留状态
   */
  uploadImg = async event => {
    try{
      let formdata = new FormData();
      formdata.append('file', event.target.files[0]);
      let result = await API.uploadImg({data: formdata});
      this.props.saveImg(envconfig.imgUrl + result.image_path);
      console.log(result);
    }catch(err){
      console.error(err);
    }
  }

  // 提交表单
  sumitForm = () => {
    const {orderSum, name, phoneNo} = this.props.formData;
    let alertTip = '';
    if(!orderSum.toString().length){
      alertTip = '请填写金额';
    }else if(!name.toString().length){
      alertTip = '请填写姓名';
    }else if(!phoneNo.toString().length){
      alertTip = '请填写正确的手机号';
    }else{
      alertTip = '添加数据成功';
      this.props.clearSelected();
      this.props.clearData();
    }
    this.setState({
      alertStatus: true,
      alertTip,
    })
  }
  
  // 关闭弹款
  closeAlert = () => {
    this.setState({
      alertStatus: false,
      alertTip: '',
    })
  }
  
  // 初始化数据，获取已选择的商品
  initData = props => {
    this.selectedProList = [];
    props.proData.dataList.forEach(item => {
      if(item.selectStatus && item.selectNum){
        this.selectedProList.push(item);
      }
    })
  }

  componentWillReceiveProps(nextProps){
    if(!is(fromJS(this.props.proData), fromJS(nextProps.proData))){
      this.initData(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
  }

  componentWillMount(){
    this.initData(this.props);
  }
  

  selectItem=item=>{
    this.props.history.push('/itemList',{itemid:item.ItemId});
  }

  render() {
    
    return (
      <main className="home-container">
        <div>
          <Search placeholder="搜索服务" onSearch={value => console.log(value)} style={{ width: "100%" , position:"fixed",top:0,height:"40px", zIndex :1000,marginTop:'10px',fontSize:'0.5rem',textAlign:'center' }} />
        </div>
        <div>
          <Row>
            <Col>
              <Carousel autoplay effect='fade'>
                <div><h3>1</h3></div>
                <div><h3>2</h3></div>
                <div><h3>3</h3></div>
                <div><h3>4</h3></div>
              </Carousel>
            </Col>
          </Row>
        </div>
        <div id="home_part3">
          <Row>
            {
              this.state.LinkList.map((item, index) => {
                return <Col span='6'><NavLink to={item.link} className="nav-link">{item.name}</NavLink></Col>
              })
            }
            
          </Row>
        </div>
        <div id='home_part4'>
            <Row type='flex' justify='center' id='part4_title'>
              <Col span="16">---精选推荐---</Col>
            </Row>
            <Row gutter={24} id='part4_row'>
              {
                this.state.dataList.map((item, index) => {
                  return <Col span={12}>
                  <div itemID={item.itemID} onClick={this.selectItem.bind(this,item)}>
                    <div className='home_item_img'>
                      <img src={item.ItemImg} alt=""/>
                    </div>
                    <div className='home_item_title'>{item.ItemName}</div>
                  </div>
                    
                  </Col>
                })
              }
            </Row>
        </div>
        {/* <p className="common-title">请录入您的信息</p>
        <form className="home-form">
          <div className="home-form-tiem">
            <span>销售金额：</span>
            <input type="text" placeholder="请输入订单金额" value={this.props.formData.orderSum} onChange={this.handleInput.bind(this, 'orderSum')}/>
          </div>
          <div className="home-form-tiem">
            <span>客户姓名：</span>
            <input type="text" placeholder="请输入客户姓名" value={this.props.formData.name} onChange={this.handleInput.bind(this, 'name')}/>
          </div>
          <div className="home-form-tiem">
            <span>客户电话：</span>
            <input type="text" maxLength="13" placeholder="请输入客户电话" value={this.props.formData.phoneNo} onChange={this.handleInput.bind(this, 'phoneNo')}/>
          </div>
        </form>
        <div>
          <p className="common-title">请选择销售的产品</p>
          <Link to="/production" className="common-select-btn">
            {
              this.selectedProList.length ? <ul className="selected-pro-list">
                {
                  this.selectedProList.map((item, index) => {
                    return <li key={index} className="selected-pro-item ellipsis">{item.product_name}x{item.selectNum}</li>
                  })
                }
              </ul>:'选择产品'
            }
          </Link>
        </div>
        <div className="upload-img-con">
          <p className="common-title">请上传发票凭证</p>
          <div className="file-lable">
            <span className="common-select-btn">上传图片</span>
            <input type="file" onChange={this.uploadImg}/>
          </div>
          <img src={this.props.formData.imgpath} className="select-img" alt=""/>
        </div>
        <TouchableOpacity className="submit-btn" clickCallBack={this.sumitForm} text="提交" />
        <PublicAlert closeAlert={this.closeAlert} alertTip={this.state.alertTip} alertStatus={this.state.alertStatus} /> */}
        <PublicFooter />
      </main>
    );
  }
}

export default connect(state => ({
  formData: state.formData,
  proData: state.proData,
}), {
  saveFormData, 
  saveImg,
  clearData,
  clearSelected,
})(Home);
