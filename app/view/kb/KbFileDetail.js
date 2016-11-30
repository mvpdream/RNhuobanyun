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
  Linking,
  ActivityIndicator,
  WebView,
  NetInfo,
  Alert,
  ProgressBarAndroid,
  Dimensions
} from 'react-native';

import styles from "./style";
import _ from 'lodash'
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import KbList from './KbList.js'
import api from "../../network/ApiHelper";
var buttons;
var _this;
var menuIconName;
var icoName="file-text";
var iconColor;
var resData=[];
var str="";
import Prompt from 'react-native-prompt';
import Comment from '../common/Comment.js';
import CommentInput from '../common/CommentInput.js'
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var zanflag=false;
var commentTemp=[];
var twocomCofs=[];
var commentIndex=-1;
import ActionSheet from 'react-native-actionsheet';
var ImagePickerManager = require('NativeModules').ImagePickerManager;
const Actbuttons = ['取消', '回复', '删除'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;
import RNFS from 'react-native-fs';
var fileName="";
import LoaderView from '../common/LoaderView.js'
import AppConfig from '../App_configs'
var httpUrl=AppConfig.DOWNLOAD;

class KbMenuView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openView:false
    }
  }
  componentDidMount() {

  }
  getMenu(index){
    this.setState({openView:!this.state.openView});
    var item=_this.state.resData;
    if(item.IsLock){
      switch(index){
        case 0:
          //重命名
          _this.setState({
            promptVisible:true
          });
          break;
        case 1:
          //解锁
          _this.lockFiles();
          break;
        case 2:
            //删除
              Alert.alert(
            '刪除',
            '是否删除？',
            [
              {text: '取消'},
              {text: '确定', onPress: _this.removeFiles.bind(_this)}
            ]
          );
          break;
      }
    }
    else{
      switch(index){
        case 0:
          //替换
          if(_this.props.fileType==2){
            //图片选择
            _this.uploadImage();
          }else{
            _this.props.nav.push({
                id:'FileSelector',
                fileName:item.FileName,
                getSelFile:_this.updateFile.bind(_this)
              }
            );
          }

          break;
        case 1:
          //重命名
          _this.setState({
            promptVisible:true
          });
          break;
        case 2:
          //锁定
          _this.lockFiles();
          break;
        case 3:
          //删除
           Alert.alert(
            '刪除',
            '是否删除？',
            [
              {text: '取消'},
              {text: '确定', onPress: _this.removeFiles.bind(_this)}
            ]
          );
          break;
      }
    }
    if(!item.ManageLock&&item.IsLock){
      //当前是锁定状态但是没有权限解锁
      switch(index){
        case 0:
          //重命名
          _this.setState({
            promptVisible:true
          });
          break;
        case 1:
          //删除
           Alert.alert(
            '刪除',
            '是否删除该文件？',
            [
              {text: '取消'},
              {text: '确定', onPress: _this.removeFiles.bind(_this)}
            ]
          );
          break;
      }
    }
  }
  open(){
    var item=_this.state.resData;
    if(item.IsLock){
      buttons = ['重命名','解锁','删除'];
    }else{
      buttons = ['替换更新','重命名','锁定','删除'];
    }
    if(!item.ManageLock&&item.IsLock){
      //当前是锁定状态但是没有权限解锁
      buttons = ['重命名','删除'];
    }
    this.setState({openView:!this.state.openView})
  }
  render() {
    return (
      this.state.openView?
        <View style={styles.openViewView}>
          <TouchableOpacity style={styles.openViewTou} onPress={()=>{this.setState({openView:false})}} >
            <View style={styles.openUpView}>
              <View style={styles.openViewsView}>
                <View>
                  {
                    buttons&&buttons.map((item,index)=>{
                      switch(item){
                        case '重命名':
                          menuIconName="edit";
                          break;
                        case '替换更新':
                          menuIconName="upload";
                          break;
                        case '锁定':
                          menuIconName="lock";
                          break;
                        case '删除':
                          menuIconName="trash-o";
                          break;
                        case '解锁':
                          menuIconName="unlock";
                          break;

                      }
                      return(
                        <TouchableOpacity key={index} onPress={this.getMenu.bind(this,index)}>
                          <View style={index==buttons.length-1?[styles.modalTextView,{borderBottomWidth:0}]:styles.modalTextView}>
                            <Icon
                              name={menuIconName}
                              size={15}
                              color="#175898"
                              style={{marginLeft:10,width:16}}
                              />
                            <Text style={styles.modalText}>{item}</Text>
                          </View>
                        </TouchableOpacity>
                      )
                    })
                  }
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>:null
    )
  }
