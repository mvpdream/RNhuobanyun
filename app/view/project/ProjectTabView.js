'use strict';

/*
 * home toolbar :[home,category,search,user,setting]
 */
import React, {Component} from 'react';
import {
  AppRegistry,
  Platform,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import TabNavigator from 'react-native-tab-navigator';
import api from "../../network/ApiHelper";
import ProjectsKb from '../kb/KbMain';
import ProjectActivity from '../project/ProjectsActicity';
import Task from '../project/ProjectsTask';
import Setting from '../project/ProjectSetting'
var ActionSheet = require('@remobile/react-native-action-sheet');
var {height, width} = Dimensions.get('window');

export default class ProjectTabView extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      isSetting:false,
      selectedTab: this.props.selectedTab != null ? this.props.selectedTab : 'Task',
      show:false,
      actData:[],
      hasKeyboard:false
    }
  }

  componentDidMount() {
      api.Project.projectSetting(this.props.projectId)
        .then((res)=>{
          if(res.Type==2){
            this.setState({isSetting:false})
          }else{
            this.setState({isSetting:true})
          }
        })
  }
  change(hasKeyboard){
    this.setState({hasKeyboard:hasKeyboard});
   
  }
  render() {
    let project={
      projectId:this.props.projectId,
      projectName:this.props.projectName
    };
    return (
        this.state.isSetting?<View style={{flex:1}}>
        <TabNavigator ref="TabNav" tabBarStyle={{top:height-60-20}} sceneStyle={{paddingBottom:this.state.hasKeyboard?0:60}}>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'Task'}
            title="任务"
            renderIcon={
            () =><Icon
              name='tasks'
              size={27}
              style={{height: 27}}
              color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
              name='tasks'
              size={28}
              style={{height: 28}}
              color='#3b5998'
            />}
            titleStyle={{fontSize: 12}}
            onPress={() => this.setState({selectedTab: 'Task'})}>
              <Task project={project}
                canMove={this.state.isSetting}
                nav={this.props.nav}/>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'Kb'}
            title="文库"
            renderIcon={
            () =><Icon
              name='folder'
              size={27}
              style={{height: 30}}
              color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
              name='folder'
              size={28}
              style={{height: 30}}
              color='#3b5998'
            />}
            titleStyle={{fontSize: 12}}
            onPress={() => this.setState({selectedTab: 'Kb'})}>
            <ProjectsKb
              project={project}
              nav={this.props.nav}/>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'Activities'}
            title="信息"
            renderIcon={
            () =><Icon
              name='comments'
              size={27}
              style={{height: 27}}
              color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
              name='comments'
              size={28}
              style={{height: 28}}
              color='#3b5998'
            />}
            titleStyle={{fontSize: 12}}
            onPress={() => this.setState({selectedTab: 'Activities'})}>
             <ProjectActivity project={project} nav={this.props.nav}/>
          </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'Setting'}
              title="设置"
              renderIcon={
              () =><Icon
                name='cog'
                size={27}
                style={{height: 27}}
                color='#656468'
              />}
              renderSelectedIcon={() =>
              <Icon
                name='cog'
                size={28}
                style={{height: 28}}
                color='#3b5998'
              />}
              titleStyle={{fontSize: 12}}
              onPress={() => this.setState({selectedTab: 'Setting'})}>
              <Setting 
                project={project} 
                callback={this.change.bind(this)} 
                nav={this.props.nav} 
                reloadData={this.props.reloadData==null?()=>{}:this.props.reloadData}/>
            </TabNavigator.Item>
        </TabNavigator></View>: 
        <View style={{flex:1}}>
        <TabNavigator ref="TabNav">
          <TabNavigator.Item
            selected={this.state.selectedTab === 'Task'}
            title="任务"
            renderIcon={
            () =><Icon
              name='tasks'
              size={27}
              style={{height: 27}}
              color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
              name='tasks'
              size={28}
              style={{height: 28}}
              color='#3b5998'
            />}
            titleStyle={{fontSize: 12}}
            onPress={() => this.setState({selectedTab: 'Task'})}>
             <Task project={project}
                canMove={this.state.isSetting}
                nav={this.props.nav}/>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'Kb'}
            title="文库"
            renderIcon={
            () =><Icon
              name='folder'
              size={27}
              style={{height: 30}}
              color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
              name='folder'
              size={28}
              style={{height: 30}}
              color='#3b5998'
            />}
            titleStyle={{fontSize: 12}}
            onPress={() => this.setState({selectedTab: 'Kb'})}>
            <ProjectsKb
              project={project}
              nav={this.props.nav}/>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'Activities'}
            title="信息"
            renderIcon={
            () =><Icon
              name='comments'
              size={27}
              style={{height: 27}}
              color='#656468'
            />}
            renderSelectedIcon={() =>
            <Icon
              name='comments'
              size={28}
              style={{height: 28}}
              color='#3b5998'
            />}
            titleStyle={{fontSize: 12}}
            onPress={() => this.setState({selectedTab: 'Activities'})}>
            <ProjectActivity project={project} nav={this.props.nav}/>
          </TabNavigator.Item>
          </TabNavigator>
        </View>
    );
  }
}

