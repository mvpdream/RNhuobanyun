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
  InteractionManager,
  Dimensions
} from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ProjectList from './ProjectList'
var isLoaderFun;

export default class ProjectMain extends Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {

    };
  };

  componentDidMount() {

  }
  searchProject(){
    this.props.nav.push({id:'SearchProjects'})
  }
  addProject(){
    /*参考信息动态进行列表刷新*/
    this.props.nav.push({id:'CreatProject',reloadList:this.reloadList.bind(this)})
  }
  reloadList(){
    this.refs.asPartner&&this.refs.asPartner.reloadProjectList();//我参与的
    this.refs.finished&&this.refs.finished.reloadProjectList(99999);//已归档的
    // if(this.refs&&this.refs.scrollTab.state.currentPage){
    //   switch(this.refs.scrollTab.state.currentPage){
    //     case 0:
    //       this.refs.asPartner.reloadProjectList();//我参与的
    //       break;
    //     case 1:
    //       this.refs.finished.reloadProjectList(99999);//已归档的
    //       break;
    //   }
    // }else{
    //   this.refs.asPartner.reloadProjectList();//我参与的
    // }
  }
  render() {
    const titleConfig = {
      title: '项目',
      tintColor: 'white'
    };
    return (
      <View style={styles.container}>
        <NavigationBar
          style={styles.NavBarSty}
          title={titleConfig}
          rightButton={
            <View style={styles.LeftView}>
              <TouchableOpacity style={styles.navLeftIcon} onPress={this.searchProject.bind(this)}>
                <Icon
                  name='md-search'
                  size={25}
                  color='white'
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navLeftIcon} onPress={this.addProject.bind(this)}>
                <Icon
                  name='md-add'
                  size={25}
                  color='white'
                />
              </TouchableOpacity>
            </View>}/>
        <View style={{flex: 1}}>
          <ScrollableTabView
            ref="scrollTab"
            tabBarBackgroundColor='white'
            tabBarUnderlineColor='#3A83E1'
            tabBarActiveTextColor='#3A83E1'
            removeClippedSubviews={false}
            initialPage={0}>
            <View tabLabel='我参与的' style={{flex: 1}} nav={this.props.nav}>
              <ProjectList ref="asPartner" nav={this.props.nav}  reloadLists={this.reloadList.bind(this)}/>
            </View>
            <View tabLabel='已归档的' style={{flex: 1}} nav={this.props.nav}>
              <ProjectList ref='finished' nav={this.props.nav} projectType={99999} reloadLists={this.reloadList.bind(this)}/>
            </View>
          </ScrollableTabView>
        </View>
      </View>
    );
  }
};

