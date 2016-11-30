import React, {Component} from 'react'
import {
     Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    RefreshControl,
    Alert,
  Dimensions
} from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import api from "../../network/ApiHelper";
import Cell from "./KbCellItem.js"
var dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1.title !== row2.title});
import ActionSheet from 'react-native-actionsheet';
var buttons = ['取消', '替换更新','重命名','锁定/解锁','删除'];
const button = ['取消','重命名','删除'];
const CANCEL_INDEX = 0;
var itemData;
var newName="";
import Prompt from 'react-native-prompt';
import _ from "lodash";
var ImagePickerManager = require('react-native-image-picker');
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var firstLoad=false;
var oneData=[];
import LoaderView from '../common/LoaderView.js'
export default class KbList extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {
          dataSource:dataSource,
          icoName:"",
          hasFile:true,
          isFile:false,
          isArticle:false,
          isImg:false,
          resData:[],
          newName:"",
          isLock:false,
          isRefreshControl:false,
          creatFlag:false,
          hasKbData:false
        };
    };
  componentDidMount(){
    if (this.props.type != 'search'&&this.props.project==null) {
       loaderHandler.showLoader("请稍等。。。");
      this.getLists();
    }
    if(this.props.project){
       loaderHandler.showLoader("请稍等。。。");
      this.getProjectKbLists();
    }
  }
  getLists(){
    this.state.dataSource=dataSource;
    api.KB.getKBFileList(this.props.kbId)
      .then((res)=>{
        if(!this.state.isRefreshControl){
        loaderHandler.hideLoader();
        }
        if(res.Type==1){
          if(this.props.isSuccess!=null){
            this.props.isSuccess(true)
          }
          this.setState({
            resData:res.Data
          });
          if(this.state.resData.length==0){
            this.setState({hasFile:false,isRefreshControl:false});

          }else{
            this.setState({
              isRefreshControl:false,
              hasFile:true,
              dataSource:this.state.dataSource.cloneWithRows(res.Data)});
          }
          if(this.refs.list&&this.state.resData.length<=5){
            this.refs.list.scrollTo({x:0,y:0,animated:false});
          }
        }
        else{
          if(this.props.isSuccess!=null){
            this.props.isSuccess(false)
          }
          this.setState({hasFile:false,isRefreshControl:false});
          ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
        }
      }).catch((err) => {
        //未知错误
        ToastAndroid.show("未知错误",ToastAndroid.SHORT);
      });
  }
  getProjectKbLists(isRefreshControl) {
    if (isRefreshControl == null) {
      loaderHandler.showLoader("请稍等。。。");
      this.state.dataSource = dataSource;
    }
    api.Project.getProjectKb(this.props.project.projectId,this.props.kbId)
      .then((res)=> {
        loaderHandler.hideLoader();
        if (res.Type == 1) {
          if (this.props.isSuccess != null) {
            this.props.isSuccess(true)
          }
          this.setState({
            resData: res.Data
          });
          if (this.state.resData.length == 0) {
            this.setState({hasFile: false, isRefreshControl: false});

          } else {
            this.setState({
              isRefreshControl: false,
              hasFile: true,
              dataSource: dataSource.cloneWithRows(res.Data)
            });
          }
          if (this.refs.list && this.state.resData.length > 0 && this.state.resData.length <= 5) {
            this.refs.list.scrollTo({x: 0, y: 0, animated: false});
          }
        }
        else {
          if (this.props.isSuccess != null) {
            this.props.isSuccess(false)
          }
          this.setState({hasFile: false, isRefreshControl: false});
          ToastAndroid.show(res.Data);
        }
      }).catch((err) => {
        //未知错误
      });
  }
  onRefresh(){
    firstLoad=false;
    oneData=[];
    this.setState({
      resData:[],
      isRefreshControl:true
    });
    if(this.props.project){
      this.getProjectKbLists(true);
    }else{
      this.getLists(true);
    }
  }
  getFiles(files){
    if(files!=null){
      var filesData=[{
        uri:"file://"+encodeURI(files.path),
        name:encodeURIComponent(files.name)
      }];
      this.refs.loaderView.startLoader();
      api.KB.directUpload(this.props.kbId == null ? 0 : this.props.kbId, this.props.project&&this.props.project.projectId,itemData.Id, true, filesData)
        .then((res)=>{
          ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
          this.refs.loaderView.finishLoader();
          if(res.Type==1){
            newName=files.name;
            this.updateListFun("update");
          }
          else{
            ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
          }
        }).catch((err) => {
          //未知错误
          ToastAndroid.show(err,ToastAndroid.SHORT);
        });
    }
  }
  uploadImage(){
    let that=this;
    var options = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从图库中获取',
      maxWidth: 1000,
      maxHeight: 1000,
      aspectX: 1,
      aspectY: 1,
      quality: 1,
      allowsEditing: false
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
        ///console.log('User cancelled image picker');
      }
      else if (response.error) {
        //console.log('ImagePickerManager Error: ', response.error);
        ToastAndroid.show('出现未知错误',ToastAndroid.SHORT);
      }
      else {
        const source = {uri:"file://"+response.path, isStatic: true};
          var files=[{
            uri:encodeURI(source.uri),
            name:encodeURIComponent(source.uri.split('/').pop())
          }];
        that.refs.loaderView.startLoader();
        api.KB.directUpload(that.props.kbId==null?0:that.props.kbId,that.props.project&&that.props.project.projectId,itemData.Id,true,files)
        .then((res)=>{
            if(res.Type==1){
              that.refs.loaderView.finishLoader();
              newName=source.uri.split('/').pop();
              that.updateListFun("update");
            }
            else{
              ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
            }
          })

      }
    });
  }
  _handlePress(index) {
    if(itemData&&itemData.Type==1||itemData&&itemData.Type==2){
      if(itemData.IsLock){
        //鎖定了沒有替換更新
        switch(index){
          case 1:
            //重命名
            this.setState({
              promptVisible:true
            });
            break;
          case 2:
            //解锁
            this.lockKb();
            break;
          case 3:
            //删除
            Alert.alert(
              '刪除',
              '是否删除？',
              [
                {text: '取消'},
                {text: '确定', onPress: this.deleteKb.bind(this)}
              ]
            );
            break;
        }
      }else{
      switch(index){
        case 1:
          //替换
          if(itemData&&itemData.Type==2){
            //图片选择
            this.uploadImage();
          }else{
            this.props.nav.push({
                id:'FileSelector',
                fileName:itemData.FileName,
                getSelFile:(item)=>{this.getFiles(item)}
              }
            );
          }

          break;
        case 2:
          //重命名
          this.setState({
            promptVisible:true
          });
          break;
        case 3:
          //锁定
          this.lockKb();
          break;
        case 4:
          //删除
          Alert.alert(
            '刪除',
            '是否删除？',
            [
              {text: '取消'},
              {text: '确定', onPress: this.deleteKb.bind(this)}
            ]
          );
          break;
      }
      }
    }if((itemData&&!itemData.ManageLock&&itemData.IsLock)||itemData&&itemData.Type==0||itemData&&itemData.Type==3){
      switch(index){
        case 1:
          //重命名
          this.setState({
            promptVisible:true
          });
          break;
        case 2:
          //删除
          var msg="";
          if(itemData.IsKb){
            //文件夹删除操作
            msg="删除文件夹会同时删除该文件夹下的所有文件。\n确定要删除吗？"
          }
          else{
            msg="是否删除该文件？"
          }
          Alert.alert(
            '刪除',
            msg,
            [
              {text: '取消'},
              {text: '确定', onPress: this.deleteKb.bind(this)}
            ]
          );
          break;
      }
    }
  }
  show() {
    this.ActionSheet.show();
  }
  getSearchList(keyword,projectId) {
    var _this = this;
    this.state.dataSource = dataSource;
   loaderHandler.showLoader("请稍等。。。");
    api.KB.search(this.props.kbId, keyword,projectId)
      .then((res)=> {
        loaderHandler.hideLoader();
        if (res.Data.length == 0) {
          _this.setState({hasFile: false})
        }
        else {
          if (_this.refs.list) {
            _this.setState({
              dataSource: _this.state.dataSource.cloneWithRows(res.Data),
              hasFile: true
            });
          }

        }
      }).catch((err) => {
        //未知错误
      });
  }
  updateListFun(typeName){
    var currentData=this.state.resData;
    if(currentData&&currentData.length>0&&!!itemData){
      let tempIds=_.pluck(currentData,'Id'),
        _index=tempIds.indexOf(itemData['Id'])
        ;
      if(_index>-1){
        switch(typeName){
          case "update":
            currentData[_index].FileName=newName;
            break;
          case "delete":
            currentData.splice(_index,1);
            break;
          case "lock":
            currentData[_index].IsLock=!currentData[_index].IsLock;
            currentData[_index].ManageLock=!currentData[_index].ManageLock;
            break
        }
        var temp=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.setState({
          dataSource: temp.cloneWithRows(currentData)
        });
      }
    }
  }
  deleteKb(){
    if(itemData!=null){
      switch(itemData.Type){
        case 0:
          //文库
          api.KB.deleteKb(itemData.Id)
            .then((res)=>{
              if(res.Type==1){
                this.updateListFun("delete");
              }
              else{
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
              }
            });
          break;
        case 1:
        case 2:
          //文件/图片
          api.KB.deleteAttachment(itemData.Id)
            .then((res)=>{
              if(res.Type==1){
                this.updateListFun("delete");
              }
              else{
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
              }
            });
          break;
        case 3:
          //文章
          api.KB.deleteArticle(itemData.Id)
            .then((res)=>{
              if(res.Type==1){
                this.updateListFun("delete");
              }
              else{
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
              }
            });
          break;
      }
    }
  }
  lockKb(){
    if(itemData.IsLock){
      //当前处于锁定状态，要进行解锁操作
      api.KB.undoAttachment(itemData.Id)
      .then((res)=>{
        if(res.Type==1){
          this.updateListFun("lock");
        }
        else{
          ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
        }
      });
    }else{
      api.KB.lockAttachment(itemData.Id)
        .then((res)=>{
          if(res.Type==1){
            this.updateListFun("lock");
          }
          else{
            ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
          }
        });
    }
  }
  updateName(value){
    //重命名
    value=value.trim();
    if(value.length==0){
      ToastAndroid.show("输入项中不能有空格！",ToastAndroid.SHORT);
      return;
    }
    this.setState({creatFlag:true});
    if(itemData!=null){
      switch(itemData.Type){
        case 0:
          //文库
          api.KB.renameKb(itemData.Id,value)
            .then((res)=>{
              this.setState({creatFlag:false});
              if(res.Type==1){
                newName=value;
                this.updateListFun("update");
              }
              else{
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
              }
            });
          break;
        case 1:
        case 2:
          //文件重命名||图片
          api.KB.renameAttachment(itemData.Id,value)
            .then((res)=>{
              this.setState({creatFlag:false});
              if(res.Type==1){
                newName=res.Data;
                this.updateListFun("update");
              }
              else{
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
              }
            });
          break;
        case 3:
          //文章重命名
          api.KB.renameArticle(itemData.Id,value)
            .then((res)=>{
              this.setState({creatFlag:false});
              if(res.Type==1){
                newName=res.Data;
                this.updateListFun("update");
              }
              else{
                ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
              }
            });
          break;
      }
    }
    //弹出窗消失
    this.setState({
      promptVisible: false
    })
  }
  getItem(item){
    //长按操作菜单 文章没有替换更新方法
    /**
     * 0 文件夹
     * 1 文件
     * 2 图片
     * 3 文章
     */
    if(!item.ManagePermission){
      ToastAndroid.show("没有权限操作",ToastAndroid.SHORT);
    }
    if(item!=null&&item.ManagePermission){
      itemData=item;
      if(item.IsLock){
        buttons = ['取消','重命名','解锁','删除'];
      }else{
        buttons = ['取消', '替换更新','重命名','锁定','删除'];
      }
      if(!item.ManageLock&&item.IsLock){
        //当前是锁定状态但是没有权限解锁
        buttons = ['取消','重命名','删除'];
      }
      switch(item.Type){
        case 0:
          this.setState({isFile:false});
          break;
        case 1:
          this.setState({isFile:true});
          break;
        case 2:
          this.setState({isImg:true});
          break;
        case 3:
          this.setState({isArticle:true});
          break;
      }
      this.show()
    }
  }
  promptCancel(){
    this.setState({
      promptVisible: false
    })
  }
  updateFileName(value,Id){
    var currentData=this.state.resData;
    if(currentData&&currentData.length>0){
      let tempIds=_.pluck(currentData,'Id'),
        _index=tempIds.indexOf(Id)
        ;
      if(_index>-1){
         currentData[_index].FileName=value;
        }
        var temp=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.setState({
          dataSource: temp.cloneWithRows(currentData)
        });
      }

  }
  removeFile(Id){
    var currentData=this.state.resData;
    if(currentData&&currentData.length>0){
      let tempIds=_.pluck(currentData,'Id'),
        _index=tempIds.indexOf(Id)
        ;
      if(_index>-1){
        currentData.splice(_index,1);
      }
      var temp=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
      this.setState({
        dataSource: temp.cloneWithRows(currentData)
      });
    }
  }
  lockFile(Id){
    var currentData=this.state.resData;
    if(currentData&&currentData.length>0){
      let tempIds=_.pluck(currentData,'Id'),
        _index=tempIds.indexOf(Id)
        ;
      if(_index>-1){
        currentData[_index].IsLock=!currentData[_index].IsLock;
        currentData[_index].ManageLock=!currentData[_index].ManageLock;
      }
      var temp=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
      this.setState({
        dataSource: temp.cloneWithRows(currentData)
      });
    }
  }
  updateFile(Id){
    var currentData=this.state.resData;
    if(currentData&&currentData.length>0){
      let tempIds=_.pluck(currentData,'Id'),
        _index=tempIds.indexOf(Id)
        ;
      if(_index>-1){
        currentData[_index].FileName=value;
      }
      var temp=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
      this.setState({
        dataSource: temp.cloneWithRows(currentData)
      });
    }
  }
  renderItem(item) {
    return( <Cell
      itemTemp={item}
      menuText={buttons}
      nav={this.props.nav}
      callback={this.getItem.bind(this)}
      updateFile={this.updateFile.bind(this)}
      updateFileName={this.updateFileName.bind(this)}
      removeFile={this.removeFile.bind(this)}
      lockFile={this.lockFile.bind(this)}
      project={this.props.project&&this.props.project}/>)
  }
  render() {
    var str=itemData&&itemData.FileName.substring(0,itemData.FileName.lastIndexOf("."));
    var newStr=itemData&&itemData.Type==1||itemData&&itemData.Type==2?str:itemData&&itemData.FileName;
      return (
            <View style={{flex:1,backgroundColor:'white'}}>

                <View style={styles.listViewSty}>
                  {
                    this.props.type!='search'?
                        <ListView
                          style={{paddingBottom:10}}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderItem.bind(this)}
                        ref="list"
                        refreshControl={
                          <RefreshControl
                            refreshing={this.state.isRefreshControl}
                            onRefresh={this.onRefresh.bind(this)}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                          />
                        }
                      />:
                      <ListView
                        ref="list"
                        dataSource={this.state.dataSource}
                        renderRow={this.renderItem.bind(this)}
                      />
                  }

                  {!this.state.hasFile?
                    <View style={styles.noDataView}>
                      <Icon
                        name="exclamation-circle"
                        size={50}
                        color="#717171"
                        />
                      <Text style={styles.noDataViewText}>没有文件</Text>
                    </View>:null
                  }

                </View>

              <ActionSheet
                ref={(o) => this.ActionSheet = o}
                options={itemData&&itemData.Type==1||itemData&&itemData.Type==2?buttons:button}
                tintColor='black'
                cancelButtonIndex={CANCEL_INDEX}
                onPress={this._handlePress.bind(this)}
                />
              <Prompt
                title="重命名"
                defaultValue={newStr}
                visible={this.state.promptVisible}
                submitText="确定"
                cancelText="取消"
                onCancel={this.promptCancel.bind(this)}
                onSubmit={this.state.creatFlag?()=>{}:this.updateName.bind(this)}/>
              <LoaderView ref="loaderView"/>
              <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
            </View>
        )
    }
};

