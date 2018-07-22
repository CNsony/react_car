import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { getProData, togSelectPro, editPro } from '@/store/production/action';
import PropTypes from 'prop-types';
import BookTime from '@/components/bookTime/bookTime';
import './productionList.less';
import API from '@/api/api';
import { Carousel, Row, Col, Icon, Tabs, List, Avatar} from "antd"
const TabPane = Tabs.TabPane;


class Production extends Component{
  static propTypes = {
    proData: PropTypes.object.isRequired,
    getProData: PropTypes.func.isRequired,
    togSelectPro: PropTypes.func.isRequired,
    editPro: PropTypes.func.isRequired,
  }

  state={
      itemInfo:{
          imgList:[
              "1",
              "2",
              "3"
          ],
          itemTitle:"title",
          itemDes:"des",
          itemScore:0,
          itemPrice:"30",
          itemPrice_vip:"20",
          imgList_des:[
              "",
              ""
          ],
          itemEvaluate:[
              {
                  eva_name:"1",
                  eva_time:"11/11/2018",
                  eva_ifvip:false,
                  eva_des:"123123123",
                  eva_icon:"",
                  eva_imgList:[
                      "",
                      "",
                      "",
                  ]
              },
              {
                  eva_name:"2",
                  eva_time:"22/22/2018",
                  eva_ifvip:true,
                  eva_des:"123123123",
                  eva_icon:"",
                  eva_imgList:[
                      "",
                      "",
                      "",
                  ]
              }
          ],
          showBook:false,

      }
  }
  
  /**
   * 添加或删减商品，交由redux进行数据处理，作为全局变量
   * @param  {int} index 编辑的商品索引
   * @param  {int} num   添加||删减的商品数量
   */
  handleEdit = (index, num) => {
    let currentNum = this.props.proData.dataList[index].selectNum + num;
    if(currentNum < 0){
      return
    }
    this.props.editPro(index, currentNum);
  }
  
  // 选择商品，交由redux进行数据处理，作为全局变量
  togSelect = index => {
    this.props.togSelectPro(index);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }
  
  componentDidMount(){
    // if(!this.props.proData.dataList.length){
    //   this.props.getProData();
    // }
    // this.initData();
  }
  // 初始化数据
  initData = async () => {
    try{
      let result = await API.getItemInfo(this.props.location.state);
      console.log(result);
      this.setState({itemInfo: result});
    }catch(err){
      console.error(err);
    }
  }
  //回退
  historyBack(){
    this.props.history.goBack()
  }

  //link to book page
    linkToBook(){
      this.props.history.push('/book')
    }
//show book time component
    showBook(){
      this.setState({showBook:true})
    }
    changeVisible(){
      this.setState({
          showBook:!this.state.showBook
      })
    }

  render(){
    return (
      <main className="common-con-top">        
            <div id='proList_part1'>
                <div id='backIcon' onClick={this.historyBack.bind(this)}>
                    <Icon type="left-circle" />
                </div>
                <div>
                    <Carousel autoplay effect='fade' id="proList_imgTop">
                        {
                            this.state.itemInfo.imgList.map((item, index) => {
                            return <div><img src={item} alt=""/></div>
                            })
                        }
                    </Carousel>
                </div>
            </div>
            <div id='proList_part2'>
                <Row>
                    <Col span={16}>{this.state.itemInfo.itemTitle}</Col>
                    <Col span={8} style={{textAlign:"right",color:"red"}}>{this.state.itemInfo.itemScore}</Col>
                </Row>
                <Row>
                    <Col span={24} style={{color:"#dddddd"}}>{this.state.itemInfo.itemDes}</Col>
                </Row>
                <Row>
                    <Col span={8} style={{color:"red"}}>￥{this.state.itemInfo.itemPrice}</Col>
                    <Col span={8} style={{color:"#e8a42e"}}>VIP:￥{this.state.itemInfo.itemPrice_vip}</Col>
                </Row>

            </div>
            <div id='proList_part3'>
                <Row>
                    <Col span={16}>

                    </Col>
                    <Col span={8}>
                        <div className='bookTime_button' onClick={this.showBook.bind(this)}>可预约时间</div>
                    </Col>
                </Row>
            </div>
            <div id='proList_part4'>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="介绍" key="1">
                        <div id='itemInfo'>
                            {
                                this.state.itemInfo.imgList_des.map((item, index) => {
                                return <div><img src={item} alt=""/></div>
                                })
                            }
                        </div>
                    </TabPane>
                    <TabPane tab="评价" key="2">
                        <div id='itemEva'>
                            
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.itemInfo.itemEvaluate}
                                renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                    avatar={<Avatar src={item.eva_icon} size='large' />}
                                    title={item.eva_ifvip?<div><span className='vip_evaname'>{item.eva_name}</span><span className="time">{item.eva_time}</span></div>:<div><span className='evaname'>{item.eva_name}</span><span className="time">{item.eva_time}</span></div>}
                                    description={<div><div className='evades'>{item.eva_des}</div>
                                        {
                                            item.eva_imgList.length ? <Row gutter={32}>
                                                {
                                                    item.eva_imgList.map((item_i, index_i) => {
                                                        return <Col span={8}><img src={item_i}/></Col>
                                                    })
                                                }
                                            </Row>:null
                                        }
                                    </div>}
                                    />

                                </List.Item>
                                )}
                            />

                        </div>
                    </TabPane>
                </Tabs>
            </div>
            <div id='proList_footer' onClick={this.linkToBook.bind(this)}>
                预约   
            </div>
            <BookTime visible={this.state.showBook} changeVisible={this.changeVisible.bind(this)}/>
      </main>
    )
  }
}


export default connect(state => ({
  proData: state.proData,
}), {
  getProData, 
  togSelectPro, 
  editPro
})(Production);