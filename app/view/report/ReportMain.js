/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
import NavigationBar from 'react-native-navbar';
var Dimensions=require('Dimensions');
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, widths} = Dimensions.get('window');


export default class ReportMain extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        const navItems=[
            {title:"写汇报", icon:'pencil-square-o',     onSelect:()=>{nav.push({id:'CreatReport'})}},
            {title:"收到的汇报", icon:'book',  onSelect:()=>{nav.push({id:'ReceiveReport'})}},
            {title:"我下属的汇报", icon:'list-alt',     onSelect:()=>{nav.push({id:'SubordinateReport'})}},
        ];
        const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});
        this.state = {
            dataSource: dataSource.cloneWithRows(navItems),
        };
    };
    reportItem(item){
        return (
            <TouchableOpacity onPress={item.onSelect}>
                <View style={styles.listRow}>
                    <View style={styles.cellImage}>
                        <Icon
                            name={item.icon}
                            size={20}
                            style={styles.rigthBtn}
                            />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.text}>{item.title}</Text>
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
        );

    };
    render() {
        const titleConfig = {
            title: '汇报',
            tintColor:'white'
        };
        return (
            <View style={{flex:1}}>
                <NavigationBar
                  style={{height: 55,backgroundColor:'#175898'}}
                  title={titleConfig}/>
                    <View style={styles.container}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.reportItem.bind(this)}
                        automaticallyAdjustContentInsets={false}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps={true}
                        showsVerticalScrollIndicator={false}
                        style={{flex:1, backgroundColor: 'white'}}
                        />
                </View>
            </View>
        );
    }
};

