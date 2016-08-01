'use strict';

/*
 * home toolbar :[home,category,search,user,setting]
 */

var React = require('react-native');

var {
  AppRegistry,
  Platform,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
  ToastAndroid,
  TouchableOpacity
  } = React;

var SwitchAndroid = require('SwitchAndroid');
var ToolbarAndroid = require('ToolbarAndroid');
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var statusBarSize = Platform.OS == 'ios' ? 10 : 0;
var active="AllActivities";
import AllActivities from '../activities/AllActivities.js'
import AddressBook from '../addressbook/AddressBook.js'
import Report from '../report/ReportMain.js'
import User from '../usercenter/UserCenterMain.js'
import Application from './Application.js';
import KB from '../kb/KbMain.js'
import Attendance from '../attendance/AttendanceMain.js'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabNavigator from 'react-native-tab-navigator';
import JPush from 'react-native-jpush';
import api from "../../network/ApiHelper";
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

export default class MainTabView  extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      selectedTab: this.props.selectedTab!=null?this.props.selectedTab:'Activities'
    }
  }

  componentDidMount() {

    var currUser=api.User.getCurrentUser();
    if(currUser!=null){
      JPush.setAlias(currUser.Id.toString());
    }
    //if(this.props.type&&this.props.type==1){
    // // this.props.nav.push({id:"AttendanceMain"})
    //}
  }
  attendanceOnpress(){
    if(this.refs.attendance){
      this.refs.attendance.reloadData();
    }
    this.setState({ selectedTab: 'Attendance' })
  }
  render() {

    //<TabNavigator.Item
    //  selected={this.state.selectedTab === 'Attendance'}
    //  title="考勤"
    //  renderIcon={
    //        () =><Icon
    //        name='map-marker'
    //        size={27}
    //        style={{height:27}}
    //        color='#656468'
    //        />}
    //  renderSelectedIcon={() =>
    //        <Icon
    //        name='map-marker'
    //        size={28}
    //        style={{height:28}}
    //        color='#3b5998'
    //        />}
    //  titleStyle={{fontSize:12}}
    //  onPress={this.attendanceOnpress.bind(this)}>
    //  <Attendance ref="attendance" nav={this.props.nav}/>
    //</TabNavigator.Item>
    //<TabNavigator.Item
    //  selected={this.state.selectedTab === 'AddressBook'}
    //  title="通讯录"
    //  renderIcon={
    //        () =><Icon
    //        name='phone-square'
    //        size={27}
    //        style={{height:30}}
    //        color='#656468'
    //        />}
    //  renderSelectedIcon={() =>
    //        <Icon
    //        name='phone-square'
    //        size={28}
    //        style={{height:30}}
    //        color='#3b5998'
    //        />}
    //  titleStyle={{fontSize:12}}
    //  onPress={() => this.setState({ selectedTab: 'AddressBook' })}>
    //  <AddressBook nav={this.props.nav}/>
    //</TabNavigator.Item>

    return (
        <TabNavigator>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'Activities'}
            title="信息"
            renderIcon={
            () =><Icon
            name='comments'
            size={27}
            style={{height:27}}
            color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
            name='comments'
            size={28}
            style={{height:28}}
            color='#3b5998'
            />}
            titleStyle={{fontSize:12}}
            onPress={() => this.setState({ selectedTab: 'Activities' })}>
            <AllActivities  nav={this.props.nav}/>
          </TabNavigator.Item>

          <TabNavigator.Item
          selected={this.state.selectedTab === 'Report'}
          title="汇报"
          renderIcon={
            () =><Icon
            name='table'
            size={27}
            style={{height:27}}
            color='#656468'
            />}
          renderSelectedIcon={() =>
          <Icon
            name='table'
            size={28}
            style={{height:28}}
            color='#3b5998'
            />}
          titleStyle={{fontSize:12}}
          onPress={() => this.setState({ selectedTab: 'Report' })}>
          <Report  nav={this.props.nav}/>
        </TabNavigator.Item>

        <TabNavigator.Item
          selected={this.state.selectedTab === 'KB'}
          title="文库"
          renderIcon={
                () =><Icon
                name='folder'
                size={27}
                style={{height:30}}
                color='#656468'
                />}
          renderSelectedIcon={() =>
                <Icon
                name='folder'
                size={28}
                style={{height:30}}
                color='#3b5998'
                />}
          titleStyle={{fontSize:12}}
          onPress={() => this.setState({ selectedTab: 'KB' })}>
          <KB nav={this.props.nav}/>
        </TabNavigator.Item>





          <TabNavigator.Item
            selected={this.state.selectedTab === 'Application'}
            title="应用"
            renderIcon={
            () =><Icon
            name='th-large'
            size={27}
            style={{height:27}}
            color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
            name='th-large'
            size={28}
            style={{height:28}}
            color='#3b5998'
            />}
            titleStyle={{fontSize:12}}
            onPress={() => this.setState({ selectedTab: 'Application' })}>
            <Application nav={this.props.nav}/>
          </TabNavigator.Item>


          <TabNavigator.Item
            selected={this.state.selectedTab === 'UserCenter'}
            title="个人"
            renderIcon={
            () =><Icon
            name='user'
            size={27}
            style={{height:27}}
            color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
            name='user'
            size={28}
            style={{height:28}}
            color='#3b5998'
            />}
            titleStyle={{fontSize:12}}
            onPress={() => this.setState({ selectedTab: 'UserCenter' })}>
            <User nav={this.props.nav}/>
          </TabNavigator.Item>


        </TabNavigator>
    );
  }
}

