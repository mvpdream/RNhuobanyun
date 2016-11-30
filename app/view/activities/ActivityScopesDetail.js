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
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'


export default class ActivityScopesDetail extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      UserData: [],
      isFetch: false,
      userCount: 0
    };
  }

;
  componentDidMount() {
    var Id = this.props.activityId;
    api.Activity.getActivityScopes(Id)
      .then((resData)=> {
        if (resData.Type == 1) {
          this.setState({
            isFetch: true,
            UserData: resData.Data.Users,
            dataSource: this.state.dataSource.cloneWithRows(resData.Data.Users),
            userCount: resData.Data.Users.length
          });
        }
      })
  }

;
  renderUser(User) {
    return (
      <View style={styles.voteorreceView}>
        <View style={styles.voteorreceViews}>
          <View style={styles.voteorreceViewss}>
            <Image
              source={{uri:User.Avatar}}
              style={styles.itemUserimgs}
              />
            <Text style={[styles.nomText,{marginLeft:10}]}>{User.Name}</Text>
          </View>
        </View>
      </View>
    );
  }

;
  render() {

    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
          <NavLeftView nav={this.props.nav} leftTitle="发送范围详情"/>
                   }/>
        <View style={{flex:1}}>
          {this.state.isFetch && this.state.UserData.length == 0 ? <View style={styles.noruleViewV}>
            <Icon
              name="exclamation-circle"
              size={50}
              color="#717171"
              />
            <Text style={styles.noruleViewText}>暂无相关数据</Text>
          </View> : <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderUser.bind(this)}
            style={{backgroundColor:'#ECEFF1'}}
            />}
        </View>
        <View style={{padding:12,borderTopColor: '#ECEFF1',borderTopWidth: 1,}}>
          <Text style={{color:'black',fontSize:16}}>共{this.state.userCount}人</Text>
        </View>
      </View>
    );
  }
};

