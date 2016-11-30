
import React, {Component} from 'react'
import {
  Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    TextInput,
  ScrollView
} from 'react-native';

import styles from "./style";
import api from "../../network/ApiHelper";

import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons';

export default class JoinCompany extends React.Component{
    state = {
        selectText:false,
        sel:false,
        companyId:"",
        username:""
    };
    joinCompany(){
        if(this.state.companyId==""||this.state.username==""){
            ToastAndroid.show("请检查信息是否输入完整",ToastAndroid.SHORT);
        }
        else{
            api.Company.joinCompany(this.state.companyId,this.state.username)
                .then((resData)=>{
                    if(resData.Type==1){
                        ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
                        this.props.nav.push({
                            id:'SelectCompany'
                        });
                    }
                    else {
                        ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
                    }
                });
        }
    };
    render(){
        return(
            <View style={styles.recontainer}>
                <NavigationBar
                  style={styles.NavSty}
                  leftButton={
                    <NavLeftView nav={this.props.nav} leftTitle="加入企业"/>
                   }/>
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={false}>
                    <View style={styles.creatcom}>
                        <Text style={styles.titletext}>企业号</Text>
                        <View style={this.state.selectText?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.titleInput}>
                            <TextInput
                                ref="allname"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(0)}}
                                placeholder ="输入企业号"
                                 style={styles.TextInputs} onChangeText={(text) => this.setState({companyId: text})} />
                        </View>

                        <Text style={styles.titletext}>用户姓名</Text>
                        <View style={this.state.sel?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.titleInput}>
                            <TextInput
                                ref="username"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(1)}}
                                placeholder ="输入用户姓名"
                                style={styles.TextInputs} onChangeText={(text) => this.setState({username: text})} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.joincomTou} onPress={this.joinCompany.bind(this)}>
                        <View style={styles.button}>
                            <Text style={styles.text}>加入企业</Text>
                        </View>
                    </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        );
    };
    _onFocus(textid){
        if(textid==0)
        {
            this.setState({
                selectText:true,
                sel:false
            });
        }
        else{
            this.setState({
                selectText:false,
                sel:true
            });
        }

    };

}