;
}
class HistoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAll:false
    }
  }
  componentDidMount() {

  }
  openAll(){
    this.setState({openAll:!this.state.openAll})
  }
  render() {
    return (
      _this.state.historyData.length==0?null:
        <View style={{marginTop:10,backgroundColor:'#ffffff',padding:15}}>
          <Text style={[styles.TextNom,{fontSize:15}]}>历史版本 ({_this.state.resData.AttachmentHistoryCount})</Text>
          {
            this.state.openAll?
              <View style={{marginTop:10}}>
                {
                  _this.state.historyData&&_this.state.historyData.map((item,index)=>{
                    return(
                      <Text style={[styles.TextNom,{padding:2}]} key={index}>{item.DateCreated} {item.UserCreated}</Text>
                    )

                  })
                }
              </View>:<View style={{marginTop:10}}>
              {
                _this.state.historyData&&_this.state.historyData.map((item,index)=>{
                  if(index<3){
                    return(
                      <Text style={[styles.TextNom,{padding:2}]} key={index}>{item.DateCreated} {item.UserCreated}</Text>
                    )
                  }
                })
              }
            </View>
          }
          {
            _this.state.historyData&&_this.state.historyData.length>3? <View style={{marginTop:10,flexDirection: 'row'}}>
              <TouchableOpacity  style={{width:Dimensions.get('window').width}} onPress={this.openAll.bind(this)}>
                <View style={{marginLeft:Dimensions.get('window').width-50}}>
                  <Icon
                    name="angle-double-down"
                    size={20}
                    onPress={this.openAll.bind(this)}
                    color="#175898"
                    />
                </View>
              </TouchableOpacity>
            </View>:null
          }


        </View>
    )
  }
;
}
class FavorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FavorUsers:[]
    }
  }
  componentDidMount(){
    zanflag=false;
    if(this.props.favorData.length>0){
      this.setState({FavorUsers:this.props.favorData});
      this.props.Favorcallback(this.props.favorData.length);
    }

  }
  toggleLike(kbId){
    api.KB.toggleFavoriteState(kbId)
      .then((resData)=>{
        var currUser=api.User.getCurrentUser();
        var obj={};
        obj.Avatar=currUser.Avatar;
        obj.Id=currUser.Id;
        obj.Name=currUser.Name;
        var falg=false;
        if(resData.Type==1){
          if(resData.Data=='收藏成功'){
            this.state.FavorUsers.push(obj);
            falg=true;
            zanflag=true
          }
          else{
            this.state.FavorUsers=_.reject(this.state.FavorUsers,obj);
            falg=false;
            zanflag=true
          }
          this.setState({FavorUsers:this.state.FavorUsers});
          this.props.Favorcallback(this.state.FavorUsers.length,falg);
        }else{
          ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
        }
      });

  }
  render() {
    var FavorUsersName=this.state.FavorUsers&&this.state.FavorUsers.map((obj)=> {
        return obj.Name;
      });
    if(this.props.favorData.length>0&&zanflag==false){
      this.state.FavorUsers=this.props.favorData;
    }
    return (
      FavorUsersName.length>0?
        <View style={styles.commentCView}>
          <Icon
            name="thumbs-up"
            size={16}
            color="#FCC44D"
            style={{marginLeft:5,padding:6}}
            />
          <Text style={[styles.nomText,{color:'#2C6DAF',width:Dimensions.get('window').width-80}]}>{FavorUsersName&&FavorUsersName.join(',')}</Text>
        </View>:null
    )
  }
