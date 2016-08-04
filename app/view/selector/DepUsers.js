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
    ListView,
  Component,
  TextInput,
  Alert
    } from 'react-native';
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions=require('Dimensions');
import api from "../../network/ApiHelper";
import CircleCheckBox from 'react-native-circle-checkbox';
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var selectedDepItem=[];
var _depCom;
var radioNum=100;

//显示部分
class Cell extends Component {
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {
      checkState:false,
      isNext:false
    };
  };
  checkItem(){
    this.setState({checkState: !this.state.checkState,isNext:!this.state.isNext});
    if(this.state.checkState){
      selectedDepItem.push(this.props.item);
    }
    else{
      var _index=selectedDepItem.indexOf(this.props.item);
      if(_index>-1){
        selectedDepItem.splice(_index,1)
      }
    }
    if(selectedDepItem.length>radioNum){
      Alert.alert(
        '警告',
        `做多可以选择：${radioNum}项`,
        [{text:'确定',onPress:()=>this.setState({checkState: !this.state.checkState})}]
      );
      var _index=selectedDepItem.indexOf(this.props.item);
      if(_index>-1){
        selectedDepItem.splice(_index,1)
      }
    }
    else
    {
      _depCom.props.callback(null,selectedDepItem);
    }
  };
  render() {
    var item=this.props.item;
    return (
          <View style={styles.listRow}>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.checkItem.bind(this)}>
            <View style={styles.cellImage}>
              <CircleCheckBox
                checked={this.state.checkState}
                outerColor='#175898'
                innerColor='#175898'
                onToggle={this.checkItem.bind(this)}
                />
            </View>
            <View style={styles.info}>
              <View style={[styles.rightContainer,{marginTop:2}]}>
                <Text style={styles.title}>{item.Name}</Text>
                <Text style={styles.year}>{item.DepCount}个子级部门</Text>
              </View>
            </View>
              </TouchableOpacity>
            <View>
              {item.DepCount==0||this.state.isNext?null:<Icon
                name='angle-right'
                size={30}
                style={styles.rigthBtn}
                onPress={()=>_depCom.depitem(item)}
                />}
            </View>
          </View>
    );
  }
}
export default class DepUsers extends React.Component{
  constructor(props){
    super(props);
    const nav = this.props.nav;
    _depCom=this;
    this.state = {
      checkstate:false,
      DepData:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      menuItem:[],
      menuData:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      depName:"",
      userItem:false,
      nodata:false,
      keywords:null,
      ishave:false
    };
    selectedDepItem=[];
    if(this.props.selectorRadio==0){
      radioNum=1;
    }
  };
  componentDidMount() {
    this.fetchData()
  };

  searchDepItem(){
    if(this.state.keywords==""){
      this.setState({
        nodata:true
      });
    }
    else{api.OS.getDepList(this.state.keywords)
      .then((resData)=>{
        if(resData.Type==1){
          this.setState({
            DepData:this.state.DepData.cloneWithRows(resData.Data),
            nodata:false
          });
        }
        if(resData.Data==""){
          this.setState({
            nodata:true
          });
        }
      })}

  }
  fetchData(Id){
    loaderHandler.showLoader("加载中...");
    api.OS.getUnitsOfDep(Id)
      .then((resData)=>{
        loaderHandler.hideLoader();
        this.setState({
          DepData:this.state.DepData.cloneWithRows(resData.Data.Deps),
          nodata:false,
          ishave:true
        });
        if(resData.Data&&resData.Data.length<=5){
          this.refs.list.scrollTo({x:0,y:0,animated:false});
        }

      })
  }
  depitem(item){
    this.fetchData(item.Id);
    if(this.state.ishave){
      this.state.menuItem.push(item);
      this.setState({
        menuData:this.state.menuData.cloneWithRows(this.state.menuItem),
      });
    }

  }
  allItem(item){
    return (
      <Cell item={item}/>
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
      <View style={{flex:1}}>
        <View style={styles.searchViews}>
          <View style={styles.seachView}>
            <TextInput
              underlineColorAndroid='transparent'
              placeholder=" 关键字"
              textAlignVertical='center'
              onChangeText={(text) => this.setState({keywords: text})}
              style={{paddingLeft:10,width:Dimensions.get('window').width*0.80}}
              />
            <Icon
              name="search"
              size={20}
              color="#5D5B5B"
              onPress={this.searchDepItem.bind(this)}
              style={{marginRight:10}}
              />
          </View>

        </View>
        <View style={{backgroundColor:'#dddddd',flexDirection: 'row',padding:10}}>
          <TouchableOpacity onPress={this.selectDep.bind(this,null,-1)}>
            <Text style={{color:'black',fontSize:16}}>全公司></Text>
          </TouchableOpacity>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              this.state.menuItem&&this.state.menuItem.map((item,index)=>{
                return(
                  <TouchableOpacity key={index} onPress={this.selectDep.bind(this,item.Id,index)}>
                    <Text style={{color:'black',fontSize:16}}>{item.Name}></Text>
                  </TouchableOpacity>
                )
              })
            }
            </ScrollView>
        </View>
        <ScrollView>
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
            </View>:
            <ListView
              ref="list"
              dataSource={this.state.DepData}
              renderRow={this.allItem.bind(this)}
              style={{backgroundColor: 'white',flex:1}}
              />
            }
          </View>
        </ScrollView>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

