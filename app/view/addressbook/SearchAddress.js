import React, {Component} from 'react'
import {
  Image,
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  Dimensions
} from 'react-native';

import colorManager from '../common/styles/manager'
import styles from "./style";
import Icons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../network/ApiHelper";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');


export default class SearchAddress extends React.Component {
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {
      keywords:"",
      nodata:false,
      UserData:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  };
  fetchData(keyword){
    loaderHandler.showLoader("加载中...");
    api.OS.getUserList(keyword)
      .then((resData)=>{
        loaderHandler.hideLoader();
        if(resData.Type==1){
        this.setState({
          UserData:this.state.UserData.cloneWithRows(resData.Data),
          nodata:false
        });
        }
        else{
          this.setState({
            nodata:true
          });
        }
      })
  };
  getUserInfo(Id){
    this.props.nav.push({
      id: 'AddressInfo',
      Id:Id
    });
  };
  userItems(item){
    return (
      <TouchableOpacity onPress={this.getUserInfo.bind(this,item.Id)}>
        <View style={styles.container}>
          <Image
            source={{uri:item.Avatar}}
            style={styles.image}
            />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{item.Name}</Text>
            <Text style={styles.year}>{item.Description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  search(){
    if(this.state.keywords==""){
      ToastAndroid.show("请输入搜索关键字",ToastAndroid.SHORT);
      return;
    }
    else{
      this.fetchData(this.state.keywords);
    }
  }
  render() {
    return (
      <View style={styles.containersw}>
         <View style={{height: 55,alignItems: 'center',backgroundColor:colorManager.getCurrentStyle().NAVCOLOR,flexDirection: 'row',}}>
           <TouchableOpacity onPress={() => {this.props.nav.pop();}}>
             <Icons
               name="md-arrow-round-back"
               size={28}
               color="white"
               style={styles.serchImg}
               />
           </TouchableOpacity>
            <View style={[styles.searchView,{width:Dimensions.get('window').width*0.7,alignItems: 'center',justifyContent: 'center',}]}>
              <Icon
                name="search"
                size={20}
                color="#5D5B5B"
                style={{marginLeft:10}}
                />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder=" 关键字"
                autoFocus={true}
                textAlignVertical='center'
                returnKeyType='search'
                onSubmitEditing={this.search.bind(this)}
                onChangeText={(text) => this.setState({keywords: text})}
                style={{flex:1,padding:0,width:Dimensions.get('window').width*0.6}}
                />
            </View>
           <TouchableOpacity style={{padding:10}} onPress={this.search.bind(this)}>
            <Text style={{color :'white',fontSize:15}}>搜索</Text>
           </TouchableOpacity>
         </View>

        <View style={{flex:1}}>
          {
            this.state.nodata?
              <View style={styles.nodataView}>
                <Icon
                  name="exclamation-circle"
                  size={50}
                  color="#717171"
                  />
                <Text style={styles.nodataViewText}>暂无相关用户</Text>
              </View>
              :<ScrollView keyboardShouldPersistTaps={true} keyboardDismissMode ='on-drag'><ListView
              dataSource={this.state.UserData}
              removeClippedSubviews={false}
               enableEmptySections={true}
              renderRow={this.userItems.bind(this)}
              style={{backgroundColor: 'white'}}/></ScrollView>
          }

        </View>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>

    );
  }
};

