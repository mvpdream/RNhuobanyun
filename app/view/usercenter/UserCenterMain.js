import React, {Component} from 'react'
import {
    Image,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  TouchableNativeFeedback,
  ProgressBarAndroid,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions
} from 'react-native';

import colorManager from '../common/styles/manager'
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../network/ApiHelper";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var Bounceable = require("react-native-bounceable");
var ImagePickerManager = require('react-native-image-picker');
var flag = false;
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import JPush from 'react-native-jpush';


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
    this.state = {
      user: [],
      userImage:null,
      dataSource: navItems,
      isFetch:false
    };

  };
  componentDidMount(){
    api.User.getUserProfile()
      .then((resData)=>{
        if(resData.Type==1){
          this.setState({
            isFetch:true,
            user:resData.Data,
            userImage:resData.Data.Avatar
          });
        }else{
          ToastAndroid.show("获取个人资料失败！",ToastAndroid.SHORT);
        }
      })
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
          JPush.setAlias("");//"" （空字符串）表示取消之前的设置。
          this.props.nav.replace({
            id: 'Login'
          });
        }
        else{
          ToastAndroid.show("退出失败！",ToastAndroid.SHORT);
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
        loaderHandler.showLoader("正在上传...");
        api.User.uploadAvatar(param)
          .then((resData)=>{
            loaderHandler.hideLoader();
            if(resData.Type!=1){
              ToastAndroid.show(resData.Data.toString(),ToastAndroid.SHORT);
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
          style={styles.NavSty}
          title={titleConfig}/>
        <View style={[styles.containers,{backgroundColor: colorManager.getCurrentStyle().BGCOLOR}]}>
          {this.state.isFetch?<View style={styles.container}>
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
          </View>:<View style={styles.container}>
           <View style={styles.loaderThumbnail}>
           <ActivityIndicator animating={true} color='#6d6d6d' size='large'/>
           </View>
            <View style={styles.rightContainer}>
              <Text style={styles.headName}>加载中</Text>
              <Text style={styles.headDepName}>加载中</Text>
            </View>
          </View>}
          <ScrollView keyboardShouldPersistTaps={true} keyboardDismissMode='on-drag'>
            <View>
              {this.state.dataSource&&this.state.dataSource.map((item,index)=>{
                return (
                  <TouchableOpacity key={index} style={{marginTop:index==0||index==3?10:0}} onPress={item.onSelect}>
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
              })}
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
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }

;
};

