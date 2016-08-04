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
import api from "../../network/ApiHelper";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');


export default class DepAddress extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {
          checkstate:false,
            AllData:new ListView.DataSource({
              rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            menuItem:[],
            menuData:new ListView.DataSource({
              rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            depName:"",
            userItem:false,
            ishave:false
        };
    };
    componentDidMount() {
      this.fetchData()
    };
    fetchData(Id){
      loaderHandler.showLoader("加载中...");
      api.OS.getUnitsOfDep(Id)
        .then((resData)=>{
          loaderHandler.hideLoader();
          var allData = resData.Data.Deps.concat(resData.Data.Users);
          this.setState({
            AllData:this.state.AllData.cloneWithRows(allData),
            ishave:true
          });
          if(resData.Data&&resData.Data.length<=5){
            this.refs.list.scrollTo({x:0,y:0,animated:false});
          }
        })
    }
    getUserInfo(Id){
        this.props.nav.push({
            id: 'AddressInfo',
            Id:Id
        });
    };
    depitem(item){
      this.fetchData(item.Id);
      if(this.state.ishave){
      this.state.menuItem.push(item);
      this.setState({
        menuData:this.state.menuData.cloneWithRows(this.state.menuItem)
      });}
    }
    allItem(item){
        return (
            item.Type=='user'?<TouchableOpacity onPress={this.getUserInfo.bind(this,item.Id)}>
            <View style={styles.container}>
              <Image
                source={{uri:item.Avatar}}
                style={styles.image}
                />
              <View style={styles.rightContainer}>
                <Text style={styles.title}>{item.Name}</Text>
                <Text style={styles.year} numberOfLines={1}>{item.Description}</Text>
              </View>
            </View>
          </TouchableOpacity>:<TouchableOpacity onPress={()=>this.depitem(item)}>
              <View style={styles.container}>
                <View style={styles.rightContainer}>
                  <Text style={styles.title}>{item.Name}</Text>
                  <Text style={styles.year}>{item.UserCount}人</Text>
                </View>
              </View>
            </TouchableOpacity>
        );

    };
    selectDep(Id,rowID){
      this.fetchData(Id);
      this.state.menuItem.splice(rowID+1);
      this.setState({
        menuData:this.state.menuData.cloneWithRows(this.state.menuItem)
      });
    }
    render() {
        return (
          <View style={{flex:1,backgroundColor:'#EFF0F4'}}>
              <View style={{backgroundColor:'#EFF0F4',flexDirection: 'row',padding:10}}>
                <TouchableOpacity onPress={this.selectDep.bind(this,null,-1)}>
                  <Text style={{color:'black',fontSize:16}}>全公司></Text>
                </TouchableOpacity>
                {
                  this.state.menuItem&&this.state.menuItem.map((item,index)=>{
                    return(
                      <TouchableOpacity key={index} onPress={this.selectDep.bind(this,item.Id,index)}>
                        <Text style={{color:'black',fontSize:16}}>{item.Name}></Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            <ScrollView>
              <View style={{flex:1}}>
               <ListView
                 ref="list"
                dataSource={this.state.AllData}
                renderRow={this.allItem.bind(this)}
                style={{backgroundColor: 'white',flex:1,paddingBottom:10}}
                />
                </View>
            </ScrollView>
            <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
          </View>
        );
    }
};

