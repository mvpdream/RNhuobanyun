/**
 * Created by wangshuo
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
    Component,
  TextInput
    } from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
var Dimensions=require('Dimensions');
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import KbList from './KbList.js'
import Toast from  '@remobile/react-native-toast'

export default class SearchKb extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {
          keywords:""
        };
    };
  searchKb(){
    this.state.keywords=this.state.keywords.trim();
    if(this.state.keywords==""||this.state.keywords.length==0){
      Toast.show("请输入搜索关键字","short");
    }
    else{
      this.refs.kbList.getSearchList(this.state.keywords);
    }

  }
  backMain(){
    this.props.nav.pop()
  }
    render() {
        return (
            <View style={{flex:1}}>
                <NavigationBar
                  style={{height: 55,backgroundColor:'#175898'}}
                  title={
                    <View style={{height:40,borderBottomColor: 'white',borderBottomWidth: 1, alignItems: 'center',justifyContent: 'center'}}>
                      <TextInput
                        underlineColorAndroid='transparent'
                        placeholder="搜索"
                        autoFocus={true}
                        placeholderTextColor='gray'
                        textAlignVertical='center'
                        ref="searchText"
                        onSubmitEditing={this.searchKb.bind(this)}
                        onChangeText={(text) => this.setState({keywords: text})}
                        style={{width:Dimensions.get('window').width*0.7,color:'white'}}
                        />
                    </View>
                  }
                  leftButton={
                    <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={this.backMain.bind(this)}>
                        <Icons
                          name="android-arrow-back"
                          size={28}
                          color="white"
                          onPress={this.backMain.bind(this)}
                        />
                        </TouchableOpacity>
                   }
                  rightButton={
                   <View style={{flexDirection: 'row',alignItems: 'center'}}>
                      <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginTop:5}]} onPress={this.searchKb.bind(this)}>
                        <Icons
                          name='android-search'
                          size={28}
                          onPress={this.searchKb.bind(this)}
                          color='white'
                          />
                      </TouchableOpacity>
                    </View>} />

                    <KbList ref="kbList" nav={this.props.nav}  kbId={this.props.kbId==null?0:this.props.kbId} type='search'/>


            </View>
        );
    }
};

