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
  Dimensions
} from 'react-native';

import styles from "./style";
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons'


export default class UpdatePassword extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state={
          CurrentPassword:"",
          NewPassword:"",
          NewPasswords:""
        };
    };
    savePas(){
        if(this.state.NewPassword!=this.state.NewPasswords){
            ToastAndroid.show("两次输入的密码不一致！",ToastAndroid.SHORT);
        }
        else{
          api.User.resetPassword(this.state.CurrentPassword,this.state.NewPassword)
            .then((resData)=>{
                ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
              if(resData.Type==1){
                this.props.nav.pop();
              }
            })
        }
    };
    render() {
        return (
            <View style={styles.containersw}>
                <NavigationBar
                  style={styles.NavSty}
                  leftButton={
                   <NavLeftView nav={this.props.nav} leftTitle="修改密码"/>
                    }/>

                <View style={styles.updatepasView}>
                    <TextInput
                        style={styles.updatepasTextIn}
                        onChangeText={(text) => this.setState({CurrentPassword: text})}
                        underlineColorAndroid='transparent'
                        placeholder="原始密码"
                        />
                </View>
                <View style={styles.updatepasView}>
                    <TextInput
                        style={styles.updatepasTextIn}
                        onChangeText={(text) => this.setState({NewPassword: text})}
                        underlineColorAndroid='transparent'
                        placeholder="新密码"
                        />
                </View>
                <View style={styles.updatepasView}>
                    <TextInput
                        style={styles.updatepasTextIn}
                        onChangeText={(text) => this.setState({NewPasswords: text})}
                        underlineColorAndroid='transparent'
                        placeholder="确认密码"
                        />
                </View>
                <View style={{marginTop:10}}>
                    <TouchableOpacity style={styles.bottomTou} onPress={this.savePas.bind(this)}>
                        <View style={styles.bottomTouViewpas}>
                            <Text style={{color:"white",fontSize:16}}>保 存</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </View>

        );
    }
};

