import React, {Component} from 'react'
import {
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
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import KbList from './KbList.js'
import Prompt from 'react-native-prompt';
var _this;
import api from "../../network/ApiHelper";
var ImagePickerManager = require('NativeModules').ImagePickerManager;
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');

import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
var hasManagePermission;

class KbMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openView:false
        }
    }
  componentDidMount() {
    api.KB.checkKBManager(_this.props.kbId==null?0:_this.props.kbId,_this.props.project&&_this.props.project.projectId)
      .then((res)=> {
        if (res.Type == 1) {
          if (res.Data) {
            //是管理员，有权限操作
            hasManagePermission = true;
            return true;
          } else {
            hasManagePermission = false;
            return false;
          }
        } else {
          ToastAndroid.show("获取身份出错",ToastAndroid.SHORT);
        }
      });
  }

  uploadFile() {
    this.close();
    if(hasManagePermission){
      _this.props.nav.push({
          id: 'FileSelector',
          getSelFile: (item)=> {
            this.getFiles(item)
          }
        }
      );
    }else{
      ToastAndroid.show("没有权限操作",ToastAndroid.SHORT);
    }
  }
  getFiles(files){
    if(files!=null){
      var filesData=[{
        uri:"file://"+encodeURI(files.path),
        name:encodeURIComponent(files.name)
      }];
      this.uploadFun(filesData);
    }
  }
    getImgs(asset){
      var fileData=asset.map((item, index)=> {
        var name=item.node.image.uri.split('/').pop();
        var getType=item.node.type.substring(item.node.type.lastIndexOf("/")+1,item.node.type.length);
        return {
          uri: item.node.image.uri,
          name: name+"."+getType
        };
      });
      this.uploadFun(fileData);
    }
    uploadImages() {
      this.close();
      if(hasManagePermission){
        //是管理员，有权限操作
        _this.props.nav.push({
          id: 'PhotoSelector',
          getSelImg: (images)=> {
            this.getImgs(images)
          }
        })
      }else{
        ToastAndroid.show("没有权限操作",ToastAndroid.SHORT);
      }
    }
  open() {
    api.KB.checkKBManager(_this.props.kbId==null?0:_this.props.kbId,_this.props.project&&_this.props.project.projectId)
      .then((res)=> {
        if (res.Type == 1) {
          if (res.Data) {
            //是管理员，有权限操作
            hasManagePermission = true;
            return true;
          } else {
            hasManagePermission = false;
            return false;
          }
        } else {
          ToastAndroid.show("获取身份出错",ToastAndroid.SHORT);
        }
      });
    this.setState({openView: true})
  }
    close(){
      this.setState({openView:false})
    }
    creatKB() {
      this.close();
      if(hasManagePermission){
        //是管理员，有权限操作
        _this.setState({
          promptVisible: true
        })
      }else{
        ToastAndroid.show("没有权限操作",ToastAndroid.SHORT);
      }
    }
  uploadImage(){
    this.close();
    if(hasManagePermission){
      //是管理员，有权限操作
      var options = {
        maxWidth: 1000,
        maxHeight: 1000,
        aspectX: 1,
        aspectY: 1,
        quality: 1,
        allowsEditing: false
      };
      ImagePickerManager.launchCamera(options, (response) => {
        // Same code as in above section!
        if (response.didCancel) {
          ///console.log('User cancelled image picker');
        }
        else if (response.error) {
          //console.log('ImagePickerManager Error: ', response.error);
          ToastAndroid.show('出现未知错误',ToastAndroid.SHORT);

        }
        else {
          const source = {uri:"file://"+response.path, isStatic: true};
          var files = [{
            uri: source.uri,
            name: source.uri.split('/').pop()
          }];
          this.uploadFun(files)
        }});
    }else{
      ToastAndroid.show("没有权限操作",ToastAndroid.SHORT);
    }
  }
  uploadFun(files){
    _this.refs.LoaderView.startLoader();
    api.KB.directUpload(_this.props.kbId == null ? 0 : _this.props.kbId,_this.props.project&&_this.props.project.projectId,0, false, files)
      .then((res)=> {
        ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        _this.refs.LoaderView.finishLoader();
        if (res.Type == 1) {
          if(_this.props.project){
            _this.refs.kbList.getProjectKbLists()
          }else{
            _this.refs.kbList.getLists();
          }
        }
        else {
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }
      }).catch((err)=> {
        ToastAndroid.show('出现未知错误',ToastAndroid.SHORT);
      })
  }
    render() {
        return (
          this.state.openView?
            <View style={styles.openViewView}>
                <TouchableOpacity style={styles.openViewTou} onPress={()=>{this.setState({openView:false})}} >
                    <View style={styles.openUpView}>
                        <View style={styles.openViewsView}>
                            <View>
                                <TouchableOpacity onPress={this.uploadFile.bind(this)}>
                                    <View style={styles.modalTextView}>
                                        <Icon
                                          name="file-text-o"
                                          size={15}
                                          color="#175898"
                                          style={{marginLeft:5}}
                                          />
                                        <Text style={styles.modalText}>上传文件</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.uploadImages.bind(this)}>
                                    <View style={styles.modalTextView}>
                                        <Icon
                                          name="image"
                                          size={15}
                                          color="#175898"
                                          style={{marginLeft:5}}
                                          />
                                        <Text style={styles.modalText}>上传图片</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.uploadImage.bind(this)}>
                                    <View style={styles.modalTextView}>
                                        <Icon
                                          name="camera-retro"
                                          size={15}
                                          color="#175898"
                                          style={{marginLeft:5}}
                                          />
                                        <Text style={styles.modalText}>拍摄图片</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.creatKB.bind(this)}>
                                    <View style={[styles.modalTextView,{borderBottomWidth:0}]}>
                                        <Icon
                                          name="folder-open-o"
                                          size={15}
                                          color="#175898"
                                          style={{marginLeft:5}}
                                          />
                                        <Text style={styles.modalText}>新文件夹</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>:null
        )
    }
