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
var _this;
import Toast from  '@remobile/react-native-toast'


export default class CommentInput  extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isRank:0,
      textPlace:"",
      commentConfig:[],
      inputHeight:0
    };
    _this=this
  }
  startIn(commentConfig,comType){
    _this.setState({commentConfig:commentConfig});
    if(commentConfig.autoFocus||commentConfig.ParentId==-1){
      _this.refs.commtext.focus();
    }
    var currUser=api.User.getCurrentUser();
    var placeText="";
    if(comType==1){
      //一级评论
      placeText=currUser.Name+'回复'+commentConfig.creatActivityUser.Name;
      this.setState({isRank:0})
    }
    else{
      //二级评论
      placeText=currUser.Name+'回复'+commentConfig.Creator.Name;
      this.setState({isRank:1})
    }
    this.setState({textPlace:placeText})
  }
  componentDidMount() {
    _this=this;
  }

  submitComment(){
    var comment_model=[];
    if(this.state.isRank==0){
      comment_model={
        Id:0,
        ParentId:-1,
        ReplyId:-1,
        Body:this.state.commentBody,
        TenantId:this.props.commentConfig.activityId,
        UserCommented:this.props.commentConfig.creatActivityUser.Id,
        TenantType:this.props.commentConfig.TenantType,
        IsFeedback:false,
        IsOneLevel:true,
        OrderBy:0
      }
    }
    else{
      comment_model={
        Id:0,
        ParentId:this.state.commentConfig.ParentId,
        ReplyId:this.state.commentConfig.Id,
        Body:this.state.commentBody,
        TenantId:this.props.commentConfig.activityId,
        UserCommented:this.props.commentConfig.creatActivityUser.Id,
        TenantType:this.props.commentConfig.TenantType,
        IsFeedback:false,
        IsOneLevel:false,
        OrderBy:0
      }
    }
    var that=this;
    if(this.state.commentBody&&this.state.commentBody.length>32){
      Toast.show("评论内容最多不能超过32个字符","short");
      return;
    }
    if(this.state.commentBody){
      this.state.commentBody=this.state.commentBody.trim();
      if(this.state.commentBody.length==0){
        Toast.show("输入项中不能有空格","short");
        return;
      }
    }
    api.Comment.createComment(comment_model,null,null)
      .then((resData)=>{
        if(resData.Type!=1){
          Toast.show(resData.Data,"short");
          return;
        }
        else{
          that.props.newcommentItem(resData.Data);
          that.refs.commtext.blur();
          that.refs.commtext.clear();
          this.setState({
            commentBody:""
          });
        }
      })
  }
  render(){
    return(
      this.props.styleType==0?<View style={styles.commentTextView}>
        <View style={{flex:1,borderColor: '#D7D7D7',borderWidth: 1,marginRight:10,borderRadius: 8}}>
          <TextInput
            style={{backgroundColor:'white',height:Math.max(41,this.state.inputHeight)}}
            placeholder={this.state.textPlace}
            multiline={true}
            ref='commtext'
            clearTextOnFocus={true}
            selectionColor='red'
            textAlign={'start'}
            onChange={(event)=>{
              this.setState({inputHeight:event.nativeEvent.contentSize.height})
            }}
            onChangeText={(text) => this.setState({commentBody: text})}
            underlineColorAndroid="transparent"
            />
        </View>
        <TouchableOpacity onPress={_this.submitComment.bind(_this)} style={styles.commentTou}>
          <View style={{alignItems: 'center',justifyContent :'center'}}>
            <Text style={[styles.nomText,{color:'white'}]}>评论</Text>
          </View>
        </TouchableOpacity>
      </View>:<View style={styles.commentTextView}>
        <View style={{flex:1,borderBottomColor:'#D7D7D7',borderBottomWidth: 1,marginRight:5}}>
          <TextInput
            style={{height:Math.max(41,this.state.inputHeight)}}
            placeholder={this.state.textPlace}
            multiline={true}
            ref='commtext'
            clearTextOnFocus={true}
            selectionColor='red'
            textAlign={'start'}
            onChange={(event)=>{
              this.setState({inputHeight:event.nativeEvent.contentSize.height})
            }}
            onChangeText={(text) => this.setState({commentBody: text})}
            underlineColorAndroid="transparent"
            />
        </View>
        <TouchableOpacity onPress={_this.submitComment.bind(_this)} style={styles.commentTou1}>
          <View style={{alignItems: 'center',justifyContent :'center'}}>
            <Text style={{fontSize:15,color:'#565656'}}>回复</Text>
          </View>
        </TouchableOpacity>
      </View>

    )
  }
}

