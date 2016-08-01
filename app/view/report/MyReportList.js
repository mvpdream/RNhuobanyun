/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
  ListView,
  ScrollView,
  Component
  } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
var Dimensions = require('Dimensions');
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navigation-bar';
import ReportRules from './ReportRules';
import api from "../../network/ApiHelper";
var dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});

class Cell extends Component {
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {
    submitted:this.props.item.Submitted,
      isTemp:this.props.item.IsTemp
    };
  }
  updateStates(submitted,isTemp,id){
    this.props.item.Submitted=submitted;
    this.props.item.IsTemp=isTemp;
    if(id!=null&&id!=0){
      this.props.item.Id=id;
    }
    this.forceUpdate();
    //this.setState({submitted:submitted,isTemp:isTemp});
  }
  submitReport(dateTarget,type,Id) {
    var reportItemm = {
      Id:Id,
      dateTarget: dateTarget,
      type: type,
      submitted:this.props.item.Submitted,
      isTemp:this.props.item.IsTemp
    };

    this.props.nav.push({
      id: 'SubmitReport',
      reportItems: reportItemm,
      updateState:(submitted,isTemp,id)=>{this.updateStates(submitted,isTemp,id)}
    });
  };
  render() {
    var item=this.props.item;
    var type=this.props.type;
    var rowId=this.props.rowId;
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
    var Submitted="";
    var IsTemp="";
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
        item.Writable?
        <TouchableOpacity onPress={this.submitReport.bind(this,item.DateTarget,type,this.props.item.Id)}>
          <View style={[item.Highlight?styles.dailyReportItems:styles.dailyReportItem]}>
            <Text
              style={styles.text}>{`${+rowId + 1} ${dateType}${item.Description}`} {IsTemp} {Submitted}</Text>
          </View>
        </TouchableOpacity>
        :
        <View style={[item.Highlight?styles.dailyReportItems:styles.dailyReportnoItem]}>
          <Text
            style={styles.text}>{`${+rowId + 1} ${dateType}${item.Description}`}</Text>
        </View>

    );
  }
}
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
      isFetch:false
    };
  };
  startLoad(subordinateId){
    this.setState({reportUserId:subordinateId});
    this.fetchData(this.props.reportType,subordinateId)
  }
  fetchData(type,subordinateId) {
    if(subordinateId!=null){
      api.Report.getReportListByUser(subordinateId, type, this.state.year, this.state.month)
        .then((resData)=> {
          debugger;
          if(resData.Type==1){
            this.setState({
              isFetch:true,
              reportList: dataSource.cloneWithRows(resData.Data)
            });
          }

        })
    }


  }

;

  reportItem(type, item, sectionId, rowId) {
    return(<Cell item={item} nav={this.props.nav} rowId={rowId} type={type}/>)
  };
  last(type)
  {
    if (type == 2) {
      this.setState({
        year: this.state.year - 1,
      });
    }
    else {
      this.setState({
        month: this.state.month - 1,
      });
      if (this.state.month < 1) {
        this.setState({
          year: this.state.year - 1,
          month: 12,
        });
      }
    }
    this.fetchData(type,this.state.reportUserId);
  }
  next(type)
  {

    if (type == 2) {
      this.setState({
        year: this.state.year + 1,
      });
    }
    else {
      this.setState({
        month: this.state.month + 1
      });
      if (this.state.month > 12) {
        this.setState({
          year: this.state.year + 1,
          month: 1
        });
      }
    }
    this.fetchData(type,this.state.reportUserId);
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
                  <ListView
                    dataSource={this.state.reportList}
                    renderRow={this.reportItem.bind(this,this.props.reportType)}
                    />
                </View>
              </View>
          </View>

    );
  }
}
