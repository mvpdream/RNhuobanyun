'use strict';

import React, {
  Text,
  View
  } from 'react-native';
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');


export default class ZanNumView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorNum:-1,
      isFavored:false,
      favorFlag:false
    }
  }
  getnum(num){
    this.setState({favorNum:num})
  }
  getIsFavor(isf){
    if(isf!=null){
      this.setState({favorFlag:true,isFavored:isf})}
  }
  render(){
    if(!this.state.favorFlag){
      this.state.isFavored=this.props.isfav;
    }
    return(
      <View style={{alignItems: 'center',flexDirection: 'row'}}>
        <Icon
          name="thumbs-up"
          size={17}
          color={this.state.isFavored?'#FCC44D':'#175898'}
          style={{marginLeft:5,marginRight:5}}
          />
        <Text  style={[styles.nomText,{paddingRight:5}]}>赞
          <Text ref='favorUser' style={styles.countNum}>{this.state.favorNum==-1?this.props.favorData.length:this.state.favorNum}</Text>
        </Text>
      </View>

    )
  }
};

