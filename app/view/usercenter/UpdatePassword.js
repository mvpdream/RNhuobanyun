/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
    Image,
    Text,
    TextInput,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    } from 'react-native';
import styles from "./style";
import api from "../../network/ApiHelper";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions=require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import Toast from  '@remobile/react-native-toast'


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
            Toast.show("两次输入的密码不一致！","short");
        }
        else{
          api.User.resetPassword(this.state.CurrentPassword,this.state.NewPassword)
            .then((resData)=>{
                Toast.show(resData.Data,"short");
              if(resData.Type==1){
                this.props.nav.pop();
              }
            })
        };
    };
    render() {
        return (
            <View style={styles.containersw}>
                <NavToolbar
                    navIconName={"android-arrow-back"}
                    title={'修改密码'}
                    onClicked={() => {this.props.nav.pop();}} />

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

