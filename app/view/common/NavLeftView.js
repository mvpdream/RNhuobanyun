'use strict';

import React, {Component} from 'react'
import {
   Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';


export default class NavLeftView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      haveTitle:this.props.leftTitle==""?false:true
    }
  }
  render(){
    return(
      <View style={styles.navLeftBtn}>
        <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={this.props.backFun==null?() => {this.props.nav.pop()}:this.props.backFun}>
          <Icons
            name="md-arrow-round-back"
            size={30}
            color="white"
            />
        </TouchableOpacity>
        {
          this.state.haveTitle?<Text numberOfLines={1} style={styles.navLeftText}>{this.props.leftTitle}</Text>:<Text/>
        }
      </View>
    )
  }
};

