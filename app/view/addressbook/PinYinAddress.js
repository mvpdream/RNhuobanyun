/**
 * Created by wangshuo on 2016/3/1.
 */
'use strict';

import React, {
  Image,
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  Component,
  Alert
  } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
import api from "../../network/ApiHelper";
import Toast from  '@remobile/react-native-toast'
import CircleCheckBox from 'react-native-circle-checkbox';
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var AlphabetListView = require('react-native-alphabetlistview');
import ActionButton from 'react-native-action-button';
var Contacts = require('react-native-contacts');
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import _ from 'lodash';
var _this=null;
var alluser=[];
class SectionHeader extends Component {
  render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      color: 'black',
      fontWeight: '600',
      fontSize: 18
    };

    var viewStyle = {
      height: 28,
      paddingLeft: 5
    };
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
    );
  }
}

//侧边字母
class SectionItem extends Component {
  render() {
    return (
        <View style={{backgroundColor:'#B3B3B3',width:15,justifyContent: 'center',alignItems: 'center'}}>
        <Text style={{color:'blue'}}>{this.props.title}</Text>
        </View>
    );
  }
}

//显示部分
class Cell extends Component {
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {
      isoutaddress:false,
    };
  };
  getUserInfo(Id){
    _this.props.nav.push({
      id: 'AddressInfo',
      Id:Id
    });
  };
  render() {
    return (
      <TouchableOpacity onPress={_this.state.isoutaddress?this.checkItem.bind(this):this.getUserInfo.bind(this,this.props.item.Id)}>
        <View style={styles.container}>
          <Image
            source={{uri: this.props.item.Avatar}}
            style={styles.image}
            />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{this.props.item.Name}</Text>
            <Text style={styles.year} numberOfLines={1}>{this.props.item.Description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class CenterToast extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
     isopen:false
    }
  };
  open(){
    this.setState({isopen:!this.state.isopen})
  }
  render() {
    return (
      <View style={{
      backgroundColor:"rgba(0,0,0,0.2)",
      height:30,
      width:30,
      borderRadius:15,
      justifyContent: 'center',
      alignItems: 'center'}}>
        <Text style={{color:'blue'}}>{this.props.currTitle}</Text>
      </View>
    );
  }
}
export default class PinYinAddress extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      isoutaddress:false,
      data:[],
      checkstate:false,
      isbuttom:false,
      selectedItem:[],
      Allcontacts:[],
      addItem:[],
      userList:[],
    };
    _this=this;
  };
  componentDidMount(){
    loaderHandler.showLoader("加载中...");
   api.OS.getUserListGroupByPrefix()
    .then((resData)=>{
       loaderHandler.hideLoader();
       this.setState({
         data:resData.Data
       });
     });
    if(this.props.isout){
      this.isout()
    }
  };
  render() {
    //onScrollToSection={(data)=>{Toast.showShortCenter(data);}}
    return (
      <View style={{flex:1,backgroundColor:'#EFF0F4'}}>
      <AlphabetListView
        style={{paddingBottom:10}}
        data={this.state.data}
        cell={Cell}
        cellHeight={70}
        sectionListItem={SectionItem}
        sectionHeader={SectionHeader}
        sectionHeaderHeight={29}
        />
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
        </View>




    );
  }
};

