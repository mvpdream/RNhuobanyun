import React, { Component } from 'react';
import {
 Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  ScrollView,
  TouchableHighlight,
  Dimensions
  } from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
import api from "../../network/ApiHelper";
var dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');

export default class ReportList extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      day: 0,
      remind: [],
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      reportList: dataSource.cloneWithRows({}),
      reportUserId:this.props.userId
    };
  };
    componentDidMount() {
    if (this.props.userId != 0) {
      loaderHandler.showLoader("加载中...");
      this.fetchData(this.props.reportType, this.props.userId, this.state.month, this.state.year);
    }
  }
    startLoad(subordinateId) {
    this.setState({reportUserId: subordinateId});
    this.fetchData(this.props.reportType, subordinateId, this.state.month, this.state.year)
  }
  fetchData(type, subordinateId, month, year) {
    if (subordinateId != null) {
      api.Report.getReportListByUser(subordinateId, type, year, month)
        .then((resData)=> {
          loaderHandler.hideLoader();
          if (resData.Type == 1) {
            this.setState({
              reportList: dataSource.cloneWithRows(resData.Data)
            });
          } else {
            ToastAndroid.show("未知错误",ToastAndroid.SHORT)
          }

        })
    }
  };
  reportdetail(Id,type){
    var reportItem = {
      Id:Id,
      type:type,
      typeName:"subordinate",
      userId:this.props.userId,
      username:this.props.username
    };
    this.props.nav.push({
      id: 'ReportDetail',
      reportItem: reportItem
    });

  };
  reportdetail(Id, type) {
    var reportItem = {
      Id: Id,
      type: type,
      typeName: "subordinate",
      userId: this.props.userId,
      username: this.props.username
    };
    this.props.nav.push({
      id: 'ReportDetail',
      reportItem: reportItem
    });

  };

  reportItem(type, item, sectionId, rowId) {
    var dateType = "";
    switch (type) {
      case 0:
        dateType = "号";
        break;
      case 1:
        dateType = "周";
        break;
      case 2:
        dateType = "月";
        break;
      default:
        break;
    }
    var Submitted = "";
    var IsTemp = "";
    if (!item.Submitted) {
      Submitted = "未提交"
    }
    else {
      if (item.IsTemp) {
        IsTemp = "暂存"
      }
      else {
        Submitted = "已提交"
      }
    }

    return (
      this.props.userId != 0 && item.Submitted ?
        <TouchableOpacity onPress={this.reportdetail.bind(this, item.Id, type)}>
          <View style={[item.Highlight ? styles.dailyReportItems : styles.dailyReportItem]}>
            <Text
              style={styles.text}>{`${+rowId + 1} ${dateType}${item.Description}`} {IsTemp} {Submitted}</Text>
          </View>
        </TouchableOpacity>
        : item.Writable ? <TouchableOpacity onPress={()=> {
          ToastAndroid.show("没有相关的汇报数据",ToastAndroid.SHORT)
      }}>
        <View style={[item.Highlight ? styles.dailyReportItems : styles.dailyReportItem]}>
          <Text
            style={styles.text}>{`${+rowId + 1} ${dateType}${item.Description}`} {IsTemp} {Submitted}</Text>
        </View>
      </TouchableOpacity> : <View style={[item.Highlight ? styles.dailyReportItems : styles.dailyReportnoItem]}>
        <Text
          style={styles.text}>{`${+rowId + 1} ${dateType}${item.Description}`}</Text>
      </View>

    );


  };

  last(type) {
    if (this.state.reportUserId == 0) {
      ToastAndroid.show("请先选择下属进行查看！",ToastAndroid.SHORT)
      return;
    }
    var year = this.state.year;
    if (type == 2) {
      var year = this.state.year - 1;
      this.setState({
        year: year,
      });
    }
    else {
      var month = this.state.month - 1;
      this.setState({month});
      if (month < 1) {
        var year = this.state.year - 1;
        this.setState({
          year: year,
          month: 12,
        });
      }
    }
    this.fetchData(type, this.state.reportUserId, month, year);

  }

  next(type) {
    if (this.state.reportUserId == 0) {
      ToastAndroid.show("请先选择下属进行查看！",ToastAndroid.SHORT);
      return;
    }
    var year = this.state.year;
    if (type == 2) {
      var year = this.state.year + 1;
      this.setState({
        year: year,
      });
    }
    else {
      var month = this.state.month + 1;
      this.setState({month});
      if (month > 12) {
        var year = this.state.year + 1;
        this.setState({
          year: year,
          month: 1
        });
      }
    }
    this.fetchData(type, this.state.reportUserId, month, year);
  }
  render()
  {
    return (
      <View style={{flex:1}}>
              <View style={styles.container}>
                <View style={styles.containers}>
                  <View style={styles.changedateView}>
                    <TouchableHighlight  style={styles.changeDateIcon} onPress={this.last.bind(this,this.props.reportType)} underlayColor="#CAC9C9" >
                      <View>
                        <Icon name="angle-left" size={35} color="#3C3B3B"/>
                      </View>
                    </TouchableHighlight >
                    <View style={{justifyContent: 'center', flex: 1,marginTop:13}}>
                      {
                        this.props.reportType==2?
                          <Text style={styles.yearText}>{this.state.year}年</Text>:
                          <Text style={styles.yearText}>{this.state.year}年
                            {this.state.month}月</Text>
                      }
                    </View>
                    <TouchableHighlight  style={styles.changeDateIcon} onPress={this.next.bind(this,this.props.reportType)} underlayColor="#CAC9C9" >
                      <View>
                        <Icon name="angle-right" size={35} color="#3C3B3B"/>
                      </View>
                    </TouchableHighlight >
                  </View>
                  <View style={{flex:1}}>
                    <ListView
                     removeClippedSubviews={false}
                        enableEmptySections={true}
                      dataSource={this.state.reportList}
                      renderRow={this.reportItem.bind(this,this.props.reportType)}
                      />
                    <BusyIndicator bgColor="transparent" color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#6d6d6d' textColor='white' />
                  </View>
                </View>
              </View>
          </View>

    );
  }
}
