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
  ScrollView
  } from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import api from "../../network/ApiHelper";

export default class ReportRules extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      remind: [],
      isFetch:false,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

;
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    api.Report.getTasterAndRules()
      .then((resData)=> {
        this.setState({
          remind: resData.remind,
          dataSource: this.state.dataSource.cloneWithRows(resData.tasterusers),
        });
        this.setState({isFetch:true})
      })
  }

;
  tasterusersItem(item) {
    return (
      <View style={styles.tasterusersView}>
        <Image
          source={{uri:item.avatar}}
          style={{width:40,height: 40,borderRadius: 80}}
          />
        <Text style={styles.taname}>{item.name}</Text>
        <Text style={styles.tadescription}>--{item.description}</Text>
      </View>
    );

  };
  render() {
    return (
      <View style={styles.recontainer}>
        <NavigationBar
          style={{height: 55,backgroundColor:'#175898'}}
          leftButton={
                     <View style={styles.navLeftBtn}>
                     <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={() => {this.props.nav.pop()}}>
                        <Icon
                          name="android-arrow-back"
                          size={28}
                          color="white"
                          onPress={() => {this.props.nav.pop()}}
                        />
                         </TouchableOpacity>
                         <Text numberOfLines={1} style={styles.navLeftText}>汇报规则</Text>
                     </View>
                   }/>
        {
          this.state.isFetch?<View style={{flex:1}}>
            {
              this.state.remind.monthtime == ""&&this.state.remind.daytime == ""&&this.state.remind.weektime == ""?null:<View style={{paddingLeft:15,padding:6}}>
                <View style={{backgroundColor:'white',padding:10}}>
                  <View>
                    {this.state.remind.daytime == ""?null:
                      <View style={styles.ruleItemView}><Text style={styles.ruleText}>请在
                        <Text style={styles.ruleTextName}>{this.state.remind.daytime}</Text>
                        前提交日报</Text></View>}
                    {
                      this.state.remind.weektime == ""?null:
                        <View style={styles.ruleItemView}><Text style={styles.ruleText}>请在
                          <Text style={styles.ruleTextName}>{this.state.remind.weektime}</Text>
                          前提交周报</Text></View>
                    }
                    {
                      this.state.remind.monthtime == ""?null:
                        <View style={styles.ruleItemView}><Text style={styles.ruleText}>请在
                          <Text style={styles.ruleTextName}>{this.state.remind.monthtime}</Text>
                          前提交月报</Text></View>
                    }
                  </View>
                </View>
              </View>
            }
            <View style={{justifyContent: 'center',padding:10,marginTop:0,backgroundColor:'#CAC9C9'}}>
              <Text style={[styles.ruleText,{color:'black'}]}>审阅人</Text></View>
            <View style={{flex:1,marginTop:5,}}>
              <ScrollView>
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.tasterusersItem.bind(this)}
                  />
              </ScrollView>
            </View>
          </View>:null
        }

      </View>
    )
  }

;

}
