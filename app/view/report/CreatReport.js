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
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
var Dimensions = require('Dimensions');
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navigation-bar';
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
      weekList: dataSource.cloneWithRows({})
    };
  }

;
  componentDidMount() {
    this.getUserrule();
   this.refs.dailyLists.startLoad(0);
    this.refs.weekLists.startLoad(0);
    this.refs.monthLists.startLoad(0);
  }

  getUserrule() {
    api.Report.getTasterAndRules()
      .then((resData)=> {
        this.setState({
          remind: resData.remind
        });
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
  var toolbarActions = [
    {title: '查看规则', show: 'always'},
  ];
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
      <NavToolbar
        navIconName={"android-arrow-back"}
        title={'写汇报'}
        actions={toolbarActions}
        onActionSelected={this.getRules.bind(this)}
        onClicked={() => {this.props.nav.pop()}}/>
      <ScrollableTabView
        tabBarBackgroundColor='white'
        tabBarUnderlineColor='#3A83E1'
        tabBarActiveTextColor='#3A83E1'
        initialPage={this.props.type==null?0:this.props.type}>
        <View
          tabLabel="日报"
          style={{flex: 1,backgroundColor:'#ECEFF1'}}
          >
          {
            this.state.remind.daytime == ""
              ?
              <View style={styles.norView}>
                {noruleView}
              </View>
              : <ReportList
              ref='dailyLists'
              userId={0}
              nav={this.props.nav} reportType={0} />
          }
        </View>


        <View
          tabLabel="周报"
          style={{flex:1,backgroundColor:'#ECEFF1'}}
          >
          {
            this.state.remind.weektime == ""
              ?
              <View style={styles.norView}>
                {noruleView}
              </View>
              : <ReportList ref='weekLists' userId={0} nav={this.props.nav} reportType={1} />
          }

        </View>

        <View
          tabLabel="月报"
          style={{flex: 1,backgroundColor:'#ECEFF1'}}
          >
          {
            this.state.remind.monthtime == ""
              ?
              <View style={styles.norView}>
                {noruleView}
              </View>
              : <ReportList userId={0} ref='monthLists' nav={this.props.nav} reportType={2} />
          }

        </View>

      </ScrollableTabView>

    </View>

  );
}
}
