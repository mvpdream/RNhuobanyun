/**
 * Created by wangshuo
 */
'use strict';
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
  InteractionManager,
  ScrollView,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import styles from "./style";
import actstyles from "../activities/style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
import api from "../../network/ApiHelper";
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
import NavLeftView from '../common/NavLeftView'
import _ from 'lodash'
var Modal = require('react-native-modalbox');
import ActivitiesList from '../activities/ActivitiesList'
import InputScrollView from 'react-native-inputscrollview'
var _this;
class SendView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openView: false
    }
  }

  sendActivity() {
    this.setState({openView: false});
    this.props.nav.push({
      id: 'SendActivity',
      reloadList:_this.reloadList.bind(_this),
      type: 0,
      project:_this.props.project
    })
  }
  sendVote() {
    this.setState({openView: false});
    this.props.nav.push({
      id: 'SendVote',
      reloadList:_this.reloadList.bind(_this),
      project:_this.props.project
    })
  }

  open() {
    this.setState({openView: !this.state.openView})
  }

  render() {
    return (
      this.state.openView ?
        <View style={actstyles.openViewView}>
          <TouchableOpacity style={actstyles.openViewTou} onPress={()=> {
            this.setState({openView: false})
          }}>
            <View style={actstyles.openUpView}>
              <View style={actstyles.openViewsView}>
                <View>
                  <TouchableOpacity onPress={this.sendActivity.bind(this)}>
                    <View style={actstyles.modalTextView}>
                      <Icons
                        name="pencil"
                        size={15}
                        color="#175898"
                        style={{marginLeft: 5}}
                      />
                      <Text style={actstyles.modalText}>发 分 享</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this.sendVote.bind(this)}>
                    <View style={actstyles.modalTextView}>
                      <Icons
                        name="list-ul"
                        size={15}
                        color="#175898"
                        style={{marginLeft: 5}}
                      />
                      <Text style={actstyles.modalText}>发 投 票</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View> : null
    )
  }
  ;
}
export default class ProjectsActicity extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      projectData:[],
      members:[],
      longMembers:[],
      all:false,
      Description:"",
      isEdit:false,
      fetchSuccess:false,
      viewHeight:0,
      haveView:true,
      textLineNum:1
    };
    _this=this;
  };
  componentDidMount() {
    loaderHandler.showLoader("加载中...");
    api.Project.projectDetail(this.props.project.projectId)
      .then((res)=>{
        if(res.Type==1){
          let textLineNum=res.Data.Description.split("\n").length;
          this.setState({
            projectData:res.Data,
            members:res.Data.Members,
            longMembers:res.Data.LongMembers,
            Description:res.Data.Description,
            textLineNum:textLineNum,
            fetchSuccess:true})
        }else{
          ToastAndroid.show("获取详情失败",ToastAndroid.SHORT);
        }
      });
  }
  searchKb(){

  }
  kbMenu(){
    this.refs.sendView.open();
  }
  openAll(){
    this.setState({all:!this.state.all})
  }
  reloadList(){
    _this.refs.allInfo.reloadProList();
  }
  viewOnLayout(e){
    this.setState({viewHeight:e.nativeEvent.layout.y});
  }
  ProjectUpdate(){
    this.state.projectDescribe = this.state.projectDescribe.trim();
    if (this.state.projectDescribe.length == 0) {
      ToastAndroid.show("输入项中不能为空",ToastAndroid.SHORT);
      return;
    }
    loaderHandler.showLoader("加载中...");
    api.Project.editProjectAnnouncement(this.props.project.projectId,this.state.projectDescribe)
      .then((res)=>{
       loaderHandler.hideLoader();
        ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        if(res.Type==1){
          this.refs.projectDescribe.blur();
          this.setState({isEdit:false});
        }
      })

  }
  loadingList(isload){
    if(isload==1){
      loaderHandler.hideLoader();
      this.setState({fetchSuccess:true})
    }
  }
  scrollPosition(position){
    if(position==0){
      //dingbu
      this.setState({haveView:true})
    }else{
      this.setState({haveView:false})
    }
  }
  render() {
    let item=this.state.projectData;
    let names = _.pluck(this.state.members, "Name");
    let allnames = _.pluck(this.state.longMembers, "Name");
    return (
      <View style={[styles.container,{backgroundColor: '#EFF0F4'}]}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} textSty={styles.navLeftText} leftTitle={this.props.project.projectName}/>
          }
          rightButton={
            <View style={styles.LeftView}>
              {
                this.state.isEdit?<TouchableOpacity style={[styles.touIcon, {paddingLeft: 10,paddingRight:10}]} onPress={this.ProjectUpdate.bind(this)}>
                  <Text style={styles.rightNavText}>保存</Text>
                </TouchableOpacity>:null
              }
              <TouchableOpacity style={styles.navIconTou} onPress={this.kbMenu.bind(this)}>
                <Icon
                  name='ios-add'
                  size={30}
                  color='white'
                />
              </TouchableOpacity>
            </View>}/>
        {
          this.state.fetchSuccess?
            <View style={[styles.newcontainer,{backgroundColor: '#EFF0F4'}]}>
              {
                <Modal style={{height:this.state.viewHeight}}
                       isOpen={this.state.haveView?true:false}
                       isDisabled={false}
                       swipeToClose={false}
                       backdropPressToClose={false}
                       backdrop={false}
                       position={"top"}
                       ref={"modal"}>
                <View style={{height:this.state.viewHeight}}>
                  <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} keyboardShouldPersistTaps={false}
                              keyboardDismissMode="on-drag">
                    <View style={styles.projectMember}>
                      <View style={styles.listTopView}>
                        <View style={{flex:1}}>
                          <Text style={[styles.title,{fontSize:12}]}>{item&&item.StartFinishTime}</Text>
                        </View>
                        <View style={styles.imgView}>
                          <Text style={[styles.title,{fontSize:12}]}>{item&&item.Progress}</Text>
                        </View>
                      </View>

                      <View style={styles.namesView}>
                        <Text width={Dimensions.get('window').width-20} style={[styles.title,{fontSize:12}]}>成员：{this.state.all?allnames.join("、"):names.join("、")}</Text>
                      </View>
                      {
                        this.state.members.toString()!=this.state.longMembers.toString()?<View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={{width: Dimensions.get('window').width-20}} onPress={this.openAll.bind(this)}>
                            <View style={{marginLeft: Dimensions.get('window').width - 33}}>
                              {
                                this.state.all?<Icons
                                  name="angle-up"
                                  size={20}
                                  color="#000000"
                                />:<Icons
                                  name="angle-down"
                                  size={20}
                                  color="#000000"
                                />
                              }
                            </View>
                          </TouchableOpacity>
                        </View>:null
                      }
                    </View>
                    <View style={styles.describeView}>
                      {
                        item&&item.Project_Update?<TextInput
                          ref="projectDescribe"
                          learButtonMode="while-editing"
                          underlineColorAndroid="transparent"
                          placeholder="项目公告"
                          multiline={true}
                          defaultValue={this.state.Description}
                          style={styles.describeText}
                          onChangeText={(text) => this.setState({isEdit:true,projectDescribe: text})}/>:
                          <TextInput
                            learButtonMode="while-editing"
                            underlineColorAndroid="transparent"
                            multiline={true}
                            editable={false}
                            defaultValue={this.state.Description}
                            style={[styles.describeText,{height:this.state.textLineNum>3||(this.state.textLineNum==1&&this.state.Description.length>32)?80:this.state.textLineNum*30}]}
                            onChangeText={(text) => this.setState({isEdit:true,projectDescribe: text})}/>
                      }
                    </View>
                    <View onLayout={this.viewOnLayout.bind(this)}/>
                  </ScrollView>
                </View></Modal>
              }

            <View style={[styles.activityView,{marginTop:this.state.haveView?this.state.viewHeight:5}]}>
              <ActivitiesList
                ref='allInfo'
                type="task"
                nav={this.props.nav}
                scrollPosition={this.scrollPosition.bind(this)}
                project={this.props.project}
                actType={62}
                loading={this.loadingList.bind(this)}/>
            </View>

          </View>:<View style={[styles.newcontainer,{backgroundColor: '#EFF0F4'}]}/>
        }

        <SendView ref="sendView" nav={this.props.nav}/>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

