import React, {Component} from 'react'
import {
 Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  ProgressBarAndroid,
  Linking,
  Dimensions
} from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
var {height, width} = Dimensions.get('window');  //获取屏幕宽高
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome'
import colorManager from '../common/styles/manager';
import ActivitiesList from './ActivitiesList.js'
import ScrollableTabView from 'react-native-scrollable-tab-view';
var firstFlag=0;
var _this;
var isLoaderFun;


class SendView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openView:false
    }
  }
  sendActivity(){
    this.setState({openView:false});
    this.props.nav.push({
      id: 'SendActivity',
      reloadList:_this.reloadList.bind(_this),
      type:0
    })
  }
  sendAnnouncement(){
    this.setState({openView:false});
    this.props.nav.push({
      id: 'SendActivity',
      reloadList:_this.reloadList.bind(_this),
      type:1
    })
  }
  sendVote(){
    this.setState({openView:false})
    this.props.nav.push({
      id: 'SendVote',
      reloadList:_this.reloadList.bind(_this)
    })
  }
  open(){
    this.setState({openView:!this.state.openView})
  }
  render() {
    return (
      this.state.openView?
        <View style={styles.openViewView}>
          <TouchableOpacity style={styles.openViewTou} onPress={()=>{this.setState({openView:false})}} >
            <View style={styles.openUpView}>
              <View style={styles.openViewsView}>
              <View>
                <TouchableOpacity onPress={this.sendActivity.bind(this)}>
                  <View style={styles.modalTextView}>
                    <Icons
                      name="pencil"
                      size={15}
                      color="#175898"
                      style={{marginLeft:5}}
                      />
                    <Text style={styles.modalText}>发 分 享</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.sendVote.bind(this)}>
                  <View style={styles.modalTextView}>
                    <Icons
                      name="list-ul"
                      size={15}
                      color="#175898"
                      style={{marginLeft:5}}
                      />
                    <Text style={styles.modalText}>发 投 票</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.sendAnnouncement.bind(this)}>
                  <View style={[styles.modalTextView,{borderBottomWidth:0}]}>
                    <Icons
                      name="calendar-o"
                      size={15}
                      color="#175898"
                      style={{marginLeft:5}}
                      />
                    <Text style={styles.modalText}>发 公 告</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </TouchableOpacity>
        </View>:null
    )
  }
;
}
export default class AllActivities extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      isOpen:false,
      hasNotice:false
    };
    _this=this;
  };
  componentDidMount() {
      this.getNotices();
      this.timer = setInterval(
        () => {
          this.getNotices();
        },
        30000
      );
  }
  getNotices(){
    api.Activity.getNotices()
      .then((res)=>{
        if(res.Type==1){
          if(res.Data.length!=0){
            if(this.state.hasNotice!=null){
              this.setState({hasNotice:true})
            }
          }
        }
      })
  }
  searchActivities(position) {
    if(position==1){
      this.refs.sendView.open();
    }
    else{
      this.props.nav.push({
        id: 'SearchActivities'
      });
    }
  };
  reloadList(isLoaderOk){
    isLoaderFun=isLoaderOk;
    if(this.refs&&this.refs.scrollTab.state.currentPage){
      switch(this.refs.scrollTab.state.currentPage){
        case 0:
          _this.refs.allList.reloadActList(62);//全部信息
          break;
        case 1:
          _this.refs.myList.reloadActList(64);//已发信息
          break;
        case 2:
          _this.refs.myVoteList.reloadActList(2);//我的投票
          break;
        case 3:
          _this.refs.myReceiptList.reloadActList(4);//我的回执
          break;
        case 4:
          _this.refs.atMeList.reloadActList(16);//@我的
          break;
      }
    }else{
      _this.refs.allList.reloadActList(62);//全部信息
    }


  }
  loadFinish(isload){
    //列表刷新完成
    isLoaderFun(true);
  }
  reloadBadge(){
    this.setState({hasNotice:false})
  }
  getNoticeList(){
    this.props.nav.push({
      id: 'NoticeList',
      reloadBadge:this.reloadBadge.bind(this)
    })
  }
  render() {
    const titleConfig = {
      title: '信息动态',
      tintColor:'white'
    };
    return (
      <View style={{flex:1}}>
        <NavigationBar
          style={styles.NavSty}
          title={titleConfig}
          leftButton={
            <TouchableOpacity style={[styles.navLeftIcon,{paddingLeft: 6,}]} onPress={this.getNoticeList.bind(this, 0)}>
              <Icon
                name='ios-notifications-outline'
                size={25}
                color='white'
              />
              {
                this.state.hasNotice?<View style={styles.badgeView}></View>:null
              }

            </TouchableOpacity>
          }
          rightButton={
          <View style={{flexDirection: 'row',alignItems: 'center',marginRight:10}}>

            <TouchableOpacity style={styles.navLeftIcon} onPress={this.searchActivities.bind(this,0)}>
              <Icon
                name='md-search'
                size={25}
                onPress={this.searchActivities.bind(this,0)}
                color='white'
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navLeftIcon} onPress={this.searchActivities.bind(this,1)}>
                <Icon
                name='md-add'
                size={25}
                onPress={this.searchActivities.bind(this,1)}
                color='white'
              />
            </TouchableOpacity>

            </View>} />
        <View style={{flex:1,backgroundColor:colorManager.getCurrentStyle().BGCOLOR}}>
          <ScrollableTabView
            ref="scrollTab"
            tabBarBackgroundColor='white'
            tabBarUnderlineColor='#3A83E1'
            tabBarActiveTextColor='#3A83E1'
            removeClippedSubviews={false}
            initialPage={0}>
            <View tabLabel='全部信息' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='allList' nav={this.props.nav} actType={62} isLoadFinish={this.loadFinish.bind(this)}/>
            </View>
            <View tabLabel='已发信息' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='myList' nav={this.props.nav} actType={64} isLoadFinish={this.loadFinish.bind(this)}/>
            </View>
            <View tabLabel='我的投票' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='myVoteList'nav={this.props.nav} actType={2} isLoadFinish={this.loadFinish.bind(this)}/>
            </View>
            <View tabLabel='我的回执' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='myReceiptList' nav={this.props.nav} actType={4} isLoadFinish={this.loadFinish.bind(this)}/>
            </View>
            <View tabLabel='@我的' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='atMeList' nav={this.props.nav} actType={16} isLoadFinish={this.loadFinish.bind(this)}/>
            </View>
          </ScrollableTabView>
        </View>
        <SendView ref="sendView" nav={this.props.nav}/>
      </View>
    );
  }
};


