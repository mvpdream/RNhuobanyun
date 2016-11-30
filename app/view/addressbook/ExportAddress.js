import React, {Component} from 'react'
import {
  Image,
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  Alert,
  Dimensions
} from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../network/ApiHelper";
import CircleCheckBox from 'react-native-circle-checkbox';
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var AlphabetListView = require('react-native-alphabetlistview');
var Contacts = require('react-native-contacts');
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import _ from 'lodash';
var _this=null;
var alluser=[];
var cellthis=null;

import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons'

var CheckBoxData=[];
var select=false;

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
  checkItem(flag){
    let checkState;
    if(flag==1){
      checkState=true;
    }
    else if(flag==2){
      checkState=false;
    }
    else{
      checkState=!this.state.checkState;
    }
    this.setState({checkState:checkState});

  };
  unique(arr){
    // 数组去重,然后保留一个
    var tmp = new Array();
    for(var i in arr){
      if(tmp.indexOf(arr[i])==-1){
        tmp.push(arr[i]);
      }
    }
    return tmp;
  }
  initCheckBoxData(checkbox){
      if(!select&&checkbox!=null) {
        CheckBoxData.push(checkbox);
      }
      if(checkbox&&checkbox.props.checked){
        _this.state.selectedItem.push(this.props.item);
        var newArr=this.unique(_this.state.selectedItem);
        _this.state.selectedItem=newArr;
      }
      if(checkbox&&!checkbox.props.checked){
        var _index=_this.state.selectedItem.indexOf(this.props.item);
        if(_index>-1){
          _this.state.selectedItem.splice(_index,1)
        }
      }


  }
  SelectAll(){
    select=true;
    for (var i = 0; i < CheckBoxData.length; i++) {
      if(CheckBoxData[i]!=null){
        CheckBoxData[i].props.onToggle(1);
      }
    }
  }
  NoSelectAll(){
    select=true;
    for (var i = 0; i < CheckBoxData.length; i++) {
      if(CheckBoxData[i]!=null){
        CheckBoxData[i].props.onToggle(2);
      }
    }
  }
  render() {
    return (
      <TouchableOpacity onPress={this.checkItem.bind(this)}>
        <View style={styles.container}>
            <CircleCheckBox
              ref={(c)=>this.initCheckBoxData(c)}
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
    select=false;
   api.OS.getUserListGroupByPrefix()
    .then((resData)=>{
       if(resData.Type==1){
         this.setState({
           data:resData.Data
         });
       }else{
         ToastAndroid.show("获取失败",ToastAndroid.SHORT);
       }

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
          ToastAndroid.show("保存失败，请重试",ToastAndroid.SHORT);
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
      Alert.alert(
                  '提示',
                  `确定导出${newAddressNames.join(",")}\n${newaddress.length}位联系人?`,
                  [
                    {text: '取消'},
                    {text: '确定', onPress: () => {
                      Contacts.getAll((err, contacts) => {
                        var that=this;
                        if(err && err.type === 'permissionDenied'){
                          ToastAndroid.show("获取联系人失败",ToastAndroid.SHORT);
                        } else {
                          loaderHandler.showLoader("导出。。。");
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
                              if(successUsers.length>0||duplicatedUsers.length>0){
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
  allSelect(){
    cellthis.SelectAll();
  }
  allNoSelect(){
    cellthis.NoSelectAll();
  }
  render() {
    return (
      <View style={{flex:1}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
          <NavLeftView nav={this.props.nav} leftTitle="导出联系人"/>
           }
          rightButton={
            <View style={{justifyContent: 'center',flexDirection: 'row'}}>
              <TouchableOpacity style={{marginRight:10,justifyContent: 'center'}} onPress={this.allSelect.bind(this)}>
                <Text numberOfLines={1} style={styles.rightNavText}>全选</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight:10,justifyContent: 'center'}} onPress={this.allNoSelect.bind(this)}>
                <Text numberOfLines={1} style={styles.rightNavText}>全不选</Text>
              </TouchableOpacity>
            </View>
          }
         />
      <AlphabetListView
        data={this.state.data}
        cell={Cell}
        cellHeight={70}
        removeClippedSubviews={false}
         enableEmptySections={true}
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
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />

        </View>




    );
  }
};

