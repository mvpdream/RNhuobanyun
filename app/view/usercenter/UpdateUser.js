/**
 * Created by wangshuo on 2016/2/16.
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
  DatePickerAndroid
  } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../network/ApiHelper";
var Dimensions = require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import TextField from 'react-native-md-textinput';
import {formatter} from '../../tools/DateHelper'
import Toast from  '@remobile/react-native-toast'


export default class UpdateUser extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      avatarSource:this.props.userData.Avatar,
      date: new Date(),
      user: this.props.userData,
      changedate:false,
      FirstName:"",
      Departments:"",
      Avatar:"http://huobanyun-avatar-dev.oss-cn-beijing.aliyuncs.com/92/63.jpg",
      Mobile:this.props.userData.Mobile==null?"":this.props.userData.Mobile,
      Phone:this.props.userData.Phone==null?"":this.props.userData.Phone,
      Email:this.props.userData.Email==null?"":this.props.userData.Email,
      QQ:this.props.userData.QQ==null?"":this.props.userData.QQ,
      Hometown:this.props.userData.Hometown==null?"":this.props.userData.Hometown,
      JobNumber:this.props.userData.JobNumber==null?"":this.props.userData.JobNumber,
      Birthday:this.props.userData.Birthday,
      School:this.props.userData.School==null?"":this.props.userData.School
    };
  }

;
  showDatePicker() {
    let today = new Date(this.state.Birthday);
    let theMaxDate = new Date(2025, 1, 1);
    let option = {
      date: today
    };

    DatePickerAndroid.open(option).then(
        result => {
        if (result.action !== DatePickerAndroid.dismissedAction) {
          let Birthday = new Date(result.year, result.month, result.day);
          this.setState({
                Birthday:formatter('yyyy/MM/dd',Birthday),
                changedate:true
              });
        }
      }
    ).catch(
        error => {
          Toast.show("出错了","short");
      }
    );

  };

  saveUser() {
    if(!this.state.FirstName){
      this.state.FirstName=this.state.user.FirstName;
    }
    var userparam = {
      Id:this.state.user.Id,
      FirstName:this.state.FirstName,
      Position:this.state.Departments,
      Mobile:this.state.Mobile,
      Phone:this.state.Phone,
      Email:this.state.Email,
      QQ:this.state.QQ,
      Hometown:this.state.Hometown,
      JobNumber:this.state.JobNumber,
      Birthday:this.state.Birthday,
      School:this.state.School,
    };
    var _that=this;
    api.User.editUserProfile(userparam)
      .then((resData)=>{
       if(resData.MessageType&&resData.MessageType==-1){
         Toast.show(resData.MessageContent,"short");
       }
       else{
         Toast.show(resData.Data,"short");
        if(resData.Type==1){
          _that.props.nav.immediatelyResetRouteStack([{id: 'MainTabView',selectedTab:'UserCenter'}])
        }
       }
      })
  }

;
  render() {
    var toolbarActions = [
      {title: '保存', show: 'always'},
    ];
    return (
      <View style={styles.containersw}>
        <NavToolbar
          navIconName={"android-arrow-back"}
          actions={toolbarActions}
          onActionSelected={this.saveUser.bind(this)}
          title={'个人资料'}
          onClicked={() => {this.props.nav.pop();}}/>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={true}>
          <View style={styles.updateView}>
            <View style={styles.updateTextInput}>
              <TextField
                label={'姓名'}
                value={this.state.user.FirstName==null?"":this.state.user.FirstName}
                onChangeText={(text) => this.setState({FirstName: text})}
                highlightColor={'black'}
                labelColor={'#6B6A6A'}
                style={styles.TextFieldText}
                />
            </View>
          </View>

          <View style={styles.updateView}>
            <View style={styles.updateTextInput}>
              <TextField
                label={'职位'}
                value={this.state.user.Departments==null?"":this.state.user.Departments}
                onChangeText={(text) => this.setState({Departments: text})}
                highlightColor={'black'}
                labelColor={'#6B6A6A'}
                style={styles.TextFieldText}
                />
            </View>
          </View>

          <View style={styles.updateView}>
            <View style={styles.updateTextInput}>
                <TextField
                  label={'手机号'}
                  value={this.state.user.Mobile==null?"":this.state.user.Mobile}
                  onChangeText={(text) => this.setState({Mobile: text})}
                  highlightColor={'black'}
                  labelColor={'#6B6A6A'}
                  keyboardType={'numeric'}
                  maxLength={11}
                  style={styles.TextFieldText}
                  />
            </View>
          </View>

          <View style={styles.updateView}>
            <View style={styles.updateTextInput}>
                <TextField
                  label={'电话'}
                  value={this.state.user.Phone==null?"":this.state.user.Phone}
                  onChangeText={(text) => this.setState({Phone: text})}
                  highlightColor={'black'}
                  labelColor={'#6B6A6A'}
                  keyboardType={'numeric'}
                  style={styles.TextFieldText}
                  />
            </View>
          </View>

          <View style={styles.updateView}>
            <View style={styles.updateTextInput}>
              <TextField
                label={'邮箱'}
                value={this.state.user.Email==null?"":this.state.user.Email}
                onChangeText={(text) => this.setState({Email: text})}
                highlightColor={'black'}
                labelColor={'#6B6A6A'}
                keyboardType={'email-address'}
                style={styles.TextFieldText}
                />
            </View>
          </View>

          <View style={styles.updateView}>
            <View style={styles.updateTextInput}>
              <TextField
                label={'QQ'}
                value={this.state.user.QQ==null?"":this.state.user.QQ}
                onChangeText={(text) => this.setState({QQ: text})}
                highlightColor={'black'}
                labelColor={'#6B6A6A'}
                keyboardType={'numeric'}
                style={styles.TextFieldText}
                />
            </View>
          </View>

          <View style={styles.updateView}>
            <View style={styles.updateTextInput}>
              <TextField
                label={'家乡'}
                value={this.state.user.Hometown==null?"":this.state.user.Hometown}
                onChangeText={(text) => this.setState({Hometown: text})}
                highlightColor={'black'}
                labelColor={'#6B6A6A'}
                style={styles.TextFieldText}
                />
            </View>
          </View>

          <View style={styles.updateView}>
            <View style={styles.updateTextInput}>
              <TextField
                label={'工号'}
                value={this.state.user.JobNumber==null?"":this.state.user.JobNumber}
                onChangeText={(text) => this.setState({JobNumber: text})}
                highlightColor={'black'}
                labelColor={'#6B6A6A'}
                keyboardType={'numeric'}
                style={styles.TextFieldText}
                />
            </View>
          </View>

          <View style={[styles.updateView,{paddingTop:0,paddingBottom:0}]}>
            <TouchableOpacity
              onPress={this.showDatePicker.bind(this)}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop:7.2}}>
                <Text style={{fontSize:16}}>生日</Text></View>
              <View style={{paddingBottom:6.5,paddingTop:8}}>
                <Text style={{color:'black',fontSize:13}}>{this.state.Birthday}</Text></View>
            </View>
              </TouchableOpacity>
          </View>

          <View style={styles.updateView}>
            <View style={styles.updateTextInput}>
              <TextField
                label={'毕业学校'}
                value={this.state.user.School==null?"":this.state.user.School}
                onChangeText={(text) => this.setState({School: text})}
                highlightColor={'black'}
                labelColor={'#6B6A6A'}
                style={styles.TextFieldText}
                />
            </View>
          </View>

        </ScrollView>
      </View>

    );
  }
};

