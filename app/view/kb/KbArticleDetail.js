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
  Component,
  TextInput,
  ScrollView,
  Linking,
  ProgressBarAndroid,
  WebView,
  AsyncStorage
  } from 'react-native';
import styles from "./style";
import _ from 'lodash'
import NavigationBar from 'react-native-navbar';
var Dimensions=require('Dimensions');
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var {height, widths} = Dimensions.get('window');
import KbList from './KbList.js'
import api from "../../network/ApiHelper";
var buttons;
var _this;
var menuIconName;
var icoName="file";
var iconColor;
var resData=[];
var str="";
import Prompt from 'react-native-prompt';
import Popup from 'react-native-popup';
import Comment from '../common/Comment.js';
import CommentInput from '../common/CommentInput.js'
var BusyIndicator = require('react-native-busy-indicator');
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var zanflag=false;
var commentTemp=[];
var twocomCofs=[];
var commentIndex=-1;
import ActionSheet from 'react-native-actionsheet';
const Actbuttons = ['取消', '回复', '删除'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;
import RNFS from 'react-native-fs';
import WebViewBridge from 'react-native-webview-bridge';
import Toast from  '@remobile/react-native-toast'

class KbMenuView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openView:false
    }
  }
  getMenu(index){
    this.setState({openView:!this.state.openView});
    var item=_this.state.resData;
    switch(index){
      case 0:
        //重命名
        _this.setState({
          promptVisible:true
        });
        break;
      case 1:
        //删除
        _this.popup.confirm({
          title: '刪除',
          content: ['是否删除该文章？'],
          cancel: {
            text: '取消'
          },
          ok: {
            text: '确定',
            callback:_this.removeFiles.bind(_this)
          }
        });
        break;
    }
  }
  open(){
    buttons = ['重命名','删除'];
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
          <Text style={[styles.TextNom,{fontSize:15}]}>历史版本 ({_this.state.resData.ArticleHistoryCount})</Text>
          {
            this.state.openAll?
              <View style={{marginTop:10}}>
                {
                  _this.state.historyData&&_this.state.historyData.map((item,index)=>{
                    return(
                      <Text style={styles.TextNom} key={index}>{item.DateCreated} {item.UserCreated}</Text>
                    )

                  })
                }
              </View>:<View style={{marginTop:10}}>
              {
                _this.state.historyData&&_this.state.historyData.map((item,index)=>{
                  if(index<3){
                    return(
                      <Text style={styles.TextNom} key={index}>{item.DateCreated} {item.UserCreated}</Text>
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
    api.KB.toggleArticleFavoriteState(kbId)
      .then((resData)=>{
        var currUser=api.User.getCurrentUser();
        var obj={};
        obj.Avatar=currUser.Avatar;
        obj.Id=currUser.Id;
        obj.Name=currUser.Name;
        var falg=false;
        if(resData.Type==1){
          if(resData.Data=='收藏成功!'){
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
          Toast.show(resData.Data,"short");
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
            style={{marginLeft:5,marginTop:10,padding:5}}
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
      favorNums:-1,
      isFavored:false,
      favorFlag:false
    }
  }
  getnum(num){
    this.setState({favorNums:num})
  }
  getIsFavor(isf){
    if(isf!=null){
      this.setState({favorFlag:true,isFavored:isf})}
  }
  render(){
    if(!this.state.favorFlag){
      this.state.isFavored=this.props.isfav;}
    return(
      <View style={styles.favorIconView}>
        <TouchableOpacity onPress={_this.toggleLikeState.bind(_this,_this.state.resData.Id)}>
          <View style={styles.favorIcon}>
            <Icon
              name="thumbs-up"
              size={26}
              color={this.state.isFavored?'#FCC44D':'#175898'}
              />
          </View>
        </TouchableOpacity>
        <Text style={[styles.nomText,{marginLeft:5}]}>
          <Text ref='favorUser'>{this.state.favorNum==-1?this.props.favorData.length:this.state.favorNum}</Text>
        </Text>
      </View>

    )
  }
}
export default class KbArticleDetail extends React.Component{
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
      height:0,
      creatFlag:false,
      fetchSuccess:false,
      startLoad:false,
      jsEnabled:true,
      isFetch:false
    };
    _this=this;

  };
  componentDidMount() {
    resData=[];
    this.getArticleDetail();
    this.wbReload();
    //AsyncStorage.clear()
    //.then((res)=>{
    //
    //  })


  }
  getArticleDetail() {
    var Id = this.props.kbId;
    loaderHandler.showLoader("请稍等。。。");
    api.KB.getArticleDetail(Id)
      .then((res)=>{
        loaderHandler.hideLoader();
        this.setState({isFetch:true});
        if(res.Type==1){
          str=res.Data.FileName;
          if (res.Data && res.Data.FavorUsers.length > 0) {
            this.setState({FavorUsers: res.Data.FavorUsers})
          }
          var isFavored = res.Data &&res.Data.IsFavorite;
          this.setState({isFavored: isFavored});
          var commentConfig = {
            creatActivityUser: res.Data.UserCreated,
            activityId: res.Data.Id,
            TenantType:"Article",
            autoFocus: false
          };
          this.refs.commentInput.startIn(commentConfig, 1);
          this.setState({
            resData:res.Data,
            commentConfig: commentConfig,
            historyData:res.Data.ArticleHistory
          });
          AsyncStorage.getItem(this.props.kbId.toString())
            .then((resHeight)=>{
              //读取本地缓存数据
              if(resHeight!="0"){
                this.setState({
                  height:parseInt(resHeight)
                });
              }
            }).catch((err)=>{this.wbReload();})

        }
        else{
          //获取详情失败

        }
      });
    if(this.refs.webviewbridge){
      this.refs.webviewbridge.reload();
    }
  }

  kbMenu(){
    if(!this.props.managePermission){
      Toast.show("没有权限操作","short");
    }
    else{
      this.refs.kbMenuView.open();
    }
  }
  removeFiles(){
    if(this.state.resData!=null){
      //文章删除
      api.KB.deleteArticle(this.state.resData.Id)
        .then((res)=>{
          if(res.Type==1){
            this.props.removeFile(_this.state.resData.Id);
            this.props.nav.pop();
            Toast.show(res.Data,"short");
          }
          else{
            Toast.show(res.Data,"short");
          }
        });
    }
  }
  updateName(value){
    //重命名
    value=value.trim();
    if(value.length==0){
      Toast.show('输入项中不能有空格',"short");
      return;
    }
    this.setState({creatFlag:true});
    if(this.state.resData!=null){
      api.KB.renameArticle(this.state.resData.Id,value)
        .then((res)=>{
          this.setState({creatFlag:false});
          if(res.Type==1){
            var newName=res.Data;
            this.props.updateFileName(newName,this.state.resData.Id);
            this.props.nav.pop();
          }
          else{
            Toast.show(res.Data,"short");
          }
        });
    }
    //弹出窗消失
    this.setState({
      promptVisible: false
    })
  }
  onBridgeMessage(message){
    var BodyHeight=parseInt(message);
    this.setState({height:BodyHeight});
  };
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
    this.refs.commentList&&this.refs.commentList.addnewComment(newcomItems)
  }
  startTwoComment(twocomCof){
    commentTemp=twocomCof;
    this.refs.commentInput&&this.refs.commentInput.startIn(twocomCof,2)
  }
  _handlePress(index) {
    if(index==1){
      this.refs.commentInput&&this.refs.commentInput.startIn(commentTemp,2)
    }
    if(index==2){
      this.refs.commentList&&this.refs.commentList.deleteComments(commentTemp,commentIndex)
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
  wbReload(){
    //重新加载webview
    this.refs.webviewbridge&&this.refs.webviewbridge.reload();
  }
  webViewStart(){
    this.setState({startLoad:true});

  }
  webViewFinish(){
    this.setState({startLoad:false});
    var value=this.state.height.toString();
    if(this.state.resData.length!=0){
      AsyncStorage.setItem(this.props.kbId.toString(),value)
        .then((res)=>{
         //存储本地缓存数据
        })
    }

  }
  render() {
    //backgroundColor:'#EFF0F4'
    /**
     * webView自适应高度 解决方案：https://github.com/dongrenguang/react-native-webview-bridge
     * onLoadStart={()=>ToastAndroid.show("开始加载"+this.state.height, ToastAndroid.SHORT)}
     *onLoadEnd={()=>ToastAndroid.show("当网页加载结束调用，不管是成功还是失败", ToastAndroid.SHORT)}
     *onLoad={()=>ToastAndroid.show("当网页加载结束的时候调用", ToastAndroid.SHORT)}
     *onError={()=>ToastAndroid.show("当网页加载失败的时候调用", ToastAndroid.SHORT)}
     */

    return (
      <View style={{flex:1,backgroundColor:'#EFF0F4'}}>
        <NavigationBar
          style={{height: 55,backgroundColor:'#175898'}}
          leftButton={
                     <View style={styles.navLeftBtn}>
                      <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={() => {this.props.nav.pop()}}>
                        <Icons
                          name="android-arrow-back"
                          size={28}
                          color="white"
                          onPress={() => {this.props.nav.pop()}}
                        />
                        </TouchableOpacity>
                     </View>

                   }
          rightButton={
                  <View style={{flexDirection: 'row',alignItems: 'center'}}>
                   {
                        this.state.startLoad?<View style={styles.navLoadIcon}>
                          <ProgressBarAndroid styleAttr='Inverse' color='white' />
                        </View>:null
                   }
                    <TouchableOpacity style={[styles.touIcon,{marginRight:10}]} onPress={this.kbMenu.bind(this)}>
                      <Icons
                        name='android-more-vertical'
                        size={25}
                        onPress={this.kbMenu.bind(this)}
                        color='white'
                        />
                      </TouchableOpacity>
                    </View>
                   } />
        {this.state.isFetch?<ScrollView ref="scroll" keyboardShouldPersistTaps={true}  keyboardDismissMode ='on-drag'>
          <View style={{flex:1}}>
            <View style={styles.fileInfoView}>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.TextTil} >{this.state.resData==""?"":this.state.resData.FileName}
                </Text>
              </View>
              <View style={styles.infoBottom}>
                <View style={styles.kbCellView}>
                  <Image
                    source={{uri:this.state.resData.UserCreated&&this.state.resData.UserCreated.Avatar}}
                    style={styles.itemUserimgs}
                    />
                  <Text style={[styles.TextNomSml,{marginLeft:5}]}>{this.state.resData.UserCreated&&this.state.resData.UserCreated.Name}</Text>
                  <Text style={[styles.TextNomSml,{marginLeft:5}]}>{this.state.resData.CreatedTime}</Text>
                </View>
                <View style={{alignItems: 'center',flexDirection: 'row'}}>
                  <Icon
                    name="undo"
                    size={12}
                    onPress={this.wbReload.bind(this)}
                    color="#175898"
                    style={{marginLeft:5,marginRight:10}}
                    />
                  <Icon
                    name="eye"
                    size={15}
                    color="#175898"
                    style={{marginLeft:5,marginRight:5}}
                    />
                  <Text style={[styles.nomText,{paddingRight:10}]}>{this.state.resData.UserHitCount}</Text>
                </View>
              </View>
              <View>
                <WebViewBridge
                  ref="webviewbridge"
                  style={{height:this.state.height}}
                  onBridgeMessage={this.onBridgeMessage.bind(this)}
                  javaScriptEnabled={true}
                  onLoadStart={this.webViewStart.bind(this)}
                  onLoad={this.webViewFinish.bind(this)}
                  injectedJavaScript={'function p(){var sz=document.documentElement.scrollHeight||document.body.scrollHeight;WebViewBridge.send(sz);};p();setInterval(p, 500);'}
                  source={{html:this.state.resData.Body}}/>
              </View>

              <View>
                <ZanNum ref='favorNums' favorData={this.state.FavorUsers&&this.state.FavorUsers} isfav={this.state.isFavored} />
              </View>

            </View>
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
        </ScrollView>:null}



        <KbMenuView ref="kbMenuView" nav={this.props.nav}/>
        <ActionSheet
          ref={(o) => this.ActionSheet = o}
          options={Actbuttons}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this._handlePress.bind(this)}
          />
        {
          <View>
            <CommentInput ref="commentInput" styleType={1} newcommentItem={this.newcomItem.bind(this)} commentConfig={this.state.commentConfig}/>
          </View>
        }
        <Popup ref={(popup) => { this.popup = popup }}/>
        <Prompt
          title="重命名"
          defaultValue={str}
          visible={_this.state.promptVisible}
          submitText="确定"
          cancelText="取消"
          onCancel={ () => _this.setState({
                  promptVisible: false
                }) }
          onSubmit={this.state.creatFlag?()=>{}:_this.updateName.bind(this)}/>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>
    );
  }
};

