/**
 * Created by wangshuo on 2016/3/28.
 */
'use strict';

import React, {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  ProgressBarAndroid,
  Linking,
  Component
} from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window');
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome'
import ViewPager from 'react-native-viewpager';
import colorManager from '../common/styles/manager';
var Modal = require('react-native-modalbox');
import ActivitiesList from './ActivitiesList.js'
import ScrollableTabView from 'react-native-scrollable-tab-view';
var firstFlag=0;


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
      type:0
    })
  }
  sendAnnouncement(){
    this.setState({openView:false});
    this.props.nav.push({
      id: 'SendActivity',
      type:1
    })
  }
  sendVote(){
    this.setState({openView:false})
    this.props.nav.push({
      id: 'SendVote'
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
      isOpen:false
    };
  };
  componentDidMount() {
    //this.props.nav.push({id:'AllActivities'})
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
  render() {
    var toolbarActions = [
      {title: '搜索', iconName: 'android-search',show: 'always'},
      {title: '发送', iconName: 'android-add',show: 'always'},
    ];
    const titleConfig = {
      title: '信息动态',
      tintColor:'white'
    };
    return (
      <View style={{flex:1}}>
        <NavigationBar
          style={{height: 55,backgroundColor:'#175898'}}
          title={titleConfig}
          rightButton={
          <View style={{flexDirection: 'row',alignItems: 'center',marginRight:15}}>
            <Icon
            style={{marginRight:30}}
              name='android-search'
              size={25}
              onPress={this.searchActivities.bind(this,0)}
              color='white'
              />
              <Icon
              name='android-add'
              size={25}
              onPress={this.searchActivities.bind(this,1)}
              color='white'
              />
            </View>} />
        <View style={{flex:1,backgroundColor:colorManager.getCurrentStyle().BGCOLOR}}>
          <ScrollableTabView
            tabBarBackgroundColor='white'
            tabBarUnderlineColor='#3A83E1'
            tabBarActiveTextColor='#3A83E1'
            removeClippedSubviews={false}
            initialPage={0}>
            <View tabLabel='全部信息' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='allInfo' nav={this.props.nav} actType={54}/>
            </View>
            <View tabLabel='已发信息' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='myInfo' nav={this.props.nav} actType={64}/>
            </View>
            <View tabLabel='我的投票' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='myVoteInfo'nav={this.props.nav} actType={2}/>
            </View>
            <View tabLabel='我的回执' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='myReceiptInfo' nav={this.props.nav} actType={4}/>
            </View>
            <View tabLabel='@我的' style={{flex: 1}}  nav={this.props.nav}>
              <ActivitiesList ref='atMelist' nav={this.props.nav} actType={16}/>
            </View>
          </ScrollableTabView>
        </View>
        <SendView ref="sendView" nav={this.props.nav}/>
      </View>
    );
  }
};


