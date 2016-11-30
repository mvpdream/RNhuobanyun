import React, { Component } from 'react';
import {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
  Dimensions
  } from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
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
        return (
            <View style={{flex:1}}>
                <NavigationBar
                  style={styles.NavSty}
                  leftButton={
                        <NavLeftView nav={this.props.nav} leftTitle={"汇报"}/>
                      }/>
                    <View style={styles.container}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.reportItem.bind(this)}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
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

