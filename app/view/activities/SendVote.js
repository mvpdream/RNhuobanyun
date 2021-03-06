import React, {Component} from 'react'
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
  Switch,
  Picker,
  Dimensions
} from 'react-native';


import styles from "./style";
import api from "../../network/ApiHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
var {height, widths} = Dimensions.get('window');
var UserandDepArr = [];
var voteTemp = [{label: '单选', value: '1', Text: "选项"}];
var voteTextArr = [];

var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView';
import InputScrollView from 'react-native-inputscrollview';

export default class SendVote extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      UserandDepArr: [],
      switchState: false,
      expired_time: 1,
      optionNum: 1,
      activityContent: "",
      voteTiltle: ""
    };
  }

;
  componentDidMount() {
    voteTemp = [{label: '单选', value: '1', Text: "选项"}];
    voteTextArr = [];
    this.forceUpdate();
  }

;
  submitVote() {
    var userData = this.state.UserandDepArr && this.state.UserandDepArr.filter((useritem)=> {
        if (useritem.Type == "user" && useritem != null) {
          return useritem
        }
      });
    var newuserData = userData && userData.map((useritem)=> {
        if (useritem.Type == "user" && useritem != null) {
          return useritem.Id
        }
      });
    var depData = this.state.UserandDepArr && this.state.UserandDepArr.filter((depitem)=> {
        if (depitem.Type == "dep" && depitem != null) {
          return depitem
        }
      });
    var newdepData = depData && depData.map((depitem)=> {
        return depitem.Id
      });
    voteTextArr=[];
    for (var i = 0; i < voteTemp.length; i++) {
      if (this.state["voteText" + i] != null) {
        voteTextArr.push(this.state["voteText" + i])
      }
    }
    var IsAnonymous = null;
    if (this.state.switchState) {
      IsAnonymous = 'true';
    }

    if (this.state.UserandDepArr.length == 0) {
      ToastAndroid.show("请选择发送范围！",ToastAndroid.SHORT);
      return;
    }
    if (this.state.voteTiltle == "") {
      ToastAndroid.show("请填写投票标题！",ToastAndroid.SHORT);
      return;
    }
    if (voteTextArr.length != voteTemp.length) {
      ToastAndroid.show("选项内容不可为空！",ToastAndroid.SHORT);
      return;
    }
    var Votemodel = {
      VoteTitle: this.state.voteTiltle,
      VoteOptions: voteTextArr,
      MaxSelect: this.state.optionNum,
      DateExpired: this.state.expired_time,
      ResultVisible: this.state.visiable,
      IsAnonymous: IsAnonymous
    };
    loaderHandler.showLoader("请稍等。。。");
    api.Activity.createVote(Votemodel, "", newuserData, newdepData)
      .then((resData)=> {
        if (resData.Type == 1) {
          setTimeout(()=>{this.props.reloadList(this.isOK.bind(this))},1000);
        }else{
          loaderHandler.hideLoader();
          ToastAndroid.show(resData.Data,ToastAndroid.SHORT);
        }
      });
  }

