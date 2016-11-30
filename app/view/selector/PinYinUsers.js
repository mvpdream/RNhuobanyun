import React, {Component} from 'react'
import {
    Image,
    Text,
    TextInput,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    Alert,
  Dimensions
} from 'react-native';

import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../network/ApiHelper";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var AlphabetListView = require('react-native-alphabetlistview');
import CircleCheckBox from 'react-native-circle-checkbox';
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
var selectedItem=[];
var _this;
var radioNum=100;

//标题字母
class SectionHeader extends Component {
  render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      color: 'black',
      fontWeight: '600',
      fontSize: 18
    };

    var viewStyle = {
      height: 28,
      paddingLeft: 5
    };
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
    );
  }
}

//侧边字母
class SectionItem extends Component {
  render() {
    return (
      <View style={{backgroundColor: '#B3B3B3', width: 15, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'blue'}}>{this.props.title}</Text>
      </View>
    );
  }
}

//显示部分
class Cell extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      checkState: false,
    };
  };

  checkItem() {
    let checkState = !this.state.checkState;
    this.setState({checkState: checkState});
    if (checkState) {
      selectedItem.push(this.props.item);
    }
    else {
      var _index = selectedItem.indexOf(this.props.item);
      if (_index > -1) {
        selectedItem.splice(_index, 1)
      }
    }
    if (selectedItem.length > radioNum) {
      Alert.alert(
        '警告',
        `做多可以选择：${radioNum}项`,
        [{text: '确定', onPress: ()=>this.setState({checkState: !this.state.checkState})}]
      );
      var _index = selectedItem.indexOf(this.props.item);
      if (_index > -1) {
        selectedItem.splice(_index, 1)
      }
    }
    else {
      this.props.callback(selectedItem, null);
    }
  };

  render() {
    return (
      <TouchableOpacity onPress={this.checkItem.bind(this)}>
        <View style={styles.container}>
          <CircleCheckBox
            checked={this.state.checkState}
            outerColor='#175898'
            innerColor='#175898'
            onToggle={this.checkItem.bind(this)}
          />
          <Image
            source={{uri: this.props.item.Avatar}}
            style={styles.image}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{this.props.item.Name}</Text>
            <Text style={styles.year} numberOfLines={1}>{this.props.item.Description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}


export default class PinYinUsers extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      userName: [],
      data: [],
      isFetch: false
    };
    if (this.props.selectorRadio == 0) {
      radioNum = 1;
    }else{
      radioNum=9999
    }
    selectedItem = [];
  };

  componentDidMount() {
    loaderHandler.showLoader("加载中...");
    api.OS.getUserListGroupByPrefix()
      .then((resData)=> {
        loaderHandler.hideLoader();
        if (resData.Type == 1) {
          this.setState({
            isFetch: true,
            data: resData.Data
          });
        } else {
          this.setState({
            isFetch: false
          });
        }

      })
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.isFetch ? <AlphabetListView
          data={this.state.data}
          cellProps={{callback: this.props.callback}}
          cell={Cell}
          cellHeight={70}
          sectionListItem={SectionItem}
          sectionHeader={SectionHeader}
          sectionHeaderHeight={29}
        /> : <View style={{flex: 1, backgroundColor: 'white'}}/>}

        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A'
                       textColor='white'/>
      </View>

    );
  }
};

