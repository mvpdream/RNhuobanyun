
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
import api from '../../network/ApiHelper';
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var currDate = new Date();
var currHour="whwdxhbmdjdl";

import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons';
var CryptoJS = require("crypto-js");
import InputScrollView from 'react-native-inputscrollview';


export default class Register extends React.Component{
    state = {
        selectText:false,
        sel:false,
        sec:false,
        phoneNumber:"",
        password:"",
        phoneCode:"",
        timesecend:30,
        again:false,
        AES_Result:""
    };
    showTime(){
        this.state.timesecend -= 1;
        if(this.state.timesecend==0){
            clearInterval(this.timer);
            this.setState({
                timesecend:30,
                agian:false
            });
        }
        this.forceUpdate();
    }

    showtimer() {
        this.timer = setInterval(
            () => { this.showTime() },
            1000
        );
    };
    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    render(){
        return(
            <View style={styles.recontainer}>
                <NavigationBar
                  style={styles.NavSty}
                  leftButton={
                    <NavLeftView nav={this.props.nav} leftTitle="注册"/>
                   }/>
                <View style={styles.container}>
                    <InputScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={this.state.selectText?[styles.adduserInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.adduserInput}>
                        <TextInput
                            ref="textname"
                            underlineColorAndroid="transparent"
                            onFocus={()=>{this._onFocus(0)}}
                            placeholder ="输入手机号"
                            maxLength={11}
                            style={styles.TextInputs} onChangeText={(text) => this.setState({phoneNumber: text})} />
                    </View>
                </View>
                <View>
                    <View style={this.state.sel?[styles.adduserInput,{borderColor:'#0683F9',borderWidth: 1.2}]:styles.adduserInput}>
                        <TextInput
                            ref="password"
                            underlineColorAndroid="transparent"
                            secureTextEntry={true}
                            onFocus={()=>{this._onFocus(1)}}
                            placeholder ="输入密码"
                             style={styles.TextInputs} onChangeText={(text) => this.setState({password: text})} />
                    </View>
                </View>

                <View style={{flexDirection:'row'}}>
                    <View style={this.state.sec?[styles.codeInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.codeInput}>
                        <TextInput
                            ref="code"
                            underlineColorAndroid="transparent"
                            onFocus={()=>{this._onFocus(2)}}
                            placeholder ="输入短信验证码"
                            keyboardType={'numeric'}
                            maxLength={6}
                             style={styles.TextInputs} onChangeText={(text) => this.setState({phoneCode: text})} />
                    </View>
                    {
                        this.state.phoneNumber==""
                        ?<TouchableOpacity style={[styles.codeTou,{width:widths*0.45}]}>
                            <View style={[styles.codebutton,{backgroundColor:'#ccc'}]}>
                                <Text style={{fontSize:14,color:'white'}}>获取验证短信</Text>
                            </View>
                        </TouchableOpacity>
                       : this.state.agian
                          ?<TouchableOpacity style={[styles.codeTou,{width:widths*0.45}]}>
                            <View style={styles.codebutton}>
                              <Text style={{fontSize:14,color:'white'}}>{this.state.timesecend}s后重新发送</Text>
                            </View>
                             </TouchableOpacity>
                            :<TouchableOpacity style={[styles.codeTou,{width:widths*0.45}]} onPress={this.getcode.bind(this)}>
                            <View style={styles.codebutton}>
                               <Text style={{fontSize:14,color:'white'}}>获取验证短信</Text>
                            </View>
                        </TouchableOpacity>


                    }

                </View>
                    {
                        this.state.phoneNumber==""|| this.state.password==""|| this.state.phoneCode==""
                        ? <TouchableOpacity style={styles.loginTou}>
                                <View style={[styles.button,{backgroundColor:'#ccc'}]}>
                                    <Text style={styles.text}>注册</Text>
                                </View>
                        </TouchableOpacity>
                        :<TouchableOpacity style={styles.loginTou} onPress={this.registerSucceed.bind(this)}>
                            <View style={styles.button}>
                                <Text style={styles.text}>注册</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    </InputScrollView>
                </View>
            </View>
        );
    };
    registerSucceed(){
        api.User.userRegister(this.state.phoneNumber,this.state.password,this.state.phoneCode)
            .then((resDate)=>{
                if(resDate.Type==1){
                    this.props.nav.push({
                        id: 'RegisterSucceed'
                    });
                }
                else{
                    ToastAndroid.show(resDate.Data,ToastAndroid.SHORT);
                }

            });

    };
    getphonecode(md5code){
        api.Util.getValidCode(this.state.phoneNumber,md5code)
          .then((resDate)=>{
              if(resDate.Data=="短信发送成功"){
                  ToastAndroid.show(resDate.Data,ToastAndroid.SHORT);
                  this.showtimer();
                  this.setState({
                      agian:true
                  });
              }
              else{
                  ToastAndroid.show(resDate.Data,ToastAndroid.SHORT);
              }
          })
    }
    getcode(){
        if(this.state.phoneNumber.length!=11||this.state.phoneNumber[0]!=1||this.state.phoneNumber==""){
            ToastAndroid.show("手机号格式有误！",ToastAndroid.SHORT);
        }
        else{
            let code=CryptoJS.MD5(CryptoJS.MD5(CryptoJS.MD5(currHour).toString().toUpperCase()).toString().toUpperCase()).toString().toUpperCase();
            if(code!=null){
                this.getphonecode(code);
            }
        }
    }
    _onFocus(textid){
        switch (textid) {
            case 0:
                this.setState({
                selectText:true,
                sel:false,
                sec:false
              });
                break;
            case 1:
                this.setState({
                    selectText:false,
                    sel:true,
                    sec:false
                });
                break;
            case 2:
                this.setState({
                    selectText:false,
                    sel:false,
                    sec:true
                });
                break;
        }
    };

}
