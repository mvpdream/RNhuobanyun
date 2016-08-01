/**
 * Created by wangshuo on 2016/2/16.
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
  Linking
  } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
var Dimensions = require('Dimensions');
import PinYinAddress from './PinYinAddress'
import Icon from 'react-native-vector-icons/Ionicons'
import DepAddress from './DepAddress'
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';


export default class AddressBook extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
    };
  }

;
  searchUser(position) {
    if (position == 1) {
      this.props.nav.push({
        id: 'ExportAddress'
      });}
    else{
    this.props.nav.push({
      id: 'SearchAddress'
    });}
  };
  componentDidMount(){
  }
  render() {
    const titleConfig = {
      title: '通讯录',
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
              onPress={this.searchUser.bind(this,0)}
              color='white'
              />
              <Icon
              name='ios-upload-outline'
              size={25}
              onPress={this.searchUser.bind(this,1)}
              color='white'
              />
            </View>} />
        <View style={{flex:1}}>
          <ScrollableTabView
            tabBarBackgroundColor='white'
            tabBarUnderlineColor='#3A83E1'
            tabBarActiveTextColor='#3A83E1'>
            <PinYinAddress tabLabel='按拼音查看' nav={this.props.nav}/>
            <DepAddress tabLabel='按部门查看' nav={this.props.nav}/>
          </ScrollableTabView>
        </View>
      </View>
    );
  }
};

