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
    Component
    } from 'react-native';
import styles from "./style";
import api from "../../network/ApiHelper";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
var Dimensions=require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import Toast from  '@remobile/react-native-toast'


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
            Toast.show("两次输入的密码不一致","short");
            return;
        }

        if(this.state.NewPassword==""||this.state.enterNewPassword==""){
          Toast.show("输入项不能为空","short");
          return;
        }
        if(this.state.NewPassword.indexOf(" ")>-1&&this.state.enterNewPassword.indexOf(" ")>-1){
          Toast.show("输入项中不能有空格","short");
          return;
        }
        else{
            api.User.findPassword(this.props.phonenum,this.state.NewPassword)
              .then((resData)=>{
                Toast.show(resData.Data,"short");
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
              <NavToolbar
                navIconName={"android-arrow-back"}
                title={'重置密码'}
                onClicked={() => {this.props.nav.pop();}} />

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
