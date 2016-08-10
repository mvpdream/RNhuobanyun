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
  Alert,
  Component
  } from 'react-native';
var Dimensions = require('Dimensions');
import api from "../../network/ApiHelper";
import styles from "./style";
import Icon from 'react-native-vector-icons/Ionicons';
var placeText='';
import _ from 'lodash'
import Toast from  '@remobile/react-native-toast'
var msg="";

export default class Comment  extends React.Component {
  constructor(props) {
    super(props);
    const nav = this.props.nav;
    this.state = {
      isComment:false,
      isFirst:false,
      isRank:0,
      ParentId:0,
      ReplyId:0,
      isCommcreator:false,
      isxian:true
    }
  }
  componentDidMount() {
    if(this.props.commentList.length!=0&&this.props.commcallback!=null){
      this.props.commcallback(this.props.commentList.length);
    }
  }
  addnewComment(newComment){
    this.props.commentList.push(newComment);
    this.forceUpdate();
    if(this.props.commcallback!=null){
    this.props.commcallback(this.props.commentList.length);
    }
  }
  deleteComments(commentsitem,index){
    //let deleteArr=[];
    //this.props.commentList&&this.props.commentList.forEach((a)=>
    //{
    //  if(a.ParentId!=null&&a.ParentId==commentsitem.Id||a.Id==commentsitem.Id)
    //  {
    //    deleteArr.push(a)
    //  }
    //});
   //评论的创建人（删除自己创建的）活着是动态的创建人（删除动态下的所有评论）
    Alert.alert('删除评论','是否删除该评论？',[{text: '取消' },{text: '确认', onPress: () => {
      api.Comment.removeComment(commentsitem.Id)
      .then((resData)=>{
          Toast.show(resData.Data,"short");
          if(resData.Type==1){
            var evens = _.remove(this.props.commentList,(a)=>{
              return a.ParentId!=null&&a.ParentId==commentsitem.Id||a.Id==commentsitem.Id;
            });
            if(evens!=0){
              Toast.show("删除成功","short");
            }
            if(this.props.commcallback!=null){
              this.props.commcallback(this.props.commentList.length);
            }
            this.forceUpdate();
          }else{
            Toast.show("删除失败","short");
          }
        })
    }}]);
  }
  render() {
    var item=this.props.commentList;
    return (
    this.props.commentList&&this.props.commentList.length>0?
      <View style={{flex:1}}>
      <View style={this.props.commView==null?styles.commView:this.props.commView}>
        {
          item&&item.map((commentsitem, index)=> {
            return (
              <View key={index} style={this.props.style==null?styles.commentView:this.props.style}>
                <View style={{alignItems: 'center',flexDirection:'row',justifyContent: 'space-between'}}>
                  <View style={{flexDirection:'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft:10,
                      marginTop:5}}>
                  <Image
                    source={{uri:commentsitem.Creator.Avatar}}
                    style={styles.itemUserimgs}
                    />
                  <Text style={[styles.nomText,{marginLeft:5}]}>{commentsitem.Creator.Name}</Text>
                    </View>
                  <View>
                    <Text style={styles.dateText}>{commentsitem.DateCreated}</Text>
                  </View>
                </View>
                <View style={this.props.comParBody==null?styles.comParBody:this.props.comParBody}>
                <TouchableOpacity onPress={this.startComment.bind(this,commentsitem,index)}>
                  <View style={this.props.comBody==null?styles.comBody:this.props.comBody}>
                    {
                      commentsitem.Receiver==null?
                        <Text style={[styles.nomText,{paddingRight:10}]}>{commentsitem.Body}</Text>
                        :
                        <Text>
                          <Text style={styles.nomText}>回复</Text>
                          <Text style={[styles.nomText,{color:'#304E82'}]}>{commentsitem.Receiver.Name}:</Text>
                          <Text style={[styles.nomText,{paddingRight:10}]}>{commentsitem.Body}</Text>
                        </Text>
                    }
                    </View>
                </TouchableOpacity>
                </View>
              </View>
            )})
        }
      </View>
      </View>:null
    )}
  startComment(commentObj,index){
    var currUser=api.User.getCurrentUser();
    var activityCeator=this.props.commentConfig.creatActivityUser;
    if(commentObj.ParentId==null){
      commentObj.ParentId=-1;
    }
    if(currUser.Id==activityCeator.Id||currUser.Id==commentObj.Creator.Id){
      this.props.deleteback(commentObj,index)
    }
   else{
      this.props.twoComment(commentObj)
    }
  }
  openText(commentObj){
    var currUser=api.User.getCurrentUser();
    this.setState({isxian:false});
    if(commentObj==null){
      //外部点击
      placeText=currUser.Name+'回复'+this.props.commentConfig.creatActivityUser.Name;
      this.setState({
        isComment:true,
        isRank:0
      });
      this.refs.commtext.focus();
    }
    else{
      if(commentObj.ParentId==null){
        commentObj.ParentId=-1;
      }
      placeText=currUser.Name+'回复'+commentObj.Creator.Name;
      this.setState({
        isComment:true,
        isRank:1,
        ParentId:commentObj.ParentId,
        ReplyId:commentObj.Id
      });
      this.refs.commtext.focus();
    }
  }
  closeText(){
    this.setState({
      isRank:0,
      isComment:false
    });
  }
};

