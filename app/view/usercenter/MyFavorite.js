/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
  Image,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  } from 'react-native';
import styles from "./style";
var Dimensions = require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import ActivitiesList from '../activities/ActivitiesList.js'
import NavigationBar from 'react-native-navbar';
import Icons from 'react-native-vector-icons/Ionicons'

export default class MyFavorite extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {};
  };

    render()
    {
      return (
        <View style={styles.containersw}>
          <NavigationBar
            style={{height: 55,backgroundColor:'#175898'}}
            leftButton={
                    <View style={styles.navLeftBtn}>
                          <Icons
                            name="android-arrow-back"
                            size={28}
                            style={{marginLeft:20,paddingRight:20}}
                            color="white"
                            onPress={() => {this.props.nav.pop()}}
                          />
                        <Text style={styles.rightNavText}>我赞过的</Text>
                       </View>
                    }/>
          <ActivitiesList  nav={this.props.nav} actType={128}/>
        </View>

      );
    }
  }

;

