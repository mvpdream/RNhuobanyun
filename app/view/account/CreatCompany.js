import React, {Component} from 'react'
import {
 Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    TextInput,
  ScrollView,
  Dimensions
} from 'react-native';

import styles from "./style";
import api from "../../network/ApiHelper";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons';
import InputScrollView from 'react-native-inputscrollview';


export default class CreatCompany extends React.Component{
    state = {
        selectText:false,
        sel:false,
        sec:false,
        companyname:"",
        shortName:"",
        creatname:"",
        cont:false
    };
    creatcompany(){
        api.Company.createCompany(this.state.companyname,this.state.shortName,this.state.creatname)
        .then((resData)=>{
              ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
              if(resData.Type==1){
                  this.props.nav.push({
                      id: 'SelectCompany'
                  });
              }else{
                  ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
              }

        });
    };
    render(){
        return(
            <View style={styles.recontainer}>
                <NavigationBar
                  style={styles.NavSty}
                  leftButton={
                    <NavLeftView nav={this.props.nav} leftTitle="创建企业"/>
                   }/>
                <View style={styles.container}>
                    <InputScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.creatcom}>
                        <Text style={styles.titletext}>企业全称</Text>
                        <View style={this.state.selectText?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2}]:styles.titleInput}>
                            <TextInput
                                ref="allname"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(0)}}
                                placeholder ="输入企业全称"
                                style={styles.TextInputs} onChangeText={(text) => this.setState({companyname: text})} />
                        </View>
                    </View>
                    <View style={styles.creatcom}>
                        <Text style={styles.titletext}>企业简称</Text>
                        <View style={this.state.sel?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.titleInput}>
                            <TextInput
                                ref="partname"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(1)}}
                                placeholder ="输入企业简称"
                                style={styles.TextInputs} onChangeText={(text) => this.setState({shortName: text})} />
                        </View>
                    </View>
                    <View style={styles.creatcom}>
                        <Text style={styles.titletext}>姓名</Text>
                        <View style={this.state.sec?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.titleInput}>
                            <TextInput
                                ref="name"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(2)}}
                                placeholder ="输入姓名"
                                style={styles.TextInputs} onChangeText={(text) => this.setState({creatname: text})} />
                        </View>
                    </View>
                    {
                        this.state.companyname==""|| this.state.shortName==""|| this.state.creatname==""
                            ?<TouchableOpacity style={styles.loginTou}>
                            <View style={[styles.button,{backgroundColor:'#ccc'}]}>
                                <Text style={styles.text}>完成</Text>
                            </View>
                        </TouchableOpacity>
                            :<TouchableOpacity style={styles.loginTou} onPress={this.creatcompany.bind(this)}>
                            <View style={styles.button}>
                                <Text style={styles.text}>完成</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    </InputScrollView>

                </View>

            </View>
        );
    };

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
