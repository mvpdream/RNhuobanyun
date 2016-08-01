/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
  Image,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView
  } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/Ionicons'
import colorManager from '../common/styles/manager';
var Dimensions = require('Dimensions');
var Modal = require('react-native-modalbox');
import api from "../../network/ApiHelper";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var Communications = require('react-native-communications');
var Contacts = require('react-native-contacts');
import ActionSheet from 'react-native-actionsheet';
const buttons = ['取消', '存入手机通讯录'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;
import Toast from  '@remobile/react-native-toast'

export default class AddressInfo extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      UserData:[],
      Allcontacts:[],
      isOpen:false
    };
  };
  componentDidMount() {
    this.fetchData();
  };
  fetchData(){
    api.User.getUserProfile(this.props.Id)
      .then((resData)=>{
        this.setState({
          UserData:resData.Data
        });
      })
  };
  addContacts(){
    var newPerson = {
      givenName: this.state.UserData.FirstName,
      emailAddresses: [{
        label: "work",
        email: this.state.UserData.Email
      }],
      phoneNumbers: [{
        label: "mobile",
        number: this.state.UserData.Mobile
      }],
    };
    Contacts.getAll((err, contacts) => {
      if(err && err.type === 'permissionDenied'){
      } else {
        this.setState({Allcontacts: contacts});
      }
    });
    for (var i = 0; i < this.state.Allcontacts.length; i++) {
      if(newPerson.givenName==this.state.Allcontacts[i].familyName||this.state.Allcontacts[i].givenName||this.state.Allcontacts[i].middleName)
      {
        Toast.show("你已保存该名片","short");
        return;
      }
    }
    Contacts.addContact(newPerson, (err) => {
      if(err){
        Toast.show("保存失败，请重试","short");
      }
      else {
        Toast.show("保存成功","short");
      }
    })

  };
  _handlePress(index) {
    if(index==1){
      this.addContacts()
    }
  }
  show() {
    this.ActionSheet.show();
  }
  render() {
    var toolbarActions = [
      {title: '更多', show: 'always'},
    ];
    return (
      <View style={styles.containersw}>
        <NavToolbar
          navIconName={"android-arrow-back"}
          actions={toolbarActions}
          onActionSelected={this.show.bind(this)}
          title={'个人资料'}
          onClicked={() => {this.props.nav.pop();}}/>

        <ScrollView keyboardShouldPersistTaps={true}>
          <View style={styles.icontainer}>
            <Image
              source={{uri:this.state.UserData.Avatar}}
              style={styles.thumbnail}
              />
            <View>
              <Text style={styles.headName}>{this.state.UserData.FirstName}</Text>
              <Text style={[styles.headDepName,{width:Dimensions.get('window').width-100}]} >{this.state.UserData.Departments}</Text>
            </View>
          </View>
          <View>
            <View style={styles.listRow}>
              <View>
                <Text style={[styles.title,{fontWeight:'100'}]}>手机号</Text>
                <Text style={styles.year}>{this.state.UserData.Mobile}</Text>
              </View>
              {
                this.state.UserData.Mobile==null?null:<View style={{alignItems: 'center',flexDirection: 'row',}}>
                  <Icon
                    name="phone"
                    size={26}
                    color="#5CB85C"
                    style={{marginLeft:10}}
                    onPress={()=> Communications.phonecall(this.state.UserData.Mobile, true)}
                    />
                  <Icon
                    name="comment"
                    size={26}
                    color="#F0AD4E"
                    style={{marginLeft:16}}
                    onPress={()=> Communications.text(this.state.UserData.Mobile)}
                    />
                </View>
              }

            </View>
            <View style={styles.listRow}>
              <View>
                <Text style={[styles.title,{fontWeight:'100'}]}>办公电话</Text>
                <Text style={styles.year}>{this.state.UserData.Phone}</Text>
              </View>
              {
                this.state.UserData.Phone==null?null:<View style={{alignItems: 'center',flexDirection: 'row',}}>
                  <Icon
                    name="phone"
                    size={26}
                    color="#5CB85C"
                    style={{marginLeft:10}}
                    onPress={()=> Communications.phonecall(this.state.UserData.Phone, true)}
                    />
                  <Icon
                    name="comment"
                    size={26}
                    color="#F0AD4E"
                    style={{marginLeft:16}}
                    onPress={()=> Communications.text(this.state.UserData.Phone)}
                    />
                </View>
              }
            </View>
            <View style={styles.listRow}>
              <View>
                <Text style={[styles.title,{fontWeight:'100'}]}>邮箱</Text>
                <Text style={styles.year}>{this.state.UserData.Email}</Text>
              </View>
              {
                this.state.UserData.Email==null?null: <View style={{alignItems: 'center',flexDirection: 'row',}}>
                  <Icon
                    name="envelope"
                    size={26}
                    color="#D9534F"
                    style={{marginLeft:10}}
                    onPress={()=>Communications.email([this.state.UserData.Email],null,null,'','')}
                    />
                </View>
              }
            </View>
            <View style={styles.listRow}>
              <View>
                <Text style={[styles.title,{fontWeight:'100'}]}>QQ</Text>
                <Text style={styles.year}>{this.state.UserData.QQ}</Text>
              </View>
            </View>
            <View style={styles.listRow}>
              <View>
                <Text style={[styles.title,{fontWeight:'100'}]}>家乡</Text>
                <Text style={styles.year}>{this.state.UserData.Hometown}</Text>
              </View>
            </View>
            <View style={styles.listRow}>
              <View>
                <Text style={[styles.title,{fontWeight:'100'}]}>工号</Text>
                <Text style={styles.year}>{this.state.UserData.JobNumber}</Text>
              </View>
            </View>
            <View style={styles.listRow}>
              <View>
                <Text style={[styles.title,{fontWeight:'100'}]}>生日</Text>
                <Text style={styles.year}>{this.state.UserData.Birthday}</Text>
              </View>
            </View>
            <View style={styles.listRow}>
              <View>
                <Text style={[styles.title,{fontWeight:'100'}]}>毕业学校</Text>
                <Text style={styles.year}>{this.state.UserData.School}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <ActionSheet
          ref={(o) => this.ActionSheet = o}
          options={buttons}
          tintColor='black'
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this._handlePress.bind(this)}
          />

      </View>

    );
  }
};

