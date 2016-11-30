import React, { Component } from 'react';
import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
  ListView,
  ScrollView,
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

class Cell extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      submitted: this.props.item.Submitted,
      isTemp: this.props.item.IsTemp
    };
  }

  updateStates(submitted, isTemp, id) {
    this.props.item.Submitted = submitted;
    this.props.item.IsTemp = isTemp;
    if (id != null && id != 0) {
      this.props.item.Id = id;
    }
    this.forceUpdate();
    //this.setState({submitted:submitted,isTemp:isTemp});
  }

  submitReport(dateTarget, type, Id) {
    var reportItemm = {
      Id: Id,
      dateTarget: dateTarget,
      type: type,
      submitted: this.props.item.Submitted,
      isTemp: this.props.item.IsTemp
    };

    this.props.nav.push({
      id: 'SubmitReport',
      reportItems: reportItemm,
      updateState: (submitted, isTemp, id)=> {
        this.updateStates(submitted, isTemp, id)
      }
    });
  };

  render() {
    var item = this.props.item;
    var type = this.props.type;
    var rowId = this.props.rowId;
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
    if (!this.props.item.Submitted) {
      Submitted = "未提交"
    }
    else {
      if (this.props.item.IsTemp) {
        IsTemp = "暂存"
      }
      else {
        Submitted = "已提交"
      }
    }
    return (
      item.Writable ?
        <TouchableOpacity onPress={this.submitReport.bind(this, item.DateTarget, type, this.props.item.Id)}>
          <View style={[item.Highlight ? styles.dailyReportItems : styles.dailyReportItem]}>
            <Text
              style={styles.text}>{`${+rowId + 1} ${dateType}${item.Description}`} {IsTemp} {Submitted}</Text>
          </View>
        </TouchableOpacity>
        :
        <View style={[item.Highlight ? styles.dailyReportItems : styles.dailyReportnoItem]}>
          <Text
            style={styles.text}>{`${+rowId + 1} ${dateType}${item.Description}`}</Text>
        </View>

    );
  }
}
export default class MyReportList extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      day: 0,
      remind: [],
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      reportList: dataSource.cloneWithRows({}),
      isFetch:false,
      reportUserId:0
    };
  };
  componentDidMount() {
    loaderHandler.showLoader("加载中...");
      this.fetchData(this.props.reportType, 0, this.state.month, this.state.year);
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
          }
        })
    }
  };

  reportItem(type, item, sectionId, rowId) {
    return(<Cell item={item} nav={this.props.nav} rowId={rowId} type={type}/>)
  };
   last(type) {
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
                    <TouchableHighlight style={styles.changeDateIcon} onPress={this.next.bind(this,this.props.reportType)} underlayColor="#CAC9C9">
                      <View style={styles.changeDateIcon}>
                        <Icon name="angle-right" size={35} color="#3C3B3B" />
                      </View>
                    </TouchableHighlight>
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
