import React, {Component} from 'react'
import {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    TextInput,
  Dimensions
} from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import KbList from './KbList.js'


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
      ToastAndroid.show("请输入搜索关键字",ToastAndroid.SHORT);
    }
    else{
      this.refs.kbList.getSearchList(this.state.keywords,this.props.projectId);
    }

  }
  backMain(){
    this.props.nav.pop()
  }
    render() {
        return (
            <View style={{flex:1}}>
                <NavigationBar
                  style={styles.NavSty}
                  title={
                    <View style={{height:55,borderBottomColor: 'white',borderBottomWidth: 1, alignItems: 'center',justifyContent: 'center'}}>
                      <TextInput
                        underlineColorAndroid='transparent'
                        placeholder="搜索"
                        autoFocus={true}
                        placeholderTextColor='gray'
                        textAlignVertical='center'
                        ref="searchText"
                         returnKeyType='search'
                        onSubmitEditing={this.searchKb.bind(this)}
                        onChangeText={(text) => this.setState({keywords: text})}
                        style={{width:Dimensions.get('window').width*0.7,color:'white',height:50,padding:0,marginBottom:-15}}
                        />
                    </View>
                  }
                  leftButton={
                    <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:10}]} onPress={this.backMain.bind(this)}>
                        <Icons
                          name="md-arrow-round-back"
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
                          name='md-search'
                          size={28}
                          onPress={this.searchKb.bind(this)}
                          color='white'
                          />
                      </TouchableOpacity>
                    </View>} />

              <KbList ref="kbList" nav={this.props.nav} kbId={this.props.kbId == null ? 0 : this.props.kbId}
                      type='search'/>



            </View>
        );
    }
};

