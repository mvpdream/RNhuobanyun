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
  ScrollView,
  Dimensions
} from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icons from 'react-native-vector-icons/Ionicons'
import PinYinUsers from './PinYinUsers'
import DepUsers from './DepUsers'
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
var selectUserItem=[];
var selectDepItem=[];
var that;
var navTitle="";
var newarr=[];
var routeArr=[];

class BottomView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: ""
    }
  }

  setItems(selectedItem) {
    this.setState({
      selectedItems: selectedItem.map((item)=> {
        return item.Name
      }).join(',')
    });
  }
  finishadd(){
    that.props.selectorConfig.getselectorItem(newarr);
    that.props.nav.pop();
  }

  render() {
    return (
      <View
        style={{backgroundColor:'#dddddd',justifyContent: 'space-between',alignItems: 'center',flexDirection: 'row',padding:10}}>
        <ScrollView>
        <View style={{paddingLeft:8}}>
          <Text ref='bottomView' style={{color:'black',fontSize:15}}>已选择：{this.state.selectedItems}</Text>
        </View>
        </ScrollView>
        <View style={{paddingRight:10}}>
          <TouchableOpacity onPress={this.finishadd} style={{backgroundColor:'#175898',padding: 10,borderRadius: 8}}>
            <Text style={{color:'white',fontSize:14}}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

;
}
export default class SelectorMain extends React.Component {
  /*
  * 选择器配置
  * 类型(selectorType) 用户0 部门1 混合2
  * 选择(selectorRadio) 单选0 多选1
  * 回调(getselectorItem) 返回选择的值
  */
  constructor(props) {
    super(props);
    const nav = this.props.nav;

    this.state = {
      selectorConfig:this.props.selectorConfig,

    };
    switch(this.props.selectorConfig.selectorType){
      case 0:
        navTitle="用户选择器";
        break;
      case 1:
        navTitle="部门选择器";
        break;
      case 2:
        navTitle="用户&部门选择器";
        break;
    }
    that=this;
  };
  componentDidMount() {
    newarr=[];
    selectUserItem=[];
    selectDepItem=[];
  };
  userItem(selectedUserItem,selectedDepItem) {
    if(selectedUserItem!=null&&selectedUserItem.length>0){
      selectUserItem=selectedUserItem;
    }
    if(selectedDepItem!=null&&selectedDepItem.length>0){
      selectDepItem=selectedDepItem;
    }
    newarr = selectUserItem.concat(selectDepItem );
    this.refs['bottomView'].setItems(newarr);
  };

  render() {
    var selectorConfig=this.state.selectorConfig;
    return (
        <View style={{flex:1}}>
          <NavigationBar
            style={styles.NavSty}
            leftButton={
            <NavLeftView nav={this.props.nav} leftTitle={navTitle}/>
         }/>
          {
            selectorConfig.selectorType==2
            ? <ScrollableTabView>
            <PinYinUsers tabLabel='按拼音查看'
                         selectorRadio={selectorConfig.selectorRadio}
                         callback={this.userItem.bind(this)}
                         nav={this.props.nav}/>
            <DepUsers tabLabel='按部门查看' selectorRadio={selectorConfig.selectorRadio} callback={this.userItem.bind(this)} nav={this.props.nav}/>
          </ScrollableTabView> :
            selectorConfig.selectorType==0? <PinYinUsers selectorRadio={selectorConfig.selectorRadio} callback={this.userItem.bind(this)} nav={this.props.nav}/>
              : <DepUsers selectorRadio={selectorConfig.selectorRadio} callback={this.userItem.bind(this)} nav={this.props.nav}/>
          }
          <BottomView ref="bottomView" selectedItems={this.state.selectItems}/>
        </View>
    );
  }

;
};

