'use strict';
import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  Dimensions,
  ToastAndroid
} from 'react-native';
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
var Modal = require('react-native-modalbox');

export default class UpdateView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false
    }
  }
  openModal(){
    this.setState({
      open:true
    })
  }
  cancelUpdate(){
    this.setState({
      open:false
    })
  }
  confirmUpdate(){
    let url=this.props.downloadAddress;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        ToastAndroid.show("链接打开失败，请重试",ToastAndroid.SHORT);
      } else {
        this.setState({
          open:false
        });
        setTimeout(()=>{return Linking.openURL(url);},300)
      }
    }).catch(err => ToastAndroid.show("发生未知错误",ToastAndroid.SHORT));
  }

  render() {
    return (
      <Modal style={styles.modal}
             position={"center"}
             isOpen={this.state.open}
             ref={"modal"}
             isDisabled={false}
             swipeToClose={false}
             backdropPressToClose={false}>
        <View style={styles.modalTitleView}>
          <Text style={styles.updateText}>软件更新提示</Text>
          <Text style={[styles.versioNumText,{marginTop:6}]}>版本:{this.props.versionNum}</Text>
        </View>

        <View style={styles.contentView}>
          <ScrollView>
          <Text style={styles.updateContent}>{this.props.description}</Text>
            </ScrollView>
        </View>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.btnContainer} onPress={this.cancelUpdate.bind(this)} activeOpacity={0.5}>
            <View style={styles.btnContainer}>
              <View style={styles.btnView}>
                <Text style={[styles.btnText,{color:'gray'}]}>下次再说</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnContainer} onPress={this.confirmUpdate.bind(this)} activeOpacity={0.5}>
            <View style={styles.btnContainer}>
              <View style={[styles.btnView,{backgroundColor:'#175898',borderColor: '#175898'}]}>
                <Text style={[styles.btnText,{color:'white'}]}>立即更新</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

    )
  }
};

