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
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions=require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高


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
                <NavToolbar
                    navIconName={"android-arrow-back"}
                    title={'帐号安全'}
                    onClicked={() => {this.props.nav.pop();}} />

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

