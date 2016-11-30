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
  Modal,
  Dimensions
} from 'react-native';
import styles from "./style";
import actstyles from "../activities/style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
var {height, width} = Dimensions.get('window');
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
import api from "../../network/ApiHelper";
import LoaderView from '../common/LoaderView';
import NavLeftView from '../common/NavLeftView';
import TaskList from '../task/TaskList'
import _ from 'lodash'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from '../../../node_modules/react-native-scrollable-tab-view/ScrollableTabBar'


export default class ProjectsTask extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      stages:[],
      hasStage:false,
      fetchSuccess:false
    };
  };

  componentWillMount() {

  }
  componentDidMount() {
  InteractionManager.runAfterInteractions(() => {
    loaderHandler.showLoader("请稍等。。。");
    this.getStageData();
  });
  }
  getStageData(){
    this.setState({stages:[]});
    api.Project.getTaskStage(this.props.project.projectId)
      .then((res)=>{
        this.setState({fetchSuccess:true});
        if(res.Type==1){
         loaderHandler.hideLoader();
          if(res.Data.length!=0){
            this.setState({
              stages:res.Data
            })
          }
        }else{
          ToastAndroid.show('获取失败',ToastAndroid.SHORT);
        }
      })
  }
  projectSetting(){
    this.props.nav.push({id:'ProStageSetting',project:this.props.project,reloadData:this.getStageData.bind(this)})
  }
  reloadList(){
    let stagetId=this.refs.scrollTab.props.children[this.refs.scrollTab.state.currentPage].props.children.props.stagetId;
    this.refs["tab"+stagetId]&&this.refs["tab"+stagetId].reloadStageTaskList();
  }
  creatTask(){
    this.props.nav.push({
      id:'CreatTask',
      isChild:false,
      stages:this.state.stages,
      project:this.props.project,
      currStage:this.refs.scrollTab.props.children[this.refs.scrollTab.state.currentPage].props.children.props.stagetId,
      reloadList:this.reloadList.bind(this)
    })
  }
  reloadMoveList(stagetId){
    this.refs["tab"+stagetId]&&this.refs["tab"+stagetId].reloadStageTaskListForId(stagetId);
  }
  render() {
    return (
      <View style={styles.whiteContainer}>
        <NavigationBar
          style={styles.NavBarSty}
          leftButton={
            <NavLeftView nav={this.props.nav} textSty={styles.navLeftText} leftTitle={this.props.project.projectName}/>
          }
          rightButton={
            <View style={styles.LeftView}>
              {
                this.props.canMove?<TouchableOpacity style={styles.navIconTou} onPress={this.projectSetting.bind(this)}>
                  <SimpleLineIcons
                    name='list'
                    size={23}
                    color='white'
                  />
                </TouchableOpacity>:null
              }
              <TouchableOpacity style={styles.navIconTou} onPress={this.creatTask.bind(this)}>
                <Icon
                  name='md-add'
                  size={25}
                  color='white'
                />
              </TouchableOpacity>
            </View>}/>
        <View style={styles.container}>
          {
            this.state.fetchSuccess?<View style={{flex: 1}}>
              {
                this.state.stages.length!=0?<ScrollableTabView
                  ref="scrollTab"
                  renderTabBar={() => <ScrollableTabBar />}
                  tabBarBackgroundColor='white'
                  tabBarUnderlineColor='#3A83E1'
                  tabBarActiveTextColor='#3A83E1'
                  removeClippedSubviews={false}
                  initialPage={0}>
                  {
                    this.state.stages.map((item,index)=>{
                      let name=item.Name;
                      if(item.Name.length>10){
                        name=item.Name.substring(0,10)+"···"
                      }
                      return( <View tabLabel={name} key={index} style={{flex: 1}} nav={this.props.nav}>
                        <TaskList reloadMoveList={this.reloadMoveList.bind(this)} ref={"tab"+item.Id} nav={this.props.nav} stagetId={item.Id} project={this.props.project}/>
                      </View>)
                    })
                  }
                </ScrollableTabView>:null
              }
              {this.state.stages.length==0?
                <View style={styles.noDataView}>
                  <Icons
                    name="exclamation-circle"
                    size={50}
                    color="#717171"
                  />
                  <Text style={styles.noruleViewText}>暂无任务阶段</Text>
                </View> : null
              }
            </View>:null
          }

        </View>
        {
          this.state.stages.length==0?<BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />:null
        }
       
      </View>
    );
  }
};

