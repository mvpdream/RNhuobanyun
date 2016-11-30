/**
 * Created by lizx on 2016/2/3.
 */
import React, {Component} from 'react'
import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Animated,
  ScrollView,
  NetInfo,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import styles from "./style";
import api from '../../network/ApiHelper';
import Icon from 'react-native-vector-icons/FontAwesome';
import colorManager from '../common/styles/manager';
var flag = false;


export default class Login extends React.Component {

  state = {
    selectText: false,
    sel: false,
    phonenumber: "",
    password: "",
    fadeAnim: new Animated.Value(0),
    isLogin: false,
    loginFlag: false
  };

  register() {
    this.props.nav.push({
      id: 'Register'
    });
  }

  findPas() {
    this.props.nav.push({
      id: 'FindPassword'
    });
  }
  login() {
    if (this.state.phonenumber == "" || this.state.password == "") {
      ToastAndroid.show("请检查用户名和密码", ToastAndroid.SHORT);
    }
    else {
      this.setState({ loginFlag: true, isLogin: true });
      api.User.userLogin(this.state.phonenumber, this.state.password)
        .then((resData) => {
          this.setState({ loginFlag: false, isLogin: false });
          if (resData.Type == 0) {
            ToastAndroid.show("登录失败，请检查用户名和密码！", ToastAndroid.SHORT);
          } else if (resData.Type == 1) {
            api.Company.enterCompany(resData.Data.Id)
              .then((resData) => {
                if (resData.Type != 1) {
                  ToastAndroid.show((resData.Data == undefined || resData.Data == null) ? "未知错误" : resData.Data, ToastAndroid.SHORT);
                }
                else {
                  this.props.nav.replace({
                    id: 'MainTabView'
                  });
                }
              })
          } else if (resData.Type == 2) {
            this.props.nav.push({
              id: 'SelectCompany',
              icon: 0
            });
          }
        });
    }

  }
  switchColor() {
    colorManager.switchStyle(flag ? colorManager.styleType.NORMAL : colorManager.styleType.COLORFUL);
    flag = !flag;
    this.forceUpdate();
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      { toValue: 1 }
    ).start();

  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Animated.View
              style={{
                opacity: this.state.fadeAnim,
                alignItems: 'center',
                padding: 30
              }}>
              <Image resizeMode="cover" style={styles.userImage} source={require('../image/huobanyun.png') }/>
            </Animated.View>
            <View>
              <View
                style={this.state.selectText ? [styles.adduserInput, { borderColor: '#0683F9', borderWidth: 1.2, }] : styles.adduserInput}>
                <TextInput
                  ref="textname"
                  underlineColorAndroid="transparent"
                  onFocus={() => { this._onFocus(0) } }
                  value={this.state.phonenumber}
                  placeholder="输入手机或邮箱"
                  textAlignVertical={'center'}  style={styles.TextInputs}
                  onChangeText={(text) => this.setState({ phonenumber: text }) }/>
              </View>
            </View>
            <View>
              <View
                style={this.state.sel ? [styles.adduserInput, { borderColor: '#0683F9', borderWidth: 1.2, }] : styles.adduserInput}>
                <TextInput
                  ref="password"
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  onFocus={() => { this._onFocus(1) } }
                  placeholder="输入密码"
                  value={this.state.password}
                  textAlignVertical={'center'} style={styles.TextInputs}
                  onChangeText={(text) => this.setState({ password: text }) }/>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity style={styles.forgetpas} onPress={this.findPas.bind(this) }>
                <Text style={{ color: '#337AB7', fontSize: 14 }}>忘记密码</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.loginTou} onPress={this.state.loginFlag ? () => { } : this.login.bind(this) }>
                <View style={[styles.button, { backgroundColor: colorManager.getCurrentStyle().BTNCOLOR }]}>
                  <Text style={styles.text}>登录</Text>
                  {
                    this.state.isLogin ? <View style={styles.loginProgress}>
                     <ActivityIndicator
                        animating={true}
                        color='white'
                      />
                    </View> : null

                  }

                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.userResi}>
              <View style={{ flexDirection: 'row' }}>
                <Text>没有账号？</Text>
                <TouchableOpacity onPress={this.register.bind(this) }>
                  <Text style={{ color: '#337AB7', fontSize: 14 }}>马上注册</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    )
  }

  ;


  //文本框获得焦点
  _onFocus(textid) {
    if (textid == 0) {
      this.setState({
        selectText: true,
        sel: false
      });
    }
    else {
      this.setState({
        selectText: false,
        sel: true
      });
    }

  }

  ;

}
