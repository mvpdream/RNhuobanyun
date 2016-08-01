'use strict';

import React, {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  TextInput,
  ScrollView,
  Alert
  } from 'react-native';
var Dimensions = require('Dimensions');
import styles from "./style";
var {height, width} = Dimensions.get('window');
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';


export default class LoaderView  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startLoader:false
    }
  }
  startLoader(){
    this.setState({startLoader:true})
  }
  finishLoader(){
    this.setState({startLoader:false})
  }
  render() {
    return (
      this.state.startLoader?
        <View style={styles.loaderContainer}>
          <View style={styles.loaderOverlay}>
            <Bars size={10} color="#EFF3F5" />
            <Text style={{color:"white"}}>正在上传</Text>
          </View>
        </View>:<View />
    )
  }
};

