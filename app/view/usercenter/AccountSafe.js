import React, {Component} from 'react'
import {
 Image,
    Text,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    ListView,
  Dimensions
} from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
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
                  style={styles.NavSty}
                  leftButton={
                   <NavLeftView nav={this.props.nav} leftTitle="帐号安全"/>
                    }/>

                <TouchableOpacity onPress={this.updatePas.bind(this)}>
                    <View style={[styles.usersafeView,{marginTop:3}]}>
                        <View style={styles.info}>
                            <Text style={styles.usersafeText}>修改密码</Text>
                        </View>
                        <View>
                            <Icon
                                name='angle-right'
                                size={25}
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
                                size={25}
                                style={styles.rigthBtns}
                                />
                        </View>
                    </View>
                </TouchableOpacity>



                </View>

        );
    }
};

