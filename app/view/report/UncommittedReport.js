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
  Dimensions
  } from 'react-native';
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import Icon from 'react-native-vector-icons/Ionicons';
import api from "../../network/ApiHelper";

export default class UncommittedReport extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  };
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    api.Report.checkSubmitStatus()
      .then((resData)=>{
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(resData.Data)
        });
      })
  }

  companyItem(item) {
    var strs=item.split("\n");
    return (

      <View style={styles.uncommitContainer}>
        <View style={styles.newsView}>
          <View style={{paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:16}}>{strs[0]}</Text></View>
          <View style={{borderTopColor: '#ECEFF1',borderTopWidth: 1,paddingTop:8,paddingBottom:8}}>
          <Text style={{fontSize:15,color:'black',fontWeight:'bold'}}>{strs[1]}</Text></View>
        </View>
      </View>
    );

  }

;
  render() {
    return (
      <View style={{flex:1}}>
        <NavToolbar navIconName={"android-arrow-back"} title={'汇报提交情况'} onClicked={() => {this.props.nav.pop();}}/>
        <View style={{flex:1,backgroundColor:'#ECEFF1'}}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.companyItem.bind(this)}
              />
        </View>
      </View>
    )
  }

;

}
