'use strict';

import React, {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  TextInput,
  ScrollView,
  Component,
  Alert,
  Linking,
  InteractionManager,
  DeviceEventEmitter,
  BackAndroid,
  } from 'react-native';
import styles from "./style";
var Dimensions = require('Dimensions');
import api from "../../network/ApiHelper";
import apiUrl from '../../network/utils/Http.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
var {height, width} = Dimensions.get('window');
import CircleCheckBox from 'react-native-circle-checkbox';
import Comment from '../common/Comment.js';
import CommentInput from '../common/CommentInput.js'
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
var selectedItem=[];
var radioNum=1;
var FavorUsers=[];
import _ from 'lodash'
var isFirst=false;
import ActionSheet from 'react-native-actionsheet';
const buttons = ['取消', '回复', '删除'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;
import ImagesViewer from '../common/ImagesViewer.js'
import {downLoadFiles} from '../common/DownLoadFile.js'
var commentTemp=[];
var twocomCofs=[];
var commentIndex=-1;
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import {formatter} from '../../tools/DateHelper'
var HTMLView = require('react-native-htmlview');
import Popup from 'react-native-popup';
import Toast from  '@remobile/react-native-toast'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
var dismissKeyboard = require('dismissKeyboard');
import ZanNum from '../common/ZanNumView.js'
import ComNum from '../common/ComNumView.js'
import FavorView from '../common/FavorUsersView.js'
import NavigationBar from 'react-native-navbar';

//动态投票选择项cell
class Cell extends Component {
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {
      checkState:false,
      isNext:false
    };

  };
  checkItem(){
    this.setState({checkState: !this.state.checkState,isNext:!this.state.isNext});
    if(this.state.checkState){
      selectedItem.push(this.props.optionTemp);
    }
    else{
      var _index=selectedItem.indexOf(this.props.optionTemp);
      if(_index>-1){
        selectedItem.splice(_index,1)
      }
    }
    if(selectedItem.length>radioNum){
      Alert.alert(
        '警告',
        `做多可以选择：${radioNum}项`,
        [{text:'确定',onPress:()=>{
          this.setState({checkState: !this.state.checkState});
          var _index=selectedItem.indexOf(this.props.optionTemp);
          if(_index>-1){
            selectedItem.splice(_index,1)
          }
        }
        }]
      );
    }
  };
  render() {
    var item=this.props.optionTemp;
    return (
      <View style={styles.creatVoteR}>
        <TouchableOpacity style={{padding:6,alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between'}} onPress={this.checkItem.bind(this)}>
          <View style={{padding:5,flexDirection: 'row',alignItems: 'center'}}>
            <CircleCheckBox
              checked={this.state.checkState}
              outerColor='#175898'
              innerColor='#175898'
              outerSize={20}
              filterSize={15}
              innerSize={10}
              onToggle={this.checkItem.bind(this)}
              />
            <Text style={[styles.nomText,{marginLeft:6,width:Dimensions.get('window').width-166}]}>{item.Content}</Text>
          </View>
          <View>
            <Text style={styles.nomText}>({item.Count}人)</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
export default class ActivitiesDetail extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      activityData:[],
      optionData: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      isReceipt:false,
      recepteCont:"",
      TenantType:"",
      wasCreator:false,
      isVoted:true,
      isAnonymousVoted:false,
      isAllVoted:false,
      onlyBody:false,
      FavorUsers:[],
      isFavor:false,
      isComment:false,
      commentConfig:[],
      commentNum:0,
      AnnouncementTil:"",
      imgurl:"",
      isdisable:'none',
      isloadData:true,
      imgurls:[],
      isUnreceiptedUsers:false,
      isvotednums:0,
      isfavored:false,
      isDelete:false,
      ishaveAct:true,
      keyboardSpace: 0
    };
    this._onBackAndroid=this.onBackAndroid.bind(this);
  };
  componentDidMount() {
    radioNum=1;
    selectedItem=[];
    this.getActDetail();

  };
  componentWillUnmount() {

  }
  onBackAndroid(){
    /**
     * 设备物理后退键的事件
     */
    this.backList();
  };
  getUnreceiptedUsers(){
    this.setState({isUnreceiptedUsers:!this.state.isUnreceiptedUsers})
  }
  getActDetail(){
    var Id=this.props.activityId;
    loaderHandler.showLoader("加载中...");
    api.Activity.getActivityDetail(Id)
      .then((resData)=>{
        loaderHandler.hideLoader();
        if(resData.Type==1) {
          this.setState({isFetch:true});
          var AnnouncementTil = resData.Data && resData.Data.Items && resData.Data.Items.map((Announcementitem)=> {
              if (Announcementitem.TenantType == 'Announcement') {
                return Announcementitem.Title
              }
              else {
                return ""
              }
            });
          var hasVoted = resData.Data && resData.Data.Items && resData.Data.Items.filter((revoteitem)=> {
              if (revoteitem.TenantType == 'Receipt' || revoteitem.TenantType == 'Vote') {
                return revoteitem
              }
            });
          if (resData.Data.Items == "") {
            this.setState({onlyBody: true})
          }
          if (resData.Data.Items.length > 0 && resData.Data.Items[0].TenantType == 'Announcement' && resData.Data.Items.length == 1) {
            this.setState({onlyBody: true})
          }
          var wasCreator = resData.Data && resData.Data.Items && resData.Data.Items.filter((revoteitem)=> {
              if (revoteitem.TenantType == 'Receipt' || revoteitem.TenantType == 'Vote') {
                return revoteitem.WasCreator
              }
            });
          var IHadVoted = resData.Data && resData.Data.Items && resData.Data.Items.filter((revoteitem)=> {
              if (revoteitem.TenantType == 'Receipt') {
                return revoteitem
              }
            });
          var imgurls = resData.Data && resData.Data.Images && resData.Data.Images.map((urlItem)=> {
              return urlItem.DownloadUrl;
            });
          var Options = [];
          if (resData.Data.Items != "" && resData.Data.Items[0].hasOwnProperty('Options')) {
            Options = resData.Data.Items[0].Options;
          }
          var TenantType = resData.Data.Items && resData.Data.Items.map((tenantItem)=> {
              return tenantItem.TenantType;
            });
          if (resData.Data.Items != "" && resData.Data.Items[0].hasOwnProperty('MaxSelect')) {
            radioNum = resData.Data.Items[0].MaxSelect;
          }
          var isAnonymousVoted = resData.Data && resData.Data.Items && resData.Data.Items.map((Anonymousitem)=> {
              if (Anonymousitem.TenantType == 'Vote' && Anonymousitem.hasOwnProperty('Anonymous')) {
                return Anonymousitem.Anonymous
              }
              else {
                return false
              }
            });
          var isAllVoted = true;
          if (resData.Data.Items != "" && resData.Data.Items[0].Options == false) {
            isAllVoted = false;
            Options = [];
          }
          if (resData.Data && resData.Data.FavorUsers.length > 0) {
            this.setState({FavorUsers: resData.Data.FavorUsers})
          }
          var isFavored = resData.Data.IsFavorite;
          this.setState({isfavored: isFavored});
          var currUser = api.User.getCurrentUser();
          if (currUser.Id == resData.Data.UserCreated.Id) {
            //可以删除
            this.setState({isDelete: true})
          }
          var commentConfig = {
            creatActivityUser: resData.Data.UserCreated,
            activityId: resData.Data.Id,
            TenantType:"Activity",
            autoFocus: false
          };
          if (resData.Data&&resData.Data['Comments']&& resData.Data['Comments'].length) {
            this.setState({commentNum: resData.Data['Comments'].length})
          }
          this.setState({
            isloadData: false,
            activityData: resData.Data,
            isReceipt: hasVoted.length > 0 ? hasVoted[0].HasVoted : false,
            isAnonymousVoted: isAnonymousVoted[0],
            isAllVoted: isAllVoted,
            isVoted: hasVoted.length > 0 ? hasVoted[0].HasVoted : false,
            expiredTime: hasVoted.length > 0 ? hasVoted[0].ExpiredTime : "",
            recepteCont: IHadVoted.length > 0 ? IHadVoted[0].hasOwnProperty('IHadVoted') ? IHadVoted[0].IHadVoted[0] : "" : "",
            AnnouncementTil: AnnouncementTil[0],
            wasCreator: wasCreator.length > 0 ? wasCreator[0].WasCreator : false,
            TenantType: TenantType[0],
            commentConfig: commentConfig,
            isDisabled: false,
            optionData: this.state.optionData.cloneWithRows(Options),
            imgurls: imgurls
          });
          var nowTime = new Date();
          var expiredData = new Date(this.state.expiredTime);
          this.setState({isExtended: nowTime > expiredData});
          var isvotednums = 0;
          if (resData.Data.Items.length > 0 && resData.Data.Items[0].hasOwnProperty('Options') && (this.state.isVoted || nowTime > expiredData)) {
            //已投票的人数
            for (var i = 0; i < resData.Data.Items[0].Options.length; i++) {
              isvotednums += resData.Data.Items[0].Options[i].Count
            }
          }
          this.setState({isvotednums: isvotednums});
          if (this.props.isfouces == 1) {
            //从列表页进入的 应自动获得焦点
            var commentConfigs = {
              creatActivityUser: resData.Data.UserCreated,
              activityId: resData.Data.Id,
              autoFocus: true
            };
            this.refs.commentInput.startIn(commentConfigs, 1)
          }
          else {
            this.refs.commentInput.startIn(commentConfig, 1)
          }

        }
        else {
          this.setState({ishaveAct:false})
        }
      })

  }
  openImgs(imgIndex){
    BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
    this.props.nav.push({
      id: 'ImagesViewer',
      imageUrls:this.state.imgurls,
      imgindex:imgIndex
    });
  }
  submitVote(){
    if(selectedItem.length==0){
      Alert.alert(
        '警告',
        '请先选择对应的选项',
        [{text:'确定'}]
      );
    }
    else{
    var selectedVoteIds=selectedItem && selectedItem.map((voteitem)=> {
       return voteitem.Id
      });
    api.Activity.voteFor(selectedVoteIds)
    .then((resData)=>{
        if(resData.Type==1){
          Toast.show(resData.Data,"short");
          this.getActDetail();
        }
        else{
          Toast.show(resData.Data,"short");
        }
      });
    }
  }
  toggleLikeState(activityId){
    this.refs.favor.toggleLike(activityId);
  }
  voteandReceipt(Id,Content){
    api.Activity.voteFor(Id)
    .then((resData)=>{
        if(resData.Type==1){
          Toast.show(resData.Data,"short");
          this.setState({isReceipt:true,recepteCont:Content});
          this.props.getIsReceipt(true);
        }else{
          Toast.show(resData.Data,"short");
        }
      })
  }
  voteOrReceiptDetail(Id,type){
    BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
    this.props.nav.push({
      id: 'VoteOrReceiptDetail',
      optionId:Id,
      type:type
    });
  }
  downLoadfiles(fileName,fileUrl){
    downLoadFiles(fileName,fileUrl);
  }
  commentActivity(){
    var commentConfig={
      creatActivityUser:this.state.commentConfig.creatActivityUser,
      activityId:this.state.commentConfig.Id,
      autoFocus:true
    };
    this.refs.commentInput.startIn(commentConfig,1)
  }
  optionItem(optionTemp){
    return( <Cell optionTemp={optionTemp}/>)
  }
  backList(){
    dismissKeyboard();
    this.props.nav.pop();
  }
  ActivityScopesDetail(){
    BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
    this.props.nav.push({
      id: 'ActivityScopesDetail',
      activityId:this.state.activityData.Id
    });
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
  favorNum(num,isfav){
   this.refs.favorNums.getnum(num);
    this.refs.favorNums.getIsFavor(isfav);
    this.props.getfavorandcomNum(num,null,isfav);
  }
  isfavoredd(isfavor){
    this.setState({isfavored:isfavor})
  }
  commentsNum(num){
    this.refs.commNums.getnum(num);
    this.props.getfavorandcomNum(null,num,this.state.isfavored);
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
  deleteActivities(){
    Alert.alert(
      '提示',
      '确定删除该动态？',
      [
        {text: '取消'},
        {text: '确定', onPress:() => {
          this.props.deleteactivity(this.props.activityId,this.props.type==null?0:this.props.type);
        }}
      ]
    )

  }
  render() {
    var item=this.state.activityData;
    var UnreceiptedUsers= item&&item.Items && item.Items.filter((obj)=> {
        if(obj['TenantType']=='Receipt'&& obj.UnreceiptedUsers&& obj.hasOwnProperty('UnreceiptedUsers')){
          return obj;
        }
      });
    var body="<p>"+item.Body+"</p>";
    return (
    this.state.ishaveAct?<View style={{flex:1,backgroundColor:'white'}}>
       <NavigationBar
         style={{height: 55,backgroundColor:'#175898'}}
         leftButton={
                     <View style={styles.navLeftBtn}>
                     <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={this.backList.bind(this)}>
                        <Icons
                          name="android-arrow-back"
                          size={28}
                          color="white"
                          onPress={() => {this.props.nav.pop()}}
                        />
                         </TouchableOpacity>
                         <Text numberOfLines={1} style={styles.navLeftText}>动态详情</Text>
                     </View>
                   }
         rightButton={
                  <View style={{flexDirection: 'row',alignItems: 'center'}}>
                  {
                    this.state.isDelete?<TouchableOpacity style={[styles.touIcon,{marginRight:10}]} onPress={this.deleteActivities.bind(this)}>
                        <Icons
                          name='ios-trash'
                          size={25}
                          onPress={this.deleteActivities.bind(this)}
                          color='white'
                          />
                        </TouchableOpacity>:<View/>
                  }
                    </View>} />

      {this.state.isFetch?
        <View style={{flex:1}}>
       <ScrollView keyboardShouldPersistTaps={true}  keyboardDismissMode ='on-drag'>
         <View style={{backgroundColor:'white',padding:18,paddingBottom:0}}>

           <View style={styles.itemHead}>
             <Image
               source={{uri:item.UserCreated&&item.UserCreated.Avatar}}
               style={styles.itemUserimg}
               />
             <View style={styles.itemnamesope}>
               <Text style={styles.itemNamesope}>{item.UserCreated&&item.UserCreated.Name}</Text>
               {
                 item.Scopes==null?null:
                   <Text onPress={this.ActivityScopesDetail.bind(this)}
                         style={[styles.nomText,{color:'#64656B',marginLeft:3}]}>--{item.Scopes==""?"我自己":item.Scopes}  {item['CreatedTime']}
                   </Text>
               }

             </View>
           </View>
           {
             this.state.AnnouncementTil==""?null:
               <View style={styles.itemBody}>
                 <Text style={styles.nomText}>{this.state.AnnouncementTil}</Text>
               </View>
           }
           {
             item.Body==""||item.Body==null?null:<View style={styles.itemBody}>
               <HTMLView
                 value={body}
                 onLinkPress={(url) => {
              Linking.openURL(url);
              }}
                 stylesheet={baseStyles}
                 />
             </View>
           }
           <View style={styles.activityImageView}>
             {
               item.Images && item.Images.map((imageitem, index)=> {
                 return (
                   <TouchableOpacity key={index} onPress={this.openImgs.bind(this,index)}>
                     <View  style={{padding:10}}>
                       <Image
                         source={{uri:imageitem.Url}}
                         style={{width: 70,height: 85}}
                         />
                     </View>
                   </TouchableOpacity>
                 )
               })
             }
           </View>
           <View style={styles.activityImageView}>
             {
               item.Files && item.Files.map((filesitem, index)=> {
                 var ipos=filesitem.Name.lastIndexOf(".");
                 var str1=filesitem.Name.substring(0,ipos);
                 var str2=filesitem.Name.substring(ipos,filesitem.Name.length);
                 return (
                   <TouchableOpacity  style={{padding:5}} key={index} onPress={this.downLoadfiles.bind(this,filesitem.Name,filesitem.DownloadUrl)}>
                     <View style={{flexDirection: 'row',padding:5}}>
                       <Icon
                         name="file"
                         size={20}
                         color='#F0AD4E'
                         style={{width:25}}
                         />
                       <Text style={{color:'black',marginLeft:5}}>{str1.substr(0,18)+"···"+str2}</Text>
                     </View>
                   </TouchableOpacity>
                 )
               })
             }
           </View>

           {this.state.onlyBody?null:
           item.Items==null?null:
             <View style={styles.voteorRView}>
               {
                 this.state.TenantType=='Vote'?
                   <View style={{flex:1}}>
                     {
                       this.state.isVoted||this.state.isExtended?
                         this.state.isAllVoted?<View>
                           <View style={{paddingLeft:0}}>
                             <View style={{padding:6}}>
                               <Text style={styles.nomText}>{item.Items[0].Title}</Text>
                             </View>
                             <View style={{padding:5, justifyContent: 'space-between',alignItems: 'center',flexDirection: 'row'}}>
                               <Text style={[styles.nomText,{color:'#999'}]}>最多选择{item.Items[0].MaxSelect}项</Text>
                               <Text style={[styles.nomText,{color:'#999',marginLeft:15}]}>截止时间：{item.Items[0].ExpiredTime}</Text>
                             </View>
                           </View>
                           {
                             item.Items&&item.Items.map((obj)=>{
                               return obj['TenantType']=='Vote'&& obj.Options&& obj.Options.map((voteitem, index)=> {
                                   return(
                                     <View style={styles.creatVoteRs}>
                                       <View style={{paddingLeft:15,paddingRight:15}}>
                                         {
                                           this.state.isAnonymousVoted?
                                             <TouchableOpacity style={styles.actDetailTou} key={index}>
                                               <Text style={[styles.nomText,{width:Dimensions.get('window').width-180}]}>{voteitem.Content}</Text>
                                               <Text style={[styles.nomText,{color:'#0965B7'}]}>
                                                 <Text style={styles.nomText}>{this.state.isvotednums==0?"0.00":(voteitem.Count/this.state.isvotednums*100).toFixed(2)}%</Text>
                                                 ({voteitem.Count}人)
                                               </Text>
                                             </TouchableOpacity>
                                             :<TouchableOpacity style={styles.actDetailTou} onPress={this.voteOrReceiptDetail.bind(this,voteitem.Id,0)} key={index}>

                                             <Text style={[styles.nomText,{width:Dimensions.get('window').width-180}]}>{voteitem.Content}</Text>

                                             <Text style={[styles.nomText,{color:'#0965B7'}]}>
                                               <Text style={styles.nomText}>{this.state.isvotednums==0?"0.00":(voteitem.Count/this.state.isvotednums*100).toFixed(2)}%</Text>
                                               ({voteitem.Count}人)
                                             </Text>

                                           </TouchableOpacity>
                                         }
                                       </View>
                                       <View style={{backgroundColor:'#ddd'}}>
                                         <View style={[styles.progressView,
                                            {width:(Dimensions.get('window').width-50)*(voteitem.Count/this.state.isvotednums)}]
                                            }></View>
                                       </View>
                                     </View>
                                   )})})
                           }
                         </View>:<Text>无权查看投票结果</Text>
                         :
                         <View>
                           <View style={{paddingLeft:26}}>
                             <View style={{padding:6}}>
                               <Text style={styles.nomText}>
                                 <Text style={styles.nomText}>{item.Items[0].Title}</Text>
                               </Text>
                             </View>
                             <View style={{padding:5, justifyContent: 'space-between',alignItems: 'center',flexDirection: 'row'}}>
                               <Text style={[styles.nomText,{color:'#999'}]}>最多选择{item.Items[0].MaxSelect}项</Text>
                               <Text style={[styles.nomText,{color:'#999',marginLeft:15}]}>截止时间：{item.Items[0].ExpiredTime}</Text>
                             </View>
                           </View>
                           <View style={{marginLeft:23.5}}>
                             <ListView
                               dataSource={this.state.optionData}
                               renderRow={this.optionItem.bind(this)}
                               />
                           </View>
                           <View style={styles.submitVoteViews}>
                             <TouchableOpacity onPress={this.submitVote.bind(this)} style={styles.submitVotes}>
                               <View style={styles.submitVoteView}>
                                 <Text style={[styles.nomText,{color:'white'}]}>投票</Text>
                               </View>
                             </TouchableOpacity>
                           </View>
                         </View>
                     }
                   </View>
                   :this.state.wasCreator?
                   <View>
                     {
                       item.Items&&item.Items.map((obj)=>{
                         return obj['TenantType']=='Receipt'&& obj.Options&& obj.Options.map((voteitem, index)=> {
                             return(
                               <View style={styles.creatVoteR}>
                                 <TouchableOpacity style={styles.actDetailTou} onPress={this.voteOrReceiptDetail.bind(this,voteitem.Id,1)} key={index}>
                                   <Text style={[styles.nomText,{width:Dimensions.get('window').width-180}]}>{voteitem.Content}</Text>
                                   <Text style={[styles.nomText,{color:'#0965B7'}]}>({voteitem.Count}人)</Text>
                                 </TouchableOpacity>
                               </View>
                             )})})
                     }
                     <View style={styles.creatVoteR1}>
                       <TouchableOpacity onPress={this.getUnreceiptedUsers.bind(this)}>
                         <View style={{flexDirection: 'row',justifyContent: 'space-between',padding:6}}>
                           <Text style={styles.nomText}>未回执</Text>
                           <View style={{flexDirection: 'row',alignItems: 'center'}}>
                             <Text style={[styles.nomText,{color:'#0965B7'}]}>({UnreceiptedUsers&&UnreceiptedUsers[0].UnreceiptedUsers.length}人)</Text>
                             {
                               this.state.isUnreceiptedUsers?
                                 <Icon
                                   name="caret-down"
                                   size={15}
                                   color='#616060'
                                   style={{marginLeft:10,width:13}}
                                   />:<Icon
                                 name="caret-right"
                                 size={15}
                                 color='#616060'
                                 style={{marginLeft:10,width:13}}
                                 />
                             }

                           </View>
                         </View>
                       </TouchableOpacity>
                     </View>
                     {
                       this.state.isUnreceiptedUsers?
                         <View style={styles.unrecticed}>
                           <Text style={[styles.nomText,{fontSize: 13,color:'#636262'}]}>{UnreceiptedUsers&&UnreceiptedUsers[0].UnreceiptedUsers.toString()}</Text>
                         </View>:null
                     }
                   </View>

                   :this.state.isReceipt?<Text>我已选择回执：{this.state.recepteCont}</Text>:
                    item.Items==null?null:
                     <View style={{justifyContent: 'center',alignItems: 'center'}}>
                       <Text>请立即选择下方的回执</Text>
                       <View style={[styles.activityImageView,{justifyContent: 'center'}]}>
                         {
                           item.Items&&item.Items.map((obj)=>{
                             return obj['TenantType']=='Receipt'&& obj.Options&& obj.Options.map((voteitem, index)=> {
                                 return(
                                   <TouchableOpacity style={{padding:10}} onPress={this.voteandReceipt.bind(this,voteitem.Id,voteitem.Content)} key={index}>
                                     <View style={styles.voteCont}>
                                       <Text style={[styles.nomText,{color:'white'}]}>{voteitem.Content}</Text>
                                     </View>
                                   </TouchableOpacity>
                                 )
                               })
                           })
                         }
                       </View>
                   </View>

               }
             </View>
           }


           <View style={styles.itemBottoms}>
             <Text>{item['CreateDate']}</Text>
             <View style={{flexDirection: 'row'}}>
               <TouchableOpacity onPress={this.commentActivity.bind(this)}>
                 <View style={{alignItems: 'center',flexDirection: 'row'}}>
                   <Icon
                     name="commenting"
                     size={17}
                     color="#175898"
                     style={{marginLeft:5,marginRight:5}}
                     />
                   <Text style={[styles.nomText,{paddingRight:10}]}>评论
                     <ComNum ref='commNums' favorData={item.Comments==null?[]:item.Comments} />
                   </Text>
                 </View>
               </TouchableOpacity>
               <TouchableOpacity onPress={this.toggleLikeState.bind(this,item.Id)}>
                 <ZanNum
                   ref='favorNums'
                   favorData={this.state.FavorUsers&&this.state.FavorUsers}
                   isfav={this.state.isfavored} />
               </TouchableOpacity>
             </View>
           </View>
           <View>
             <FavorView ref='favor'
                        nav={this.props.nav}
                        favorData={this.state.FavorUsers&&this.state.FavorUsers}
                        activityId={this.props.activityId}
                        Favorcallback={this.favorNum.bind(this)}
                        isfavoredfun={this.isfavoredd.bind(this)}/>
           </View>
         </View>
         <View style={{paddingBottom:10,marginTop:10}}>
           <Comment ref='commentList'
                    nav={this.props.nav}
                    deleteback={this.deleteComment.bind(this)}
                    commentList={item.Comments==null?[]:item.Comments}
                    commentConfig={this.state.commentConfig}
                    commcallback={this.commentsNum.bind(this)}
                    twoComment={this.startTwoComment.bind(this)}/>
         </View>
       </ScrollView>
       <View>
         <ActionSheet
           ref={(o) => this.ActionSheet = o}
           options={buttons}
           cancelButtonIndex={CANCEL_INDEX}
           destructiveButtonIndex={DESTRUCTIVE_INDEX}
           onPress={this._handlePress.bind(this)}
           />
       </View>

       <View>
         <CommentInput ref="commentInput" styleType={0} newcommentItem={this.newcomItem.bind(this)} commentConfig={this.state.commentConfig}/>
       </View>
       <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
       <Popup ref={(popup) => { this.popup = popup }}/>
        </View>:<View style={{flex:1}}>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white'/>
      </View>}
     </View>:<View style={{flex:1,backgroundColor:'white'}}>
       <NavigationBar
         style={{height: 55,backgroundColor:'#175898'}}
         leftButton={
                     <View style={styles.navLeftBtn}>
                     <TouchableOpacity style={[styles.touIcon,{marginRight:20,marginLeft:15}]} onPress={this.backList.bind(this)}>
                        <Icons
                          name="android-arrow-back"
                          size={28}
                          color="white"
                          onPress={() => {this.props.nav.pop()}}
                        />
                         </TouchableOpacity>
                         <Text numberOfLines={1} style={styles.navLeftText}>动态详情</Text>
                     </View>
                   }
         rightButton={
                  <View style={{flexDirection: 'row',alignItems: 'center'}}>
                  {
                    this.state.isDelete?<TouchableOpacity style={[styles.touIcon,{marginRight:10}]} onPress={this.deleteActivities.bind(this)}>
                        <Icons
                          name='ios-trash'
                          size={25}
                          onPress={this.deleteActivities.bind(this)}
                          color='white'
                          />
                        </TouchableOpacity>:<View/>
                  }
                    </View>} />
       <View style={styles.noruleViewV}>
         <Icon
           name="exclamation-circle"
           size={50}
           color="#717171"
           />
         <Text style={styles.noruleViewText}>找不到该动态！</Text>
       </View>
     </View>

    );
  }
};
var baseStyles = StyleSheet.create({
  p: {
    color:'black',
    fontSize: 14
  },
  a: {
    fontWeight: '200',
    color: '#00C'
  }
});

