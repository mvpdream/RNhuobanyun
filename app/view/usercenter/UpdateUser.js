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
  DatePickerAndroid,
  Dimensions
} from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../network/ApiHelper";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import {formatter} from '../../tools/DateHelper'
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons'
import InputScrollView from 'react-native-inputscrollview'


export default class UpdateUser extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    let today = new Date();
    if (this.props.userData.Birthday != "") {
      today = new Date(this.props.userData.Birthday);
    }
    var newDate = formatter('yyyy-MM-dd', today);
    this.state = {
       avatarSource: this.props.userData.Avatar,
      date: formatter('yyyy-MM-dd', new Date()),
      user: this.props.userData,
      changedate: false,
      FirstName: this.props.userData.FirstName == null ? "" : this.props.userData.FirstName,
      Position: this.props.userData.Position == null ? "" : this.props.userData.Position,
      Avatar: "http://huobanyun-avatar-dev.oss-cn-beijing.aliyuncs.com/92/63.jpg",
      Mobile: this.props.userData.Mobile == null ? "" : this.props.userData.Mobile,
      Phone: this.props.userData.Phone == null ? "" : this.props.userData.Phone,
      Email: this.props.userData.Email == null ? "" : this.props.userData.Email,
      QQ: this.props.userData.QQ == null ? "" : this.props.userData.QQ,
      Hometown: this.props.userData.Hometown == null ? "" : this.props.userData.Hometown,
      JobNumber: this.props.userData.JobNumber == null ? "" : this.props.userData.JobNumber,
      Birthday: newDate,
      School: this.props.userData.School == null ? "" : this.props.userData.School
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
                Birthday:formatter('yyyy-MM-dd',Birthday),
                changedate:true
              });
        }
      }
    ).catch(
        error => {
          ToastAndroid.show("出错了",ToastAndroid.SHORT);
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
         ToastAndroid.show(resData.MessageContent,ToastAndroid.SHORT);
       }
       else{
         ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
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
       <NavigationBar
          style={styles.NavSty}
          leftButton={
          <NavLeftView nav={this.props.nav} leftTitle="编辑资料"/>
                   }
          rightButton={
                  <TouchableOpacity style={{marginRight:10,alignItems: 'center',flexDirection: 'row'}} onPress={this.saveUser.bind(this)}>
                    <Text numberOfLines={1} style={styles.rightNavText}>保存</Text>
                      </TouchableOpacity>
                    } />
        <InputScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.updateViews}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop: 7.2}}>
                <Text style={{fontSize: 16}}>姓名</Text></View>
              <View>
                <TextInput
                  style={{height: 35, fontSize: 13}}
                   underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({FirstName: text})}
                  defaultValue={this.state.user.FirstName == null ? "" : this.state.user.FirstName}
                />
              </View>
            </View>
          </View>

          <View style={styles.updateViews}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop: 7.2}}>
                <Text style={{fontSize: 16}}>职位</Text></View>
              <View>
                <TextInput
                 underlineColorAndroid="transparent"
                  style={{height: 35, fontSize: 13}}
                  onChangeText={(text) => this.setState({Position: text})}
                  defaultValue={this.state.user.Position == null ? "" : this.state.user.Position}
                />
              </View>
            </View>
          </View>

          <View style={styles.updateViews}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop: 7.2}}>
                <Text style={{fontSize: 16}}>手机号</Text></View>
              <View>
                <TextInput
                 underlineColorAndroid="transparent"
                  style={{height: 35, fontSize: 13}}
                  onChangeText={(text) => this.setState({Mobile: text})}
                  defaultValue={this.state.user.Mobile == null ? "" : this.state.user.Mobile}
                />
              </View>
            </View>
          </View>

          <View style={styles.updateViews}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop: 7.2}}>
                <Text style={{fontSize: 16}}>电话</Text></View>
              <View>
                <TextInput
                 underlineColorAndroid="transparent"
                  style={{height: 35, fontSize: 13}}
                  onChangeText={(text) => this.setState({Phone: text})}
                  defaultValue={this.state.user.Phone == null ? "" : this.state.user.Phone}
                />
              </View>
            </View>
          </View>

          <View style={styles.updateViews}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop: 7.2}}>
                <Text style={{fontSize: 16}}>邮箱</Text></View>
              <View>
                <TextInput
                 underlineColorAndroid="transparent"
                  style={{height: 35, fontSize: 13}}
                  onChangeText={(text) => this.setState({Email: text})}
                  defaultValue={this.state.user.Email == null ? "" : this.state.user.Email}
                />
              </View>
            </View>
          </View>

          <View style={styles.updateViews}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop: 7.2}}>
                <Text style={{fontSize: 16}}>QQ</Text></View>
              <View>
                <TextInput
                 underlineColorAndroid="transparent"
                  style={{height: 35, fontSize: 13}}
                  onChangeText={(text) => this.setState({QQ: text})}
                  defaultValue={this.state.user.QQ == null ? "" : this.state.user.QQ}
                />
              </View>
            </View>
          </View>

          <View style={styles.updateViews}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop: 7.2}}>
                <Text style={{fontSize: 16}}>家乡</Text></View>
              <View>
                <TextInput
                 underlineColorAndroid="transparent"
                  style={{height: 35, fontSize: 13}}
                  onChangeText={(text) => this.setState({Hometown: text})}
                  defaultValue={this.state.user.Hometown == null ? "" : this.state.user.Hometown}
                />
              </View>
            </View>
          </View>

          <View style={styles.updateViews}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop: 7.2}}>
                <Text style={{fontSize: 16}}>工号</Text></View>
              <View>
                <TextInput
                 underlineColorAndroid="transparent"
                  style={{height: 35, fontSize: 13}}
                  onChangeText={(text) => this.setState({JobNumber: text})}
                  defaultValue={this.state.user.JobNumber == null ? "" : this.state.user.JobNumber}
                />
              </View>
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

          <View style={styles.updateViews}>
            <View style={styles.updateTextInput}>
              <View style={{paddingTop: 7.2}}>
                <Text style={{fontSize: 16}}>毕业学校</Text></View>
              <View>
                <TextInput
                 underlineColorAndroid="transparent"
                  style={{height: 35, fontSize: 13}}
                  onChangeText={(text) => this.setState({School: text})}
                  defaultValue={this.state.user.School == null ? "" : this.state.user.School}
                />
              </View>
            </View>
          </View>
        </InputScrollView>

      </View>

    );
  }
};

