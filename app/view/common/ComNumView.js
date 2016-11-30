'use strict';
import React, {Component} from 'react'
import {
  Text
} from 'react-native';


import styles from "./style";


export default class ComNumView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentsNum:-1
    }
  }
  getnum(num){
    this.setState({commentsNum:num})
  }
  render(){
    return(
      <Text style={styles.countNum}>{this.state.commentsNum==-1?this.props.favorData.length:this.state.commentsNum}</Text>
    )
  }
};

