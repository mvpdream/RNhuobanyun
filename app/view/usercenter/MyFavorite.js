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
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
var Dimensions = require('Dimensions');
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import ActivitiesList from '../activities/ActivitiesList.js'

export default class MyFavorite extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
    };
    };
    componentDidMount(){
    };

    render()
    {
      return (
        <View style={styles.containersw}>
          <NavToolbar
            navIconName={"android-arrow-back"}
            title={'我赞过的'}
            onClicked={() => {this.props.nav.pop();}}
            />
          <ActivitiesList  nav={this.props.nav} actType={128}/>
        </View>

      );
    }
  }

;

