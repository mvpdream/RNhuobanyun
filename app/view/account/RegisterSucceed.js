import React, {Component} from 'react'
import {
   Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
  Dimensions
} from 'react-native';
import styles from "./style";
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons';


export default class RegisterSucceed extends React.Component{
    creatCompany(){
        this.props.nav.push({
            id: 'CreatCompany',
        });
    };
    joinCompany(){
        this.props.nav.push({
            id: 'JoinCompany',
        });
    };
    render(){
        return(
            <View style={styles.recontainer}>
                <NavigationBar
                  style={styles.NavSty}
                  leftButton={
                      <NavLeftView nav={this.props.nav} leftTitle="注册成功"/>
                   }/>
                <View style={styles.rescontainer}>
                  <View style={styles.resimageView}>
                      <Image resizeMode="stretch" style={styles.resImage} source={require('../image/succeed.png')}/>
                      <Text style={{fontSize:28,color:'#175898'}}>注册成功！</Text>
                  </View>

                    <View style={{alignItems:'center',justifyContent: 'center',marginTop:30}}>
                        <TouchableOpacity style={styles.companyTou} onPress={this.creatCompany.bind(this)}>
                            <View style={styles.compbutton}>
                                <Text style={{fontSize:16,color:'white'}}>创建企业</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.companyTou} onPress={this.joinCompany.bind(this)}>
                            <View style={styles.compbutton}>
                                <Text style={{fontSize:16,color:'white'}}>加入企业</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    };

}