;
  isOK(isok){
     if(isok){
      ToastAndroid.show("发送成功",ToastAndroid.SHORT);
      loaderHandler.hideLoader();
      this.props.nav.pop();
    }else{
      ToastAndroid.show("列表刷新失败,请重试",ToastAndroid.SHORT);
      loaderHandler.hideLoader();
      this.props.nav.pop();
    }
  }
  closeScopeItem(index) {
    if (index > -1) {
      this.state.UserandDepArr.splice(index, 1);
      this.forceUpdate()
    }
  }

  scopeItem(UserandDepItem) {
    //获取到用户和部门
    if (UserandDepItem != null) {
      this.setState({UserandDepArr: UserandDepItem})
    }
  }

  sendscope() {
    var selectorConfig = {
      selectorType: 2,
      selectorRadio: 1,
      getselectorItem: this.scopeItem.bind(this)
    };
    this.props.nav.push({
      id: 'SelectorMain',
      selectorConfig: selectorConfig
    });

  }

  changeSwitch() {
    this.setState({switchState: !this.state.switchState})
  }

  deleteVoteItem(index) {
    voteTemp.splice(index, 1);
    this.forceUpdate();
  }

  addVoteItem() {
    voteTemp.push({Text: "选项"});
    this.forceUpdate();
  }

  voteResulevisiable(itemValue) {
    this.setState({visiable: itemValue})
  }

  optionItem(itemValue) {
    this.setState({optionNum: itemValue})
  }

  pickerItem(itemValue, itemPosition) {
    this.setState({expired_time: itemValue});
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
            <NavLeftView nav={this.props.nav} leftTitle="发投票"/>
                   }
          rightButton={
                   <TouchableOpacity style={{marginRight:10,justifyContent: 'center'}} onPress={this.submitVote.bind(this)}>
                    <Text numberOfLines={1} style={styles.rightNavText}>发送</Text>
                      </TouchableOpacity>
                    }/>
        <InputScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex:1}}>
            <TouchableOpacity onPress={this.sendscope.bind(this)}>
              <View style={styles.sendConView}>
                <View style={styles.sendToView}>
                  <Text style={styles.nomText}>发送至：</Text>
                </View>
                <View style={styles.sendToRView}>
                  {
                    this.state.UserandDepArr && this.state.UserandDepArr.map((scopeTemp, index)=> {
                      return (
                        <View key={index} style={styles.scopeView}>
                          <Text style={[styles.nomText,{color:'white'}]}>{scopeTemp.Name}</Text>
                          <Icons name='ios-close' size={20} color='white' style={{marginLeft:10}}
                                 onPress={this.closeScopeItem.bind(this,index)}/>
                        </View>
                      )
                    })
                  }
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.nomView}>
              <TextInput
                style={{height:40,textAlignVertical:'center'}}
                placeholder='投票标题'         
                onFocus={()=>{
               this.setState({isBottomView:true})
              }}
                onChangeText={(text) => this.setState({voteTiltle: text})}
                underlineColorAndroid="transparent"
                />
            </View>

          </View>

          {
            voteTemp && voteTemp.map((item, index)=> {
              return (
                <View key={index} style={styles.sendConView}>
                  <Text style={styles.nomText}>{item.Text + [index + 1]}</Text>
                  <TextInput
                    style={{height:40,flex:1}}
                    maxLength={32}
                    placeholder='选项内容'
                    onChangeText={(text) => this.setState({["voteText"+index]: text})}
                    underlineColorAndroid="transparent"
                    />
                  {index == 0 ? null :
                    <Icons name='ios-close-circle' size={26} color='#757678' onPress={this.deleteVoteItem.bind(this,index)}/>}
                </View>
              )
            })
          }
          <TouchableOpacity onPress={this.addVoteItem.bind(this)}>
            <View style={[styles.sendConView,{justifyContent: 'center'}]}>
              <Icon
                name="plus-circle"
                size={30}
                color="#2A2C2B"
                style={{height:35,width:35}}
                />
              <Text style={styles.nomText}>添加选项</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.sendConView}>
            <View style={styles.optionView}>
              <View>
                <Text>可选项数</Text>
                <View style={{width:Dimensions.get('window').width*0.3}}>
                  <Picker
                    selectedValue={this.state.optionNum}
                    mode="dialog"
                    onValueChange={this.optionItem.bind(this)}>
                    {voteTemp && voteTemp.map((item, index)=> {
                      return (
                        <Picker.Item
                          key={index}
                          label={index>=1?`最多可以选择${index+1}项`:'单选'}
                          value={index+1}/>
                      )
                    })}
                  </Picker>
                </View>
              </View>
              <View>
                <Text>持续时间</Text>
                <View style={{width:Dimensions.get('window').width*0.3}}>
                  <Picker
                    selectedValue={this.state.expired_time}
                    mode="dialog"
                    onValueChange={this.pickerItem.bind(this)}>
                    <Picker.Item label="一天" value="1"/>
                    <Picker.Item label="三天" value="2"/>
                    <Picker.Item label="一周" value="3"/>
                    <Picker.Item label="一个月" value="4"/>
                    <Picker.Item label="三个月" value="5"/>
                  </Picker>
                </View>
              </View>
              <View>
                <Text>投票结果</Text>
                <View style={{width:Dimensions.get('window').width*0.3}}>
                  <Picker
                    selectedValue={this.state.visiable}
                    mode="dialog"
                    onValueChange={this.voteResulevisiable.bind(this)}>
                    <Picker.Item label="投票人可见" value="true"/>
                    <Picker.Item label="仅发出的人可见" value="false"/>
                  </Picker>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rightleftView}>
            <Text style={styles.nomText}>是否匿名投票</Text>
            <Switch onValueChange={this.changeSwitch.bind(this)} value={this.state.switchState}/>
          </View>
        </InputScrollView>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A'
                       textColor='white'/>
      </View>

    );
  }
};

