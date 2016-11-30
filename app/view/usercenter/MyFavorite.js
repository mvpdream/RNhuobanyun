import React, {Component} from 'react'
import {
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
  Dimensions
} from 'react-native';

import styles from "./style";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
import ActivitiesList from '../activities/ActivitiesList.js'
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
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
            style={styles.NavSty}
            leftButton={
            <NavLeftView nav={this.props.nav} leftTitle="我赞过的"/>
                    }/>
          <ActivitiesList  nav={this.props.nav} actType={128}/>
        </View>

      );
    }
  }

;

