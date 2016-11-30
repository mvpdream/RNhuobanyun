import React, {Component} from 'react'
import {
Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  Linking,
  NetInfo,
  Alert,
  Dimensions
} from 'react-native';

import styles from "./style";
import PinYinAddress from './PinYinAddress'
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/EvilIcons';
import DepAddress from './DepAddress'
import ScrollableTabView from 'react-native-scrollable-tab-view';
var {height, widths} = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'


export default class AddressBook extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {};
  }

;
  searchUser(position) {
    if (position == 1) {
      this.props.nav.push({
        id: 'ExportAddress'
      });
    }
    else {
      this.props.nav.push({
        id: 'SearchAddress'
      });
    }
  }

;
  componentDidMount() {
    NetInfo.fetch().done((reach) => {
      if (reach == "NONE") {
        Alert.alert(
          '警告',
          `当前设备处于无网络状态\n请连接网络后继续使用。`,
          [
            {
              text: '确定', onPress: () => {
              this.props.nav.pop();
            }
            }
          ]
        )
      }
    });
  }

  render() {
    const titleConfig = {
      title: '通讯录',
      tintColor: 'white'
    };
    return (
      <View style={{flex:1}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
           <NavLeftView nav={this.props.nav} leftTitle="通讯录"/>
                   }
          rightButton={
                  <View style={{flexDirection: 'row',alignItems: 'center',marginRight:10}}>
                      <TouchableOpacity style={styles.navLeftIcon} onPress={this.searchUser.bind(this,0)}>
                        <Icon
                          name='md-search'
                          size={25}
                          color='white'
                        />
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.navLeftIcon}  onPress={this.searchUser.bind(this,1)}>
                          <Icons
                            name='share-apple'
                            size={26}
                            color='white'
                          />
                      </TouchableOpacity>
                    </View>}/>
        <View style={{flex:1}}>
          <ScrollableTabView
            tabBarBackgroundColor='white'
            tabBarUnderlineColor='#3A83E1'
            tabBarActiveTextColor='#3A83E1'>
            <PinYinAddress tabLabel='按拼音查看' nav={this.props.nav}/>
            <DepAddress tabLabel='按部门查看' nav={this.props.nav}/>
          </ScrollableTabView>
        </View>
      </View>
    );
  }
};

