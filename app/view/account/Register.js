/**
 * Created by lizx on 2016/2/3.
 */
/**
 * Created by wangshuo on 2016/2/3.
 */
import React, {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    TextInput,
    Component,
  ScrollView
    } from 'react-native';
import styles from "./style";
import api from "../../network/ApiHelper";
var Dimensions=require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var currDate = new Date();
var currHour="whwdxhbmdjdl"+currDate.getHours();
import Toast from  '@remobile/react-native-toast'
import NavigationBar from 'react-native-navbar';
import Icons from 'react-native-vector-icons/Ionicons';
import md5 from 'md5';


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
                         <Text numberOfLines={1} style={styles.navLeftText}>注册</Text>
                     </View>
                   }/>
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={false}>
                <View>
                    <View style={this.state.selectText?[styles.adduserInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.adduserInput}>
                        <TextInput
                            ref="textname"
                            underlineColorAndroid="transparent"
                            onFocus={()=>{this._onFocus(0)}}
                            placeholder ="输入手机号"
                            maxLength={11}
                            textAlignVertical={'center'} textAlign={'start'} style={styles.TextInputs} onChangeText={(text) => this.setState({phoneNumber: text})} />
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
                            textAlignVertical={'center'} textAlign={'start'} style={styles.TextInputs} onChangeText={(text) => this.setState({password: text})} />
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
                            textAlignVertical={'center'} textAlign={'start'} style={styles.TextInputs} onChangeText={(text) => this.setState({phoneCode: text})} />
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
                    </ScrollView>
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
                    Toast.show(resDate.Data,"short");
                }

            });

    };
    getphonecode(md5code){
        api.Util.getValidCode(this.state.phoneNumber,md5code)
          .then((resDate)=>{
              if(resDate.Data=="短信发送成功."){
                  Toast.show(resDate.Data,"short");
                  this.showtimer();
                  this.setState({
                      agian:true
                  });
              }
              else{
                  Toast.show(resDate.Data,"short");
              }
          })
    }
    getcode(){
        if(this.state.phoneNumber.length!=11||this.state.phoneNumber[0]!=1||this.state.phoneNumber==""){
            Toast.show("手机号格式有误！","short");
        }
        else{
            let a=md5(currHour);
            let b=md5(a.toUpperCase());
            let c=md5(b.toUpperCase());
            let msg=c.toUpperCase();
            if(msg!=null){
                this.getphonecode(msg);
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