;
}
class LoaderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startLoader:false
    }
  }
  startLoader(){
    this.setState({startLoader:true})
  }
  finishLoader(){
    this.setState({startLoader:false})
  }
  render() {
    return (
     this.state.startLoader?
      <View style={styles.loaderContainer}>
        <View style={styles.loaderOverlay}>
       <Bars size={10} color="#EFF3F5" />
          <Text style={{color:"white"}}>正在上传</Text>
          </View>
      </View>:<View />
    )
  }
}
export default class KbMain extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {
          creatFlag:false,
          fetchSuccess:false
        };
      _this=this;
    };
    kbMenu(index){
      switch (index) {
        case 0:
          this.props.nav.push({
            id: 'SearchKb',
            kbId: this.props.kbId,
            projectId:this.props.project&&this.props.project.projectId
          });
          break;
        case 1:
          this.refs.kbMenuView.open();
          break

      }
    }
  creatKBFile(value) {
    //确认
    value = value.trim();
    if (value.length == 0) {
      ToastAndroid.show("输入项不能为空",ToastAndroid.SHORT);
      return;
    }
    //防止用户重复点击
    this.setState({creatFlag: true});
    api.KB.createKb(value, this.props.kbId,this.props.project&&this.props.project.projectId)
      .then((res)=> {
        this.setState({creatFlag: false});
        if (res.Type == 1) {
          _this.setState({
            promptVisible: false
          });
          if(this.props.project){
            this.refs.kbList.getProjectKbLists()
          }else{
            this.refs.kbList.getLists();
          }
        }
        else {
          ToastAndroid.show(res.Data,ToastAndroid.SHORT);
        }

      })
  }
    havaKbData(value){
      //判断list是否有数据 控制导航栏右侧显示
      this.setState({fetchSuccess:value})
    }
    render() {
      _this=this;
        return (
            <View style={{flex:1}}>
                <NavigationBar
                  style={styles.NavSty}
                  leftButton={
                    this.props.project==null?<NavLeftView nav={this.props.nav} leftTitle={this.props.kbId != null?this.props.kbName:'文库'}/>:
                      <NavLeftView nav={this.props.nav} textSty={styles.navLeftText} leftTitle={this.props.project.projectName}/>
                   }
                  rightButton={
                  this.state.fetchSuccess?<View style={{flexDirection: 'row',alignItems: 'center',marginRight:10}}>
                    <TouchableOpacity style={styles.navLeftIcon} onPress={this.kbMenu.bind(this,0)}>
                      <Icons
                        name='md-search'
                        size={25}
                        color='white'
                        />
                        </TouchableOpacity>
                       <TouchableOpacity style={styles.navLeftIcon} onPress={this.kbMenu.bind(this,1)}>
                          <Icons
                          name='md-add'
                          size={25}
                          color='white'
                          />
                       </TouchableOpacity>
                    </View>:<Text/>
                   }/>
              <KbList ref="kbList"
                      project={this.props.project}
                      nav={this.props.nav}
                      kbId={this.props.kbId}
                      isSuccess={this.havaKbData.bind(this)}/>
                <LoaderView ref="LoaderView" nav={this.props.nav}/>
                <KbMenuView ref="kbMenuView" nav={this.props.nav}/>
              <Prompt
                title="新建文件夹"
                ref="prompt"
                visible={_this.state.promptVisible}
                submitText="确定"
                cancelText="取消"
                onCancel={ () => _this.setState({
                  promptVisible: false
                }) }
                onSubmit={this.state.creatFlag?()=>{}:_this.creatKBFile.bind(this)}/>
            </View>
        );
    }
};