;
}
class ZanNum extends Component{
  constructor(props) {
    super(props);
    this.state = {
      favorNum:-1,
      isFavored:false,
      favorFlag:false
    }
  }
  getnum(num){
    this.setState({favorNum:num})
  }
  getIsFavor(isf){
    if(isf!=null){
      this.setState({favorFlag:true,isFavored:isf})}
  }
  render(){
    if(!this.state.favorFlag){
      this.state.isFavored=this.props.isfav;}
    return(
      <View style={{alignItems: 'center',flexDirection: 'row'}}>
        <Icon
          name="thumbs-up"
          size={17}
          color={this.state.isFavored?'#FCC44D':'#175898'}
          style={{marginLeft:5,marginRight:5}}
          />
        <Text  style={[styles.nomText,{paddingRight:5}]}>
          <Text ref='favorUser'>{this.state.favorNum==-1?this.props.favorData.length:this.state.favorNum}</Text>
        </Text>
      </View>

    )
  }
}
export default class KbFileDetail extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        this.state = {
          resData:[],
          historyData:[],
          allHistory:false,
          isFavored:false,
          FavorUsers:[],
          commentConfig:[],
          proLen:0,
          downSize:0,
          sumSize:0,
          startDownLoad:false,
          imgUrls:[],
          havaIcon:false,
          startLoad:false,
          fetchSuccess:false,
          creatFlag:false,
          isFetch:false
        };
      _this=this;
    };
    componentDidMount() {
      resData=[];
      switch(this.props.fileType){
        case 1:
          this.getFileDetail();
          break;
        case 2:
          this.getImageDetail();
          break;
      }
      /**
       * 0 文件夹
       * 1 文件
       * 2 图片
       * 3 文章
       */
    }
    getFileDetail() {
      var Id = this.props.kbId;
      loaderHandler.showLoader("请稍等。。。");
      api.KB.getAttachmentDetail(Id)
      .then((res)=>{
        loaderHandler.hideLoader();
        if(res.Type==1){
          this.setState({isFetch:true});
          this.setState({fetchSuccess:true});
          this.getFileIcon(res.Data);
          str=res.Data.FileName.substring(0,res.Data.FileName.lastIndexOf("."));
          if (res.Data && res.Data.FavorUsers.length > 0) {
            this.setState({FavorUsers: res.Data.FavorUsers})
          }
          var isFavored = res.Data &&res.Data.IsFavorite;
          this.setState({isFavored: isFavored});
          var commentConfig = {
            creatActivityUser: res.Data.Creator,
            activityId: res.Data.Id,
            TenantType:"Attachment",
            autoFocus: false
          };
          this.refs.commentInput.startIn(commentConfig, 1);
          this.setState({
            resData:res.Data,
            commentConfig: commentConfig,
            historyData:res.Data.AttachmentHistory
          });

        }
        else{
          //获取详情失败
           this.setState({fetchSuccess:false});
        }
      })
    }
    getImageDetail() {
      var Id = this.props.kbId;
      loaderHandler.showLoader("请稍等。。。");
      api.KB.getImageDetail(Id)
        .then((res)=>{
          loaderHandler.hideLoader();
          if(res.Type==1){
            this.setState({isFetch:true});
            this.setState({fetchSuccess:true});
            this.getFileIcon(res.Data);
            str=res.Data.FileName.substring(0,res.Data.FileName.lastIndexOf("."));
            if (res.Data && res.Data.FavorUsers.length > 0) {
              this.setState({FavorUsers: res.Data.FavorUsers})
            }
            var isFavored = res.Data &&res.Data.IsFavorite;
            this.setState({isFavored: isFavored});
            var commentConfig = {
              creatActivityUser: res.Data.Creator,
              activityId: res.Data.Id,
              TenantType:"Attachment",
              autoFocus: false
            };
            if(res.Data&&res.Data.DownloadUrl.length!=0){
              this.state.imgUrls.push(res.Data.DownloadUrl);
            }
            this.refs.commentInput.startIn(commentConfig, 1);
            this.setState({
              resData:res.Data,
              commentConfig: commentConfig,
              historyData:res.Data.AttachmentHistory
            });

          }
          else{
            //获取详情失败
            this.setState({fetchSuccess:false});
          }
        })
    }
    openImgs(imgindex){
      this.props.nav.push({
        id: 'ImagesViewer',
        imageUrls:this.state.imgUrls,
        imgindex:imgindex
      });
    }
  uploadImage(){
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
          uri:source.uri,
          name:source.uri.split('/').pop()
        }];
        fileName=files[0].name;
        this.uploadFun(files);

      }
    });
  }
    kbMenu(){
      if(!this.props.managePermission){
        ToastAndroid.show("没有权限操作",ToastAndroid.SHORT);
      }
      else{
      this.refs.kbMenuView.open();}
    }
    beginFun(res){
      this.setState({
        proLen:0,
        sumSize:(res.contentLength/1024/1024).toFixed(2)
      })
    }
    progressFun(res){
      var downLength=res.bytesWritten;//已经下载的长度
      this.setState({
        proLen:downLength/res.contentLength
      });
      if(downLength==res.contentLength){
        this.setState({
          downLoadOk:true
        })
      }

    }
    downloadFiles(){
      //var a=RNFS.MainBundlePath;
      //var aa=RNFS.CachesDirectoryPath;
      //var aaa=RNFS.DocumentDirectoryPath;
      //var aaaa=RNFS.ExternalDirectoryPath;
      //var aaaaa=RNFS.TemporaryDirectoryPath;
      //var aaaaaa=RNFS.LibraryDirectoryPath;
      this.setState({startDownLoad:true});
      api.KB.downloadAttachment(this.state.resData.Id)
      .then((res)=>{
          if(res.Type==1&&res.Data.length!=0){
            var oldDir=RNFS.PicturesDirectoryPath;//"/storage/sdcard/Pictures""/storage/emulated/0/Pictures"
            var apkPat=oldDir.substr(0,oldDir.lastIndexOf("/"));
            var apkPath =apkPat+"/"+"Download"+"/"+this.state.resData.FileName;
            var option={
              fromUrl:httpUrl+res.Data[0].DownloadUrl,
              toFile:apkPath,
              begin:(res)=>_this.beginFun(res),
              progress:(res)=>_this.progressFun(res)
            };
            RNFS.readdir(apkPat+"/"+"Download")
            .then((res)=>{
                RNFS.downloadFile(option)
                  .then((res)=>{
                    //下载完直接打开
                    if(res.statusCode==200){
                      this.setState({startDownLoad:false});
                      this.openFile(option.toFile);
                    }
                    else{
                      ToastAndroid.show("下载失败，请重试",ToastAndroid.SHORT);
                    }
                  })
              }).catch((err)=>{
                //需要创建
                RNFS.mkdir(apkPat+"/"+"Download")
                  .then((res)=>{
                    if(res[0]){
                      RNFS.downloadFile(option)
                        .then((res)=>{
                          //下载完直接打开
                          if(res.statusCode==200){
                            this.setState({startDownLoad:false});
                            this.openFile(option.toFile);
                          }
                          else{
                            ToastAndroid.show("下载失败，请重试",ToastAndroid.SHORT);
                          }
                        }).catch((err)=>{ToastAndroid.show("下载失败，请重试",ToastAndroid.SHORT);})
                    }
                    else{
                      ToastAndroid.show("目录创建失败，无法下载",ToastAndroid.SHORT);
                    }
                  });
              })

          }else{
            ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
            this.setState({startDownLoad:false});
          }
        });
    }
    download() {
      var oldDir=RNFS.PicturesDirectoryPath;//"/storage/sdcard/Pictures""/storage/emulated/0/Pictures"
      var apkPat=oldDir.substr(0,oldDir.lastIndexOf("/"));
      var apkPath =apkPat+"/"+"Download"+"/"+this.state.resData.FileName;
    RNFS.readFile(apkPath,"base64")
    .then((res)=>{
        //存在文件可以直接打开
        this.openFile(apkPath);
      }).catch((err)=>{
        //下载
        NetInfo.fetch().done((reach) => {
          if(reach!="WIFI"){
            Alert.alert(
              '提示',
              `检测到当前设备出在非WIFI网络环境下\n是否继续下载？`,
              [
                {text: '取消'},
                {text: '确定', onPress: () =>this.downloadFiles()}
              ]
            )
          }else{
            this.downloadFiles()
          }
        })
      }

     );

  }
    openFile(path){
      Linking.canOpenURL("file://"+path).then(supported => {
        if (!supported) {
          ToastAndroid.show('没有对应的应用程序！',ToastAndroid.SHORT);
        } else {
          return Linking.openURL("file://"+path);
        }
      }).catch(err => ToastAndroid.show('打开失败！',ToastAndroid.SHORT));
    }
    removeFiles(){
      if(this.state.resData!=null){
        //文件删除
        api.KB.deleteAttachment(this.state.resData.Id)
          .then((res)=>{
            if(res.Type==1){
              this.props.removeFile(_this.state.resData.Id);
              this.props.nav.pop();
              ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
            }
            else{
              ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
            }
          });
      }
    }
    lockFiles(){
      if(this.state.resData!=null){
      if(this.state.resData.IsLock){
        //当前处于锁定状态，要进行解锁操作
        api.KB.undoAttachment(_this.state.resData.Id)
          .then((res)=>{
            if(res.Type==1){
              this.props.lockFile(_this.state.resData.Id);
              this.props.nav.pop();
            }
            else{
              ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
            }
          });
      }else{
        api.KB.lockAttachment(_this.state.resData.Id)
          .then((res)=>{
            if(res.Type==1){
              this.props.lockFile(_this.state.resData.Id);
              this.props.nav.pop();
            }
            else{
              ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
            }
          });
      }
      }
    }
    updateName(value){
      //重命名
      value=value.trim();
      if(value.length==0){
        ToastAndroid.show('输入项中不能有空格！',ToastAndroid.SHORT);
        return;
      }
      this.setState({creatFlag:true});
      if(this.state.resData!=null){
        //文件重命名||图片
        api.KB.renameAttachment(this.state.resData.Id,value)
          .then((res)=>{
            this.setState({creatFlag:false});
            if(res.Type==1){
              var newName=res.Data;
              this.props.updateFileName(newName,this.state.resData.Id);
              this.props.nav.pop();
            }
            else{
              ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
            }
          });
      }
      //弹出窗消失
      this.setState({
        promptVisible: false
      })
    }
    updateFile(files){
      //替换更新
      if(files!=null){
        fileName=files.name;
        var filesData=[{
          uri:"file://"+encodeURI(files.path),
          name:encodeURIComponent(files.name)
        }];
        this.uploadFun(filesData);
      }
    }
  uploadFun(files){
    loaderHandler.showLoader("请稍等。。。");
    api.KB.directUpload(this.state.resData.KbId,this.props.project&&this.props.project.projectId,this.state.resData.Id,true,files)
      .then((res)=>{
        ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
        loaderHandler.hideLoader();
        if(res.Type==1){
          var newName=fileName;
          this.props.updateFileName(newName,this.state.resData.Id);
          this.props.nav.pop();
        }
        else{
          ToastAndroid.show((res.Data==undefined||res.Data==null)?"未知错误":res.Data,ToastAndroid.SHORT);
        }
      }).catch((err)=>{ToastAndroid.show('出现未知错误',ToastAndroid.SHORT);});
  }
    favorNum(num,isFav){
      this.refs.favorNums.getnum(num);
      this.refs.favorNums.getIsFavor(isFav);
    }
    isFavoreds(isFavor){
      this.setState({isFavored:isFavor})
    }
    toggleLikeState(fileId){
      this.refs.favor.toggleLike(fileId);
    }
    deleteComment(commentItem,index){
      if(commentItem!=null){
        commentTemp=commentItem;
        commentIndex=index;
        //弹出可选回复和删除
        this.show();
      }
    }
    newcomItem(newcomItems){
      this.refs.commentList.addnewComment(newcomItems)
    }
    startTwoComment(twocomCof){
      commentTemp=twocomCof;
      this.refs.commentInput.startIn(twocomCof,2)
    }
    _handlePress(index) {
      if(index==1){
        this.refs.commentInput.startIn(commentTemp,2)
      }
      if(index==2){
        this.refs.commentList.deleteComments(commentTemp,commentIndex)
      }
    }
    show() {
      this.ActionSheet.show();
    }
    moreComment(){
      this.props.nav.push({
        id:'CommentList',
        creatorUser:this.state.resData.Creator,
        attachmentId:this.state.resData.Id
      })
    }
    getFileIcon(data){
      //後綴名
      var item=data;
      var index=item.FileName.lastIndexOf(".");
      var name=item.FileName.substring(index,item.FileName.length);
      this.setState({havaIcon:true});
      switch(name){
        case ".txt":
          icoName="file-text-o";
          iconColor="#91A7B9";
          break;
        case ".jpg":
        case ".jpeg":
        case ".png":
          icoName="file-image-o";
          iconColor="#E15555";
          break;
        case ".docx":
        case ".doc":
          icoName="file-word-o";
          iconColor="#3E9AE8";
          break;
        case ".xlsx":
        case ".xls":
          icoName="file-excel-o";
          iconColor="#2FB266";
          break;
        case ".pptx":
        case ".ppt":
          icoName="file-powerpoint-o";
          iconColor="#EB8B18";
          break;
        case ".rar":
        case ".zip":
          icoName="file-zip-o";
          iconColor="#7DCA3D";
          break;
        case ".pdf":
          icoName="file-pdf-o";
          iconColor="#CF2C34";
          break;
        case ".mp3":
        case ".amr":
          icoName="file-sound-o";
          iconColor="#8183F1";
          break;
        case ".mp4":
          icoName="file-movie-o";
          iconColor="#6D8AAB";
          break;
        default:
          icoName="file-text";
          iconColor="#BEC3C7";
          break;
      }
      this.forceUpdate();
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#EFF0F4'}}>
                <NavigationBar
                  style={styles.NavSty}
                  leftButton={
                   <NavLeftView nav={this.props.nav} leftTitle={this.props.kbName==null?"":this.props.kbName}/>
                   }
                  rightButton={
                  <View style={{flexDirection: 'row',alignItems: 'center'}}>
                   {
                        this.state.startLoad?<View style={styles.navLoadIcon}>
                          <ActivityIndicator animating={true} color='white'/>
                        </View>:null
                   }
                   {
                    this.state.fetchSuccess?<TouchableOpacity style={[styles.touIcon,{marginRight:5}]} onPress={this.kbMenu.bind(this)}>
                      <Icons
                        name='md-more'
                        size={25}
                        onPress={this.kbMenu.bind(this)}
                        color='white'
                        />
                      </TouchableOpacity>:<Text/>
                   }

                    </View>} />
              {
                this.state.isFetch?this.state.fetchSuccess? <ScrollView keyboardShouldPersistTaps={true}  keyboardDismissMode ='on-drag'>
                  <View style={{flex:1}}>
                    <View style={styles.fileInfoView}>
                      {
                        this.props.fileType==1? <View>
                          <View style={styles.allCenter}>
                            {
                              !this.state.havaIcon?null:<Icon
                                name={icoName}
                                size={40}
                                onPress={this.download.bind(this)}
                                color={iconColor}
                                />
                            }

                            <Text style={styles.TextTil} onPress={this.download.bind(this)}>{this.state.resData==""?"":this.state.resData.FileName+"   "}
                              {
                                this.state.resData.IsLock?
                                  <Icon
                                    name='lock'
                                    size={18}
                                    color='gray'
                                    />
                                  :null
                              }
                            </Text>
                          </View>
                          {
                            this.state.startDownLoad?
                              <ProgressBarAndroid styleAttr="Horizontal" progress={this.state.proLen} indeterminate={false} />
                              :null
                          }
                        </View>:
                          <View style={{width:Dimensions.get('window').width-30,height: Dimensions.get('window').width-30,alignItems: 'center',justifyContent: 'center'}}>
                            <TouchableOpacity onPress={this.openImgs.bind(this,0)}>
                              <Image
                                source={{uri:this.state.resData.DownloadUrl}}
                                resizeMode='contain'
                                onLoadStart={()=>this.setState({startLoad:true})}
                                onLoad={()=>this.setState({startLoad:false})}
                                style={{width:Dimensions.get('window').width-30,height: Dimensions.get('window').width-30}}
                                />
                            </TouchableOpacity>
                          </View>
                      }
                      <View style={{marginTop:15}}>
                        {this.state.resData.UserCreated==""?null:<Text style={[styles.TextNom,{padding:3}]}>{this.state.resData.UserCreated}</Text>}
                        {this.state.resData.UserLocked==""?null:<Text style={[styles.TextNom,{padding:3}]}>{this.state.resData.UserLocked}</Text>}
                        {this.state.resData.UserModified==""?null:<Text style={[styles.TextNom,{padding:3}]}>{this.state.resData.UserModified}</Text>}
                      </View>
                      {this.state.resData&&this.state.resData.length!=0?<View style={styles.infoBottom}>
                        <View></View>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{alignItems: 'center',flexDirection: 'row'}}>
                            <Icon
                              name="eye"
                              size={17}
                              color="#175898"
                              style={{marginLeft:5,marginRight:5}}
                              />
                            <Text style={[styles.nomText,{paddingRight:10}]}>{this.state.resData.UserHitCount}</Text>
                          </View>
                          <View style={{alignItems: 'center',flexDirection: 'row'}}>
                            <Icon
                              name="download"
                              size={17}
                              color="#175898"
                              style={{marginLeft:5,marginRight:5}}
                              />
                            <Text style={[styles.nomText,{paddingRight:10}]}>{this.state.resData.UserDownloadCount}</Text>
                          </View>
                          <TouchableOpacity onPress={this.toggleLikeState.bind(this,this.state.resData.Id)}>
                            <ZanNum ref='favorNums' favorData={this.state.FavorUsers&&this.state.FavorUsers} isfav={this.state.isFavored} />
                          </TouchableOpacity>
                        </View>
                      </View>:null}

                    </View>
                    <HistoryView/>

                    <FavorView ref='favor'
                               nav={this.props.nav}
                               favorData={this.state.FavorUsers&&this.state.FavorUsers}
                               Favorcallback={this.favorNum.bind(this)}
                               isfavoredfun={this.isFavoreds.bind(this)}/>

                    <View style={this.state.resData.Comments==null?null:styles.commViewCon}>
                      <Comment ref='commentList'
                               style={styles.commentView}
                               nav={this.props.nav}
                               comBody={styles.comBody}
                               comParBody={styles.comParBody}
                               commView={styles.commView}
                               deleteback={this.deleteComment.bind(this)}
                               commentList={this.state.resData&&this.state.resData.Comments==null?[]:this.state.resData.Comments}
                               commentConfig={this.state.commentConfig}
                               twoComment={this.startTwoComment.bind(this)}/>
                      {
                        this.state.resData.Comments&&this.state.resData.Comments.length>=10?
                          <View style={styles.moreComView}>
                            <TouchableOpacity style={styles.favorIconView} onPress={this.moreComment.bind(this)}>
                              <Text style={{fontSize:14,color:'#565656'}}>点击查看更多评论 </Text>
                              <Icon
                                name="angle-double-down"
                                size={20}
                                color="#565656"
                                />
                            </TouchableOpacity>
                          </View>:null
                      }
                    </View>


                  </View>

                </ScrollView>:<View style={[styles.noFile,{flex:1}]}>
                  <View style={styles.noFile}>
                    <Icon
                      name="exclamation-circle"
                      size={35}
                      color="#A5A2A2"
                      />
                    <Text style={{fontSize:14}}>没有找到该文件！</Text>
                  </View>
                </View>:null
              }

              <KbMenuView ref="kbMenuView" nav={this.props.nav}/>
              <ActionSheet
                ref={(o) => this.ActionSheet = o}
                options={Actbuttons}
                cancelButtonIndex={CANCEL_INDEX}
                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                onPress={this._handlePress.bind(this)}
                />
              {
                this.state.fetchSuccess? <View>
                  <CommentInput ref="commentInput" styleType={1} newcommentItem={this.newcomItem.bind(this)} commentConfig={this.state.commentConfig}/>
                </View>:null
              }
              <KbMenuView ref="kbMenuView" nav={this.props.nav}/>
              <Prompt
                title="重命名"
                defaultValue={str}
                visible={_this.state.promptVisible}
                submitText="确定"
                cancelText="取消"
                onCancel={ () => _this.setState({
                  promptVisible: false
                }) }
                onSubmit={_this.updateName.bind(this)}/>
              <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
            </View>
        );
    }
};

