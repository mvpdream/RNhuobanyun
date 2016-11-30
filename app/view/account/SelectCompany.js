import React, {Component} from 'react'
import {
    Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  PullToRefreshViewAndroid,
  Alert,
  Dimensions
} from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icon from 'react-native-vector-icons/Ionicons';
import api from "../../network/ApiHelper";
import CompanyCell from "./CompanyCell.js"
import _ from "lodash";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

export default class SelectCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resData: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

;
  componentDidMount() {
    loaderHandler.showLoader("加载中");
    api.Company.getCompanyList()
      .then((resDate)=> {
       loaderHandler.hideLoader();
        if(resDate.Type==1){
          this.setState({
            resData: resDate.Data,
            dataSource: this.state.dataSource.cloneWithRows(resDate.Data)
          });
        }else{
          ToastAndroid.show("获取列表失败！请重试",ToastAndroid.SHORT);
        }

      })
  }


  companyRender(item) {
    return (
      <CompanyCell
        comData={item}
        deleteAction={callb=>this.deleteAction(item,callb)}
        onSelect={() => this.selectAction(item)}
        />
    );

  }

;
  selectAction(item) {
    var userid = item.Id;
    api.Company.enterCompany(userid)
      .then((resData)=> {
        if (resData.Type != 1) {
          ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
        }
        else {
          this.props.nav.immediatelyResetRouteStack([{id:'MainTabView'}]);
        }
      })
  };

  creatCompany() {
    this.props.nav.push({
      id: 'CreatCompany'
    });
  };

  joinCompany() {
    this.props.nav.push({
      id: 'JoinCompany'
    });
  };

  //撤销申请
  deleteAction(item, callb) {
     Alert.alert(
          '提示',
          '是否撤销该申请？',
          [
            {text: '取消'},
            {
              text: '确定', onPress: () => {
               this.cancelApply(item, callb)
            }
            }
          ]
        );
  };

  //取消
  cancelAction(item, callb) {
    callb && callb();
  }

;
  cancelApply(item, callb) {
    var userid = item.Id;
    var currentData = this.state.resData;
    api.Company.cancelApply(userid)
      .then((resData) => {
        if (resData.Type && resData.Type == 1) {
          callb && callb();
          ToastAndroid.show("撤销成功",ToastAndroid.SHORT);
          if (currentData && currentData.length > 0 && !!item) {
            let tempIds = _.pluck(currentData, 'Id'),
              _index = tempIds.indexOf(item['Id'])
              ;
            if (_index > -1) {
              currentData.splice(_index, 1);
              var temp = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
              this.setState({
                dataSource: temp.cloneWithRows(currentData)
              });
            }
          }

        }
        else {
          callb && callb();
          ToastAndroid.show("撤销失败",ToastAndroid.SHORT);
        }
      })
  }

;
  render() {
    return (
      <View style={styles.recontainer}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
              <NavLeftView nav={this.props.nav} leftTitle="选择企业"/>
          }/>
        <View style={styles.rescontainer}>
          <View style={{flexDirection:'row',flex:1,paddingTop:10}}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.companyRender.bind(this)}
              />
          </View>
          <View
            style={{flexDirection:'row',justifyContent: 'center',backgroundColor:'#dddddd',borderColor: '#B1B0B0',borderWidth: 1,}}>
            <TouchableOpacity style={styles.companyTous} onPress={this.creatCompany.bind(this)}>
              <View style={styles.selcompbutton}>
                <Text style={{fontSize:16,color:'white'}}>创建企业</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.companyTous} onPress={this.joinCompany.bind(this)}>
              <View style={styles.selcompbutton}>
                <Text style={{fontSize:16,color:'white'}}>加入企业</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    )
  }

;

}
