/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
  Image,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import api from "../../network/ApiHelper";
import _ from "lodash";
import SelectorMain from '../selector/SelectorMain.js'
import Popup from 'react-native-popup';
import Toast from  '@remobile/react-native-toast'

export default class UserSuperior extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      resData:[],
      superiorData:[],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    };
    getList(){
    api.User.getSuperiorList()
      .then((resData)=>{
        this.setState({
          resData:resData.Data,
          dataSource: this.state.dataSource.cloneWithRows(resData.Data),
        });
      })
      .done();
   }
    componentDidMount(){
     this.getList();
    };
  addSuperior(){
    var selectorConfig={
      selectorType:0,
      selectorRadio:0,
      getselectorItem:this.userItem.bind(this)
    };
    this.props.nav.push({
      id: 'SelectorMain',
      selectorConfig:selectorConfig
    });

  }
  userItem(selectedItem){
    if(selectedItem!=""){
    api.User.addSuperior(selectedItem[0].Id)
      .then((resData)=>{
        Toast.show(resData.Data,"short");
        if(resData.Type==1){
          this.getList();
        }
      });}
  }
  //移除上级
  removeSuperior(item){
    this.popup.confirm({
      title: '提示',
      content: '是否移除该用户？',
      ok: {
        text: '确认',
        callback: () => {
          this.okRemoveSuperior(item)
        }
      },
      cancel: {
        text: '取消'
      }
    });
  };
  okRemoveSuperior(item){
     var userid=item.Id;
     var currentData=this.state.resData;
     api.User.removeSuperior(userid)
       .then((resData) => {
         if (resData.Type&&resData.Type==1) {
           Toast.show("删除成功","short");
           if(currentData&&currentData.length>0&&!!item){
             let tempIds=_.pluck(currentData,'Id'),
               _index=tempIds.indexOf(item['Id'])
               ;
             if(_index>-1){
               currentData.splice(_index,1);
               var temp=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
               this.setState({
                 dataSource: temp.cloneWithRows(currentData),
               });
             }
           }

         }
         else {
           Toast.show("删除失败","short");
         }
       })
   };
   renderRow(item) {
    return (
      <View style={[styles.userSupView,{width:Dimensions.get('window').width*0.5}]}>
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
        <View>
          <Image
            source={{uri:item.Avatar}}
            style={styles.thumbnails}
            />
        </View>
        <View>
          <Text style={styles.userSupText}>{item.Name}</Text>
        </View>
        </View>
        <View>
          <Icon name='trash'
                size={26}
                color='#C7254E'
                onPress={()=>this.removeSuperior(item)}
                style={{width: 30, height: 30,marginBottom:5}}/>
        </View>

      </View>
    );
  };
    render()
    {
      return (
        <View style={styles.containersw}>
          <NavToolbar
            navIconName={"android-arrow-back"}
            title={'设置上级'}
            onClicked={() => {this.props.nav.pop();}}
            />
          <View style={{borderColor: '#E4E4E4',borderWidth: 1}}>
            <View style={styles.container}>
              <View style={styles.rightContainer}>
                <Text style={{color:'black',fontSize:17,fontWeight:'bold'}}>我的上级</Text>
                <Text style={{color:'#7D7B7B',fontSize:15,marginTop:10,fontWeight:'bold'}}>上级用户可以在任务列表中查看下属的任务</Text>
              </View>
            </View>
          </View>

         <View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            contentContainerStyle={{justifyContent:'space-between',flexDirection: 'row',flexWrap: 'wrap'}}
            />
           </View>

          <TouchableOpacity onPress={this.addSuperior.bind(this)}>
            <View
              style={{ borderColor: '#E4E4E4',borderWidth: 1,padding: 15,flexDirection: 'row',alignItems: 'center'}}>
              <View>
                <Icon
                  name="plus-square-o"
                  size={30}
                  color="#E4E4E4"
                  />
              </View>
              <View>
                <Text style={{color:'black',fontSize:15,marginBottom: 8,marginLeft:15,}}>添加上级</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Popup ref={(popup) => { this.popup = popup }}/>
        </View>

      );
    }
  }

;

