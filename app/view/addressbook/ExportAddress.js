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
  Alert,
  } from 'react-native';
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
import api from "../../network/ApiHelper";
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
var cellthis=null;
import Toast from  '@remobile/react-native-toast'
import NavigationBar from 'react-native-navbar';
import Icons from 'react-native-vector-icons/Ionicons'
import Popup from 'react-native-popup';

//标题字母
class SectionHeader extends Component {
  render() {
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
      checkState:false,
      isbuttom:false,
      isoutaddress:false,
    };
    cellthis=this;
  };
  checkItem(){
    this.setState({checkState: !this.state.checkState});
    if(this.state.checkState){
      _this.state.selectedItem.push(this.props.item);
    }
    else{
      var _index=_this.state.selectedItem.indexOf(this.props.item);
      if(_index>-1){
        _this.state.selectedItem.splice(_index,1)
      }
    }
  };
  render() {
    return (
      <TouchableOpacity onPress={this.checkItem.bind(this)}>
        <View style={styles.container}>
            <CircleCheckBox
            checked={this.state.checkState}
            outerColor='#175898'
            innerColor='#175898'
            onToggle={this.checkItem.bind(this)}
            />
          <Image
            source={{uri: this.props.item.Avatar}}
            style={styles.image}
            />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{this.props.item.Name}</Text>
            <Text style={styles.year}>{this.props.item.Description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}


export default class ExportAddress extends React.Component {
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
   api.OS.getUserListGroupByPrefix()
    .then((resData)=>{
       this.setState({
         data:resData.Data
       });
     })
  };
  isout(){
    this.setState({
      isoutaddress: true,
      isbuttom:true
    });
  }
  cancel(){
    _this.setState({
      isoutaddress: false,
      isbuttom:false
    });
  }
  saveaddress(ContItem){
    Contacts.addContact(ContItem, (err) => {
        loaderHandler.hideLoader();
        if(err){
          Toast.show("保存失败，请重试","short");
        }
        else {
          alluser.push(ContItem);
        }
      }
    )
  }
  okadd(){
    var newaddress = _this.state.selectedItem.map((item)=> {
        return item.Id
      });
    var newAddressNames=_this.state.selectedItem.map((item)=> {
      return item.Name
    });
    if(newaddress.length>0){
      debugger;
      Alert.alert(
                  '提示',
                  `确定导出${newAddressNames.join(",")}\n${newaddress.length}位联系人?`,
                  [
                    {text: '取消'},
                    {text: '确定', onPress: () => {
                      Contacts.getAll((err, contacts) => {
                        var that=this;
                        if(err && err.type === 'permissionDenied'){
                          Toast.show("获取联系人失败","short");
                        } else {
                          loaderHandler.showLoader("正在导出。。。");
                          api.OS.groupImportUserInfo(newaddress)
                            .then((resData)=>{
                              var duplicatedUsers=[];
                              var successUsers=[];
                              for(var s=0;s<resData.Data.length;s++){
                                var temp=_.find(contacts,"givenName",resData.Data[s].givenName);
                                if(!temp){
                                  that.saveaddress(resData.Data[s]);
                                  successUsers.push(resData.Data[s]);
                                }
                                else{
                                  duplicatedUsers.push(temp.givenName);
                                }
                              }
                              if(duplicatedUsers.length>0){
                                loaderHandler.hideLoader();
                                Alert.alert(
                                  '提示',
                                  `成功导出${successUsers.length}位联系人\n${duplicatedUsers.length}位由于重复被忽略：${duplicatedUsers.join(',')}`,
                                  [
                                    {text: '确定'}
                                  ]
                                )
                              }
                              else{
                                loaderHandler.hideLoader();
                                Alert.alert(
                                  '提示',
                                  `导出失败！`,
                                  [
                                    {text: '确定'}
                                  ]
                                )
                              }
                            });

                        }
                      });
                    }}
                  ]
                );

    }
    else{
      loaderHandler.hideLoader();
      Alert.alert(
        '警告',
        `请至少选择1位用户！`,
        [
          {text: '确定'}
        ]
      )
    }

  };
  render() {
    return (
      <View style={{flex:1}}>
        <NavigationBar
          style={{height: 55,backgroundColor:'#175898'}}
          leftButton={
             <View style={styles.navLeftBtn}>
             <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={() => {this.props.nav.pop()}}>
                <Icons
                  name="android-arrow-back"
                  size={28}
                  color="white"
                  onPress={() => {this.props.nav.pop()}}
                />
                 </TouchableOpacity>
                 <Text numberOfLines={1} style={styles.navLeftText}>导出联系人</Text>
             </View>
           }/>
      <AlphabetListView
        data={this.state.data}
        cell={Cell}
        cellHeight={70}
        sectionListItem={SectionItem}
        sectionHeader={SectionHeader}
        sectionHeaderHeight={29}
        />
      <View style={{backgroundColor:'#BFBFBF',flexDirection: 'row',}}>
          <View style={{flex:1}}>
            <TouchableOpacity style={styles.pinyinAddress} onPress={this.okadd.bind(this)}>
              <Text style={{color:'white',fontSize:14}}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Popup ref={(popup) => { this.popup = popup }}/>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />

        </View>




    );
  }
};

