'use strict';
import React, {Component} from 'react';
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
  Alert,
  Dimensions
} from 'react-native';
import api from "../../network/ApiHelper";
import styles from "../common/style";
import Icon from 'react-native-vector-icons/Ionicons';
var msg = "";

export default class TaskLogs extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {

    }
  }

  componentDidMount() {
  }

  render() {
    var item = this.props.logsList;
    return (
      item && item.length > 0 ?
        <View style={{flex: 1}}>
          <View style={this.props.commView == null ? styles.commView : this.props.commView}>
            {
              item && item.map((commentsitem, index)=> {
                return (
                  <View key={index} style={this.props.style == null ? styles.commentView : this.props.style}>
                    <View style={styles.comView1}>
                      <View style={styles.comView}>
                        <Image
                          source={{uri: commentsitem.Avatar}}
                          style={styles.itemUserimgs}
                        />
                        <Text style={[styles.nomText, {marginLeft: 5}]}>{commentsitem.Name}</Text>
                      </View>
                      <View>
                        <Text style={styles.dateText}>{commentsitem.DateCreated}</Text>
                      </View>
                    </View>
                    <View style={this.props.comParBody == null ? styles.comParBody : this.props.comParBody}>
                        <View style={this.props.comBody == null ? styles.comBody : this.props.comBody}>
                              <Text style={[styles.nomText, {paddingRight: 10}]}>{commentsitem.Content}</Text>
                        </View>
                    </View>
                  </View>
                )
              })
            }
          </View>
        </View> : null
    )
  }

  closeText() {
    this.setState({
      isRank: 0,
      isComment: false
    });
  }
};

