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
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import api from "../../network/ApiHelper";
import NavigationBar from 'react-native-navbar';
import Icons from 'react-native-vector-icons/Ionicons'



export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      user:[],
      isFetch:false
    };
  };
  componentDidMount() {
    api.User.getUserProfile()
      .then((resData)=>{
        this.setState({
          isFetch:true,
          user:resData.Data
        });
      })
  }
  editUser() {
    this.props.nav.push({
      id: 'UpdateUser',
      userData:this.state.user
    });
  }

;
  userItem(item) {
    return (
      <View style={styles.listRow}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.year}>{item.cont}</Text>
        </View>
      </View>
    );

  }

;
  render() {
    var toolbarActions = [
      {title: '编辑', show: 'always'},
    ];
    return (
      <View style={styles.containersw}>
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
                         <Text numberOfLines={1} style={styles.navLeftText}>个人资料</Text>
                     </View>
                   }
          rightButton={
                   this.state.isFetch?<TouchableOpacity style={{marginRight:10,justifyContent: 'center'}} onPress={this.editUser.bind(this)}>
                    <Text numberOfLines={1} style={styles.rightNavText}>编辑</Text>
                      </TouchableOpacity>:<Text/>
                    } />
        {this.state.isFetch?<ScrollView keyboardShouldPersistTaps={true}>
          <View style={styles.container}>
            <Image
              source={{uri:this.state.user&&this.state.user.Avatar}}
              style={styles.thumbnail}
              />
            <View style={styles.rightContainer}>
              <Text style={styles.headName}>{this.state.user.FirstName}</Text>
              <Text style={[styles.headDepName,{width:Dimensions.get('window').width-100}]}>{this.state.user.Departments}</Text>
            </View>
          </View>

          <View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>手机</Text>
              <Text style={styles.year}>{this.state.user.Mobile}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>办公电话</Text>
              <Text style={styles.year}>{this.state.user.Phone}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>邮箱</Text>
              <Text style={styles.year}>{this.state.user.Email}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>QQ</Text>
              <Text style={styles.year}>{this.state.user.QQ}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>家乡</Text>
              <Text style={styles.year}>{this.state.user.Hometown}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>工号</Text>
              <Text style={styles.year}>{this.state.user.JobNumber}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>生日</Text>
              <Text style={styles.year}>{this.state.user.Birthday}</Text>
            </View>
            <View style={[styles.listRow,{padding:15}]}>
              <Text style={styles.title}>毕业学校</Text>
              <Text style={styles.year}>{this.state.user.School}</Text>
            </View>
          </View>

        </ScrollView>:null}

      </View>

    );
  }
};

