/**
 * Created by wangshuo
 */
'use strict';

import React, {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    Component
    } from 'react-native';
import styles from "./style";
import NavigationBar from 'react-native-navbar';
var Dimensions=require('Dimensions');
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
import Toast from  '@remobile/react-native-toast'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
var hasManagePermission;

class KbMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openView:false
        }
    }
    checkKBManager(){
      if(_this.props.kbId==null){
        api.KB.checkKBManager()
          .then((res)=>{
            if(res.Type==1){
              if(res.Data){
                //是管理员，有权限操作
                hasManagePermission=true;
              }else{
                hasManagePermission=false;
              }
            }else{
              Toast.show("获取身份出错","short");
            }
          })
      }
      else{
        if(_this.props.managePermission){
          hasManagePermission=true;
        }else{
          hasManagePermission=false;
        }
      }
    }
    uploadFile(){
      this.close();
      if(_this.props.kbId==null){
        api.KB.checkKBManager()
          .then((res)=>{
            if(res.Type==1){
              if(res.Data){
                //是管理员，有权限操作
                _this.props.nav.push({
                    id:'FileSelector',
                    getSelFile:(item)=>{this.getFiles(item)}
                  }
                );
              }else{
                Toast.show("没有权限操作","short");
              }
            }else{
              Toast.show("获取身份出错","short");
            }
          })
      }
      else{
        if(_this.props.managePermission){
          _this.props.nav.push({
              id:'FileSelector',
              getSelFile:(item)=>{this.getFiles(item)}
            }
          );
        }else{
          Toast.show("没有权限操作","short");
        }
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
    uploadImages(){
      this.close();
      if(_this.props.kbId==null){
        api.KB.checkKBManager()
          .then((res)=>{
            if(res.Type==1){
              if(res.Data){
                //是管理员，有权限操作
                _this.props.nav.push({
                  id: 'PhotoSelector',
                  getSelImg:(images)=>{this.getImgs(images)}
                })
              }else{
                Toast.show("没有权限操作","short");
              }
            }else{
              Toast.show("获取身份出错","short");
            }
          })
      }
      else{
        if(_this.props.managePermission){
          _this.props.nav.push({
            id: 'PhotoSelector',
            getSelImg:(images)=>{this.getImgs(images)}
          })
        }else{
          Toast.show("没有权限操作","short");
        }
      }
    }
    open(){
        this.setState({openView:true})
    }
  close(){
    this.setState({openView:false})
  }
    creatKB(){
      this.close();
      if(_this.props.kbId==null){
        api.KB.checkKBManager()
          .then((res)=>{
            if(res.Type==1){
              if(res.Data){
                //是管理员，有权限操作
                _this.setState({
                  promptVisible: true
                })
              }else{
                Toast.show("没有权限操作","short");
              }
            }else{
              Toast.show("获取身份出错","short");
            }
          })
      }
      else{
        if(_this.props.managePermission){
          _this.setState({
            promptVisible: true
          })
        }else{
          Toast.show("没有权限操作","short");
        }
      }
    }
  uploadImage(){
    this.close();
    if(_this.props.kbId==null){
      api.KB.checkKBManager()
        .then((res)=>{
          if(res.Type==1){
            if(res.Data){
              //是管理员，有权限操作
              var options = {
                maxWidth: 1000,
                maxHeight: 1000,
                aspectX: 1,
                aspectY: 1,
                quality: 1,
                allowsEditing: false
              };
              ImagePickerManager.launchCamera(options, (response)  => {
                // Same code as in above section!
                if (response.didCancel) {
                  ///console.log('User cancelled image picker');
                }
                else if (response.error) {
                  //console.log('ImagePickerManager Error: ', response.error);
                  Toast.show('出现未知错误',"short");

                }
                else {
                  const source = {uri:"file://"+response.path, isStatic: true};
                  var files=[{
                    uri:source.uri,
                    name:source.uri.split('/').pop()
                  }];
                  this.uploadFun(files)
                }
              });
            }else{
              Toast.show("没有权限操作","short");
            }
          }else{
            Toast.show("获取身份出错","short");
          }
        })
    }
    else{
      if(_this.props.managePermission){
        var options = {
          maxWidth: 1000,
          maxHeight: 1000,
          aspectX: 1,
          aspectY: 1,
          quality: 1,
          allowsEditing: false
        };
        ImagePickerManager.launchCamera(options, (response)  => {
          // Same code as in above section!
          if (response.didCancel) {
            ///console.log('User cancelled image picker');
          }
          else if (response.error) {
            //console.log('ImagePickerManager Error: ', response.error);
            Toast.show('出现未知错误',"short");

          }
          else {
            const source = {uri:"file://"+response.path, isStatic: true};
            var files=[{
              uri:source.uri,
              name:source.uri.split('/').pop()
            }];
            this.uploadFun(files)
          }
        });
      }else{
        Toast.show("没有权限操作","short");
      }
    }
  }
  uploadFun(files){
    _this.refs.LoaderView.startLoader();
    api.KB.directUpload(_this.props.kbId==null?0:_this.props.kbId,0,false,files)
      .then((res)=>{
        Toast.show(res.Data,"short");
        _this.refs.LoaderView.finishLoader();
        if(res.Type==1){
          _this.refs.kbList.getLists();
        }
        else{
          Toast.show(res.Data,"short");
        }
      }).catch((err)=>{Toast.show('出现未知错误',"short");})
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
        switch(index){
            case 0:
              this.props.nav.push({
                id:'SearchKb',
                kbId:this.props.kbId
              });
            break;
            case 1:
                this.refs.kbMenuView.open();
            break

        }
    }
  creatKBFile(value){
    //确认
    value=value.trim();
    if(value.length==0){
      Toast.show("输入项中不能有空格！","short");
      return;
    }
    //防止用户重复点击
    this.setState({creatFlag:true});
    api.KB.createKb(value,this.props.kbId)
    .then((res)=>{
        this.setState({creatFlag:false});
        if(res.Type==1){
          _this.setState({
            promptVisible: false
          });
          this.refs.kbList.getLists();
        }
        else{
          Toast.show(res.Data,"short");
        }

      })
  }
    havaKbData(value){
      //判断list是否有数据 控制导航栏右侧显示
      this.setState({fetchSuccess:value})
    }
    render() {
      _this=this;
        const titleConfig = {
            title: '文库',
            tintColor:'white'
        };
        return (
            <View style={{flex:1}}>
                <NavigationBar
                  style={{height: 55,backgroundColor:'#175898'}}
                  title={this.props.kbId==null?titleConfig:<Text/>}
                  leftButton={
                     this.props.kbId!=null?<View style={styles.navLeftBtn}>
                     <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={() => {this.props.nav.pop()}}>
                        <Icons
                          name="android-arrow-back"
                          size={28}
                          color="white"
                          onPress={() => {this.props.nav.pop()}}
                        />
                        </TouchableOpacity>
                      <Text numberOfLines={1} style={styles.navLeftText}>{this.props.kbName}</Text>
                     </View>:<View/>
                   }
                  rightButton={
                  this.state.fetchSuccess?<View style={{flexDirection: 'row',alignItems: 'center',marginRight:15}}>
                    <TouchableOpacity style={[styles.touIcon,{marginRight:15}]} onPress={this.kbMenu.bind(this,0)}>
                      <Icons
                        name='android-search'
                        size={25}
                        onPress={this.kbMenu.bind(this,0)}
                        color='white'
                        />
                        </TouchableOpacity>
                       <TouchableOpacity style={[styles.touIcon,{marginRight:-5}]} onPress={this.kbMenu.bind(this,1)}>
                          <Icons
                          name='android-add'
                          size={25}
                          onPress={this.kbMenu.bind(this,1)}
                          color='white'
                          />
                       </TouchableOpacity>
                    </View>:<Text/>
                   }/>
                 <KbList ref="kbList" nav={this.props.nav} kbId={this.props.kbId} isSuccess={this.havaKbData.bind(this)}/>
                <LoaderView ref="LoaderView" nav={this.props.nav}/>
                <KbMenuView ref="kbMenuView" nav={this.props.nav}/>
              <Prompt
                title="新建文件夹"
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

