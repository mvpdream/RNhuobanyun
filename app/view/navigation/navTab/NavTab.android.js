'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  DrawerLayoutAndroid,
  Dimensions,
  ListView,
  TouchableNativeFeedback,
  TouchableOpacity
} = React;
var styles = require("./style");
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../../network/ApiHelper";
var DRAWER_WIDTH_LEFT = 80;
var {height, width} = Dimensions.get('window');
/**
 * 侧边滑出导航栏
 */
var NavTab = React.createClass({
  getInitialState: function() {
    var nav = this.props.nav;
    var navItems=[
      {title:"信息", icon:'comments',     onSelect:()=>{nav.immediatelyResetRouteStack([{id: 'AllActivities'}]);}},
      //{title:"任务", icon:'tasks', onSelect:()=>{nav.popToTop(); nav.replace({id: 'IssuesList'});}   },
      //{title:"项目", icon:'flask',      onSelect:()=>{nav.popToTop(); nav.push({id: 'Blog'});}},
      {title:"汇报", icon:'table',      onSelect:()=>{nav.immediatelyResetRouteStack([{id: 'ReportMain'}]);}},
      //{title:"审批", icon:'edit',      onSelect:()=>{nav.popToTop(); nav.push({id: 'ReportMain'});} },
      //{title:"文库", icon:'folder',      onSelect:()=>{nav.popToTop(); nav.push({id: 'ReportMain'});}},
      {title:"通讯录", icon:'user',      onSelect:()=>{nav.immediatelyResetRouteStack([{id: 'AddressBook'}]);}},
      {title:"个人中心", icon:'cog',      onSelect:()=>{nav.immediatelyResetRouteStack([{id: 'UserCenterMain'}]);}},
    ];
    var dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});
    return {
      dataSource: dataSource.cloneWithRows(navItems),
    };
  },

  renderSideNavHeader: function() {
    var UserData=api.User.getCurrentUser();
    return (
      <View style={styles.userInfo}>
        <Image
            source={{uri:UserData.Avatar}}
            style={{width: 65,height: 65,borderRadius:90}}
            />
        <TouchableOpacity
          onPress={()=>{this.props.nav.replace({id: 'UserCenterMain'});}}>
          <View style={{flex:1,padding:12}}>
            <Text style={{fontSize:16,color:'white'}}>{UserData.Name}</Text>
            <Text style={{fontSize:14,color:'white',marginTop:6}}>{UserData.CompanyShortName}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },

  renderSideNavItem: function(item) {
    return (
      <View style={{borderTopColor: '#dddddd',borderTopWidth: 1}}>
        <TouchableOpacity
          onPress={item.onSelect}>
          <View style={styles.sideNavItem}>
            <Icon
              name={item.icon}
              size={18}
              color='#3b5998'
              style={{width: 20, height: 20,marginLeft:6}}
            />
            <Text style={{fontSize: 18, marginLeft: 12}}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },

  renderSideNav: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderSideNavItem}
        renderHeader={this.renderSideNavHeader}
        style={{flex:1, backgroundColor: 'white'}}
      />
    )
  },

  openNavDrawer: function () {
    this.refs['drawer'].openDrawer();
  },

  render: function () {
    return (
      <DrawerLayoutAndroid
        ref={'drawer'}
        drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
        keyboardDismissMode="on-drag"
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this.renderSideNav}>
        <View style={{flex: 1}}>
          {this.props.children}
        </View>
      </DrawerLayoutAndroid>
    );
  }
});


module.exports = NavTab;
