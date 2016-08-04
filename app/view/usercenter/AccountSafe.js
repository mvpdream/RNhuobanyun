/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
    Image,
    Text,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    ListView
    } from 'react-native';
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions=require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import NavigationBar from 'react-native-navbar';
import Icons from 'react-native-vector-icons/Ionicons'


export default class AccountSafe extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {

        };
    };
    updatePas(){
        this.props.nav.push({
            id: 'UpdatePassword'
        });
    };
    exitCom(){
        this.props.nav.push({
            id: 'ExitCompany'
        });
    };

    render() {
        return (
            <View style={styles.containersw}>
                <NavigationBar
                  style={{height: 55,backgroundColor:'#175898'}}
                  leftButton={
                    <View style={styles.navLeftBtn}>
                          <Icons
                            name="android-arrow-back"
                            size={28}
                            style={{marginLeft:20,paddingRight:20}}
                            color="white"
                            onPress={() => {this.props.nav.pop()}}
                          />
                        <Text style={styles.rightNavText}>帐号安全</Text>
                       </View>
                    }/>

                <TouchableOpacity onPress={this.updatePas.bind(this)}>
                    <View style={[styles.usersafeView,{marginTop:3}]}>
                        <View style={styles.info}>
                            <Text style={styles.usersafeText}>修改密码</Text>
                        </View>
                        <View>
                            <Icon
                                name='angle-right'
                                size={30}
                                style={styles.rigthBtns}
                                />
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.exitCom.bind(this)}>
                    <View style={styles.usersafeView}>
                        <View style={styles.info}>
                            <Text style={styles.usersafeText}>退出公司</Text>
                        </View>
                        <View>
                            <Icon
                                name='angle-right'
                                size={30}
                                style={styles.rigthBtns}
                                />
                        </View>
                    </View>
                </TouchableOpacity>



                </View>

        );
    }
};

