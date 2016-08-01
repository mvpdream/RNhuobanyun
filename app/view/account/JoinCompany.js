
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
    } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import Dimensions from 'Dimensions';
import api from "../../network/ApiHelper";
import Toast from  '@remobile/react-native-toast'

export default class JoinCompany extends React.Component{
    state = {
        selectText:false,
        sel:false,
        companyId:"",
        username:""
    };
    joinCompany(){
        if(this.state.companyId==""||this.state.username==""){
            Toast.show("请检查信息是否输入完整","short");
        }
        else{
            api.Company.joinCompany(this.state.companyId,this.state.username)
                .then((resData)=>{
                    if(resData.Type==1){
                        Toast.show(resData.Data,"short");
                        this.props.nav.push({
                            id:'SelectCompany'
                        });
                    }
                    else {
                        Toast.show(resData.Data,"short");
                    }
                });
        }
    };
    render(){
        return(
            <View style={styles.recontainer}>
                <NavToolbar navIconName={"android-arrow-back"} title={'加入企业'}  nav={this.props.nav} onClicked={() => {this.props.nav.pop();}}/>
                <View style={styles.container}>
                    <View style={styles.creatcom}>
                        <Text style={styles.titletext}>企业号</Text>
                        <View style={this.state.selectText?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.titleInput}>
                            <TextInput
                                ref="allname"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(0)}}
                                placeholder ="输入企业号"
                                textAlignVertical={'center'} textAlign={'start'} style={styles.TextInputs} onChangeText={(text) => this.setState({companyId: text})} />
                        </View>

                        <Text style={styles.titletext}>用户姓名</Text>
                        <View style={this.state.sel?[styles.titleInput,{borderColor:'#0683F9',borderWidth: 1.2,}]:styles.titleInput}>
                            <TextInput
                                ref="username"
                                underlineColorAndroid="transparent"
                                onFocus={()=>{this._onFocus(1)}}
                                placeholder ="输入用户姓名"
                                textAlignVertical={'center'} textAlign={'start'} style={styles.TextInputs} onChangeText={(text) => this.setState({username: text})} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.joincomTou} onPress={this.joinCompany.bind(this)}>
                        <View style={styles.button}>
                            <Text style={styles.text}>加入企业</Text>
                        </View>
                    </TouchableOpacity>
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
