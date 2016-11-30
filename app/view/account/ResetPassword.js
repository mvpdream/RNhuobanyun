import React, {Component} from 'react'
import {
  Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    TextInput,
  Dimensions
} from 'react-native';

import styles from "./style";
import api from "../../network/ApiHelper";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高

import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons';


export default class ResetPassword extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state={
            NewPassword:"",
            enterNewPassword:""
        };
    };
    savePas(){
        if(this.state.NewPassword!=this.state.enterNewPassword){
            ToastAndroid.show("两次输入的密码不一致",ToastAndroid.SHORT);
            return;
        }

        if(this.state.NewPassword==""||this.state.enterNewPassword==""){
          ToastAndroid.show("输入项不能为空",ToastAndroid.SHORT);
          return;
        }
        if(this.state.NewPassword.indexOf(" ")>-1&&this.state.enterNewPassword.indexOf(" ")>-1){
          ToastAndroid.show("输入项中不能有空格",ToastAndroid.SHORT);
          return;
        }
        else{
            api.User.findPassword(this.props.phonenum,this.state.NewPassword)
              .then((resData)=>{
                ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
                  if(resData.Type==1){
                      this.props.nav.push({
                          id: 'Login'
                      });
                  }
              })
        };
    };
    render() {
        return (
          <View style={styles.containersw}>
            <NavigationBar
              style={styles.NavSty}
              leftButton={
                     <NavLeftView nav={this.props.nav} leftTitle="重置密码"/>
                   }/>

              <View style={styles.updatepasView}>
                  <TextInput
                    style={styles.updatepasTextIn}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({NewPassword: text})}
                    underlineColorAndroid='transparent'
                    placeholder="输入新密码"
                    />
              </View>
              <View style={styles.updatepasView}>
                  <TextInput
                    style={styles.updatepasTextIn}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({enterNewPassword: text})}
                    underlineColorAndroid='transparent'
                    placeholder="确认新密码"
                    />
              </View>
              <View style={{marginTop:10}}>
                  <TouchableOpacity style={styles.bottomTou} onPress={this.savePas.bind(this)}>
                      <View style={styles.bottomTouViewpas}>
                          <Text style={{color:"white",fontSize:16}}>确 定</Text>
                      </View>
                  </TouchableOpacity>
              </View>
          </View>

        );
    }

}
