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
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import api from "../../network/ApiHelper";
import styles from "./style";
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import CommentInput from '../common/CommentInput.js'
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
var zanflag=false;
var commentTemp=[];
var twocomCofs=[];
var commentIndex=-1;
import ActionSheet from 'react-native-actionsheet';
const Actbuttons = ['取消', '回复', '删除'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;
var activityData=new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
var firstLoad=false;
var oneData=[];

import _ from 'lodash'
export default class CommentList extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      AllData:[],
      hasActData:true,
      page:1,
      hasMore:false,
      ishavedata:true,
      isnodata:false,
      commentConfig:[],
      allList: activityData.cloneWithRows({})
    }
  }
  componentDidMount() {
    this.state.AllData =[];
    this.state.page= 1;
    firstLoad=true;
    this.getComments();
  }
  getComments(){
    api.KB.getAttachmentComments(this.props.attachmentId,this.state.page)
      .then((resData)=>{
        if(resData.Data&&resData.Data.length==0&&firstLoad){
          //第一次加载，且没有数据的时候
          this.setState({hasActData:false});
        }
        if(this.state.AllData.length==0&&firstLoad){
          this.state.AllData = resData.Data;
        }
        if(this.state.AllData.length>0&&this.state.AllData.length<5){
          this.setState({hasMore:false});
        }
        if(!firstLoad){
          var oldDataLen=this.state.AllData.length;
          this.state.AllData = this.state.AllData.concat(resData.Data);
          if(this.state.AllData.length==oldDataLen){
            ToastAndroid.show("没有数据咯",ToastAndroid.SHORT);
            this.setState({hasMore:false});
            return;
          }
        }
        var commentConfig = {
          creatActivityUser: this.props.creatorUser,
          activityId: this.props.attachmentId,
          TenantType:"Attachment",
          autoFocus: false
        };
        this.refs.commentInput.startIn(commentConfig, 1);
        this.setState({
          isRefreshControl:false,
          commentConfig:commentConfig,
          allList:activityData.cloneWithRows(this.state.AllData)
        });
      })

  };
  renderFooter() {
    return (
    this.state.hasMore&&<View ref='footerView' style={styles.footerView}>
      <View style={{width:30,height:30,justifyContent: 'center'}}>
       <ActivityIndicator
              animating={true}
              color='blue'
            />
      </View>
      <Text style={styles.footerText}>
        数据加载中……
      </Text>
    </View>);
  }
  onScroll() {
    this.state.hasMore=true;
  }
  onEndReached(){
    if (this.state.hasMore) {
      this.state.page++;
      firstLoad=false;
      this.setState({ishavedata:true});
      this.getComments();
    }
  };
  onRefresh(){
    firstLoad=false;
    oneData=[];
    this.setState({
      page:1,
      AllData:[],
      hasMore:true,
      isRefreshControl:true
    });
    this.getComments();

  }
  startComment(commentObj,index){
    var currUser=api.User.getCurrentUser();
    var activityCeator=this.state.commentConfig.creatActivityUser;
    if(commentObj.ParentId==null){
      commentObj.ParentId=-1;
    }
    if(currUser.Id==activityCeator.Id||currUser.Id==commentObj.Creator.Id){
      this.deleteComment(commentObj,index);
    }
    else{
      this.startTwoComment(commentObj);
    }
  }
  deleteComment(commentItem,index){
    if(commentItem!=null){
      commentTemp=commentItem;
      commentIndex=index;
      //弹出可选回复和删除
      this.show();
    }
  }
  addnewComment(newComment){
    var currentData=this.state.AllData;
    //添加到数组的开始位置
    currentData.unshift(newComment);
    var temp=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.setState({
      allList: temp.cloneWithRows(currentData)
    });
  }
  newcomItem(newcomItems){
    this.addnewComment(newcomItems);
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
      this.deleteComments(commentTemp,commentIndex)
    }
  }
  deleteComments(commentsitem,index){
    //评论的创建人（删除自己创建的）活着是动态的创建人（删除动态下的所有评论）
    Alert.alert('删除评论','是否删除该评论？',[{text: '取消' },{text: '确认', onPress: () => {
      api.Comment.removeComment(commentsitem.Id)
        .then((resData)=>{
          ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
          if(resData.Type==1){
            if(index>-1){
              var currentData=this.state.AllData;
              var evens = _.remove(currentData,(a)=>{
                return a.ParentId!=null&&a.ParentId==commentsitem.Id||a.Id==commentsitem.Id;
              });
              if(evens!=0){
                ToastAndroid.show("删除成功",ToastAndroid.SHORT);
              }
              var temp=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
              this.setState({
                allList: temp.cloneWithRows(currentData)
              });
            }
          }else{
            ToastAndroid.show("删除失败",ToastAndroid.SHORT);
          }
        })
    }}]);
  }
  show() {
    this.ActionSheet.show();
  }
  activityItem(item,sectionID, rowID){
    return( <View key={rowID} style={styles.commentListView}>
      <View style={{alignItems: 'center',flexDirection:'row',justifyContent: 'space-between'}}>
        <View style={{flexDirection:'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft:10,
                      marginTop:5}}>
          <Image
            source={{uri:item.Creator.Avatar}}
            style={styles.itemUserimgs}
            />
          <Text style={[styles.nomText,{marginLeft:5}]}>{item.Creator.Name}</Text>
        </View>
        <View>
          <Text style={styles.dateText}>{item.DateCreated}</Text>
        </View>
      </View>
      <View style={styles.comParBody1}>
        <TouchableOpacity onPress={this.startComment.bind(this,item,rowID)}>
          <View style={styles.comBody1}>
            {
              item.Receiver==null?
                <Text style={[styles.nomText,{paddingRight:10}]}>{item.Body}</Text>
                :
                <Text>
                  <Text style={styles.nomText}>回复</Text>
                  <Text style={[styles.nomText,{color:'#304E82'}]}>{item.Receiver.Name}:</Text>
                  <Text style={[styles.nomText,{paddingRight:10}]}>{item.Body}</Text>
                </Text>
            }
          </View>
        </TouchableOpacity>
      </View>
    </View>)
  }
  render() {
    return (
      <View style={{flex:1}}>
        <NavigationBar
          style={styles.NavSty}
          leftButton={
          <NavLeftView nav={this.props.nav} leftTitle="评论列表"/>
                   }
           />
      <View style={{flex: 1,backgroundColor:'#EFF0F4'}}>
        {this.state.hasActData? <ListView
          dataSource={this.state.allList}
          style={{backgroundColor:'white'}}
          renderRow={this.activityItem.bind(this)}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={5}
          removeClippedSubviews={false}
          enableEmptySections={true}
          onScroll={this.onScroll.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshControl}
                onRefresh={this.onRefresh.bind(this)}
                title="Loading..."
                colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
              />
             }
          />:
          <View style={styles.noruleViewV}>
            <Icons
              name="exclamation-circle"
              size={50}
              color="#717171"
              />
            <Text style={styles.noruleViewText}>暂无相关数据</Text>
          </View>
        }
      </View>
        <ActionSheet
          ref={(o) => this.ActionSheet = o}
          options={Actbuttons}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this._handlePress.bind(this)}
          />
        <CommentInput ref="commentInput" newcommentItem={this.newcomItem.bind(this)} commentConfig={this.state.commentConfig}/>
      </View>
    )}
};

