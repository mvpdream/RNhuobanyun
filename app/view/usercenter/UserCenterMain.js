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
  ListView,
  TouchableNativeFeedback,
  Alert
  } from 'react-native';
import colorManager from '../common/styles/manager'
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../network/ApiHelper";
var Dimensions = require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var Bounceable = require("react-native-bounceable");
var ImagePickerManager = require('NativeModules').ImagePickerManager;
var flag = false;
import Popup from 'react-native-popup';
import NavigationBar from 'react-native-navbar';
import Toast from  '@remobile/react-native-toast'


export default class UserCenterMain extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    const navItems = [
      {
        title: "个人资料", icon: 'user', onSelect: ()=> {
        nav.push({id: 'UserInfo',userData:this.state.user})
      }
      },
      {
        title: "我赞过的", icon: 'thumbs-up', onSelect: ()=> {
        nav.push({id: 'MyFavorite'})
      }
      },
      {
        title: "设置上级", icon: 'sitemap', onSelect: ()=> {
        nav.push({id: 'UserSuperior'})
      }
      },
    ];
    const navItemss = [
      {
        title: "切换企业", icon: 'retweet', onSelect: ()=> {
        nav.push({id: 'SelectCompany', icon: 1})
      }
      },
      {
        title: "帐号与安全", icon: 'shield', onSelect: ()=> {
        nav.push({id: 'AccountSafe'})
      }
      },
      {
        title: "关于伙伴", icon: 'exclamation-circle', onSelect: ()=> {
        nav.push({id: 'UserSetting'})
      }
      }
    ];
    const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});
    this.state = {
      user: [],
      userImage:null,
      dataSource: dataSource.cloneWithRows(navItems),
      dataSources: dataSource.cloneWithRows(navItemss)
    };

  };
  componentDidMount(){
    api.User.getUserProfile()
      .then((resData)=>{
        this.setState({
          user:resData.Data,
          userImage:resData.Data.Avatar
        });
      })
  };

  reportItem(item) {
    return (
      <TouchableOpacity onPress={item.onSelect}>
        <View style={styles.listRow}>
          <View style={styles.cellImage}>
            <Icon
              name={item.icon}
              size={18}
              style={styles.rigthBtn}
              />
          </View>
          <View style={styles.info}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
          <View>
            <Icon
              name='angle-right'
              size={20}
              style={styles.rigthBtn}
              />
          </View>
        </View>
      </TouchableOpacity>
    );

  };
  outLogin(){
    Alert.alert(
      '提示',
      '确定退出登录？',
      [
        {text: '取消'},
        {text: '确定', onPress: () => {
          this.cleanUser();
        }}
      ]
    )

  }
  cleanUser() {
    api.User.logout()
    .then((resData)=>{
        if(resData.Type==1){
          this.props.nav.replace({
            id: 'Login'
          });
        }
        else{
          Toast.show("退出失败！","short");
        }
    });
  };
  uploadImage(){
    var options = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从图库中获取',
      maxWidth: 300,
      maxHeight: 300,
      aspectX: 1,
      aspectY: 1,
      quality: 1,
      allowsEditing: true
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        ///console.log('User cancelled image picker');
      }
      else if (response.error) {
       // console.log('ImagePickerManager Error: ', response.error);
      }
      else {
        const source = {uri:"file://"+response.path, isStatic: true};
        this.setState({
          avatarSource: source
        });
        var param={
          files:[{
            uri:source.uri,
            name:source.uri.split('/').pop()
          }]
        };
        api.User.uploadAvatar(param)
          .then((resData)=>{
            if(resData.Type!=1){
              Toast.show(resData.Data.toString(),"short");
            }else{
              this.setState({
                userImage: resData.Data
              });
            }

          })
      }
    });
  }
  render() {
    const titleConfig = {
      title: '个人中心',
      tintColor:'white'
    };
    return (
      <View style={{flex:1}}>
        <NavigationBar
          style={{height: 55,backgroundColor:'#175898'}}
          title={titleConfig}/>
        <View style={[styles.containers,{backgroundColor: colorManager.getCurrentStyle().BGCOLOR}]}>
            <View style={styles.container}>
              <Bounceable
                onPress={this.uploadImage.bind(this)}
                level={1.1}>
                <Image
                  source={{uri:this.state.userImage}}
                  style={styles.thumbnail}
                  />
              </Bounceable>
              <View style={styles.rightContainer}>
                <Text style={styles.headName}>{this.state.user.FirstName}</Text>
                <Text style={styles.headDepName}>{this.state.user.Departments}</Text>
              </View>
            </View>
          <ScrollView keyboardShouldPersistTaps={true} keyboardDismissMode='on-drag'>
            <View>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.reportItem.bind(this)}
                automaticallyAdjustContentInsets={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={true}
                showsVerticalScrollIndicator={false}
                style={{backgroundColor: 'white',marginTop: 10}}
                />
            </View>
            <View>
              <ListView
                dataSource={this.state.dataSources}
                renderRow={this.reportItem.bind(this)}
                automaticallyAdjustContentInsets={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={true}
                showsVerticalScrollIndicator={false}
                style={{backgroundColor: 'white',marginTop: 10}}
                />
            </View>
            <View style={[styles.bottomView,{backgroundColor: colorManager.getCurrentStyle().BGCOLOR,marginTop: 15}]}>
              <TouchableNativeFeedback
                style={styles.bottomTou}
                onPress={this.outLogin.bind(this)}
                >
                <View style={styles.bottomTouView}>
                  <Text style={{color:"white"}}>退出登录</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </ScrollView>


        </View>
        <Popup ref={(popup) => { this.popup = popup }}/>
      </View>
    );
  }

;
};

