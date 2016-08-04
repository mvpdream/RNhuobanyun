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
  ToastAndroid,
  ListView,
  ScrollView
  } from 'react-native';
import styles from "./style";
var Dimensions = require('Dimensions');
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
import Icons from 'react-native-vector-icons/Ionicons';
import ReportRules from './ReportRules';
import api from "../../network/ApiHelper";
import ReportList from './MyReportList.js'
var dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});

export default class CreatReport extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      day: 0,
      remind: [],
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      dayList: dataSource.cloneWithRows({}),
      monthList: dataSource.cloneWithRows({}),
      weekList: dataSource.cloneWithRows({}),
      isFetch:false
    };
  }

;
  componentDidMount() {
    this.getUserrule();
  }

  getUserrule() {
    api.Report.getTasterAndRules()
      .then((resData)=> {
        this.setState({
          remind: resData.remind
        });
        this.setState({isFetch:true})
      })
  }

  getRules() {
    this.props.nav.push({
      id: 'ReportRules'
    });
  }

;
render()
{
  var noruleView = (
    <View style={styles.noruleViewV}>
      <Icon
        name="exclamation-circle"
        size={50}
        color="#717171"
        />
      <Text style={styles.noruleViewText}>暂无相关规则</Text>
    </View>
  );
  return (
    <View style={{flex:1}}>
      <NavigationBar
        style={{height: 55,backgroundColor:'#175898'}}
        leftButton={
                     <View style={styles.navLeftBtn}>
                     <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={() => {this.props.nav.pop()}}>
                        <Icons
                          name="android-arrow-back"
                          size={28}
                          color="white"
                          onPress={() => {this.props.nav.pop()}}
                        />
                         </TouchableOpacity>
                         <Text numberOfLines={1} style={styles.navLeftText}>写汇报</Text>
                     </View>
                   }
        rightButton={

                   <TouchableOpacity style={{marginRight:10,justifyContent: 'center'}} onPress={this.getRules.bind(this)}>
                    <Text numberOfLines={1} style={styles.rightNavText}>查看规则</Text>
                      </TouchableOpacity>
                    } />
      <ScrollableTabView
        tabBarBackgroundColor='white'
        tabBarUnderlineColor='#3A83E1'
        tabBarActiveTextColor='#3A83E1'>
        <View
          tabLabel="日报"
          style={{flex: 1,backgroundColor:'#ECEFF1'}}
          >
          {
            this.state.isFetch?this.state.remind.daytime == ""
              ?
              <View style={styles.norView}>
                {noruleView}
              </View>
              : <ReportList
              ref='dailyLists'
              userId={0}
              nav={this.props.nav} reportType={0} />:null
          }
        </View>


        <View
          tabLabel="周报"
          style={{flex:1,backgroundColor:'#ECEFF1'}}
          >
          {

            this.state.isFetch?this.state.remind.weektime == ""
              ?
              <View style={styles.norView}>
                {noruleView}
              </View>
              : <ReportList ref='weekLists' userId={0} nav={this.props.nav} reportType={1} />:null
          }

        </View>

        <View
          tabLabel="月报"
          style={{flex: 1,backgroundColor:'#ECEFF1'}}
          >
          {
            this.state.isFetch?this.state.remind.monthtime == ""
              ?
              <View style={styles.norView}>
                {noruleView}
              </View>
              : <ReportList userId={0} ref='monthLists' nav={this.props.nav} reportType={2} />:null
          }

        </View>

      </ScrollableTabView>

    </View>

  );
}
}
