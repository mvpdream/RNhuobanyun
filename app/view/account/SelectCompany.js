/**
 * Created by lizx on 2016/2/4.
 */

/**
 * Created by wangshuo on 2016/2/3.
 */
import React, {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  Dimensions,
  PullToRefreshViewAndroid,
  Alert
  } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import Icon from 'react-native-vector-icons/Ionicons';
import api from "../../network/ApiHelper";
import CompanyCell from "./CompanyCell.js"
import _ from "lodash";
import Popup from 'react-native-popup';
import Toast from  '@remobile/react-native-toast';
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

export default class SelectCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resData: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

;
  componentDidMount() {
    loaderHandler.showLoader("加载中");
    api.Company.getCompanyList()
      .then((resDate)=> {
        loaderHandler.hideLoader();
        if(resDate.Type==1){
          this.setState({
            resData: resDate.Data,
            dataSource: this.state.dataSource.cloneWithRows(resDate.Data)
          });
        }else{
          Toast.show("获取列表失败！请重试","short");
        }

      })
  }


  companyRender(item) {
    return (
      <CompanyCell
        comData={item}
        deleteAction={callb=>this.deleteAction(item,callb)}
        onSelect={() => this.selectAction(item)}
        />
    );

  }

;
  selectAction(item) {
    var userid = item.Id;
    api.Company.enterCompany(userid)
      .then((resData)=> {
        if (resData.Type != 1) {
          Toast.show(resData.Data,"short");
        }
        else {
          this.props.nav.immediatelyResetRouteStack([{id:'MainTabView'}]);
        }
      })
  };

  creatCompany() {
    this.props.nav.push({
      id: 'CreatCompany'
    });
  };

  joinCompany() {
    this.props.nav.push({
      id: 'JoinCompany'
    });
  };

  //撤销申请
  deleteAction(item, callb) {
    this.popup.confirm({
      title: '提示',
      content: '是否撤销该申请？',
      ok: {
        text: '确认',
        callback: () => {
          this.cancelApply(item, callb)
        }
      },
      cancel: {
        text: '取消',
        callback: () => {
          this.cancelAction(item, callb)
        }
      }
    });
  };

  //取消
  cancelAction(item, callb) {
    callb && callb();
  }

;
  cancelApply(item, callb) {
    var userid = item.Id;
    var currentData = this.state.resData;
    api.Company.cancelApply(userid)
      .then((resData) => {
        if (resData.Type && resData.Type == 1) {
          callb && callb();
          Toast.show("撤销成功","short");
          if (currentData && currentData.length > 0 && !!item) {
            let tempIds = _.pluck(currentData, 'Id'),
              _index = tempIds.indexOf(item['Id'])
              ;
            if (_index > -1) {
              currentData.splice(_index, 1);
              var temp = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
              this.setState({
                dataSource: temp.cloneWithRows(currentData)
              });
            }
          }

        }
        else {
          callb && callb();
          Toast.show("撤销失败","short");
        }
      })
  }

;
  render() {
    return (
      <View style={styles.recontainer}>
        <NavToolbar navIconName={"android-arrow-back"} onClicked={() => {this.props.nav.pop();}} title={'选择企业'}/>
        <View style={styles.rescontainer}>
          <View style={{flexDirection:'row',flex:1,paddingTop:10}}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.companyRender.bind(this)}
              />
          </View>
          <View
            style={{flexDirection:'row',justifyContent: 'center',backgroundColor:'#dddddd',borderColor: '#B1B0B0',borderWidth: 1,}}>

            <TouchableOpacity style={styles.companyTous} onPress={this.creatCompany.bind(this)}>
              <View style={styles.selcompbutton}>
                <Text style={{fontSize:16,color:'white'}}>创建企业</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.companyTous} onPress={this.joinCompany.bind(this)}>
              <View style={styles.selcompbutton}>
                <Text style={{fontSize:16,color:'white'}}>加入企业</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Popup ref={(popup) => { this.popup = popup }}/>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    )
  }

;

}
