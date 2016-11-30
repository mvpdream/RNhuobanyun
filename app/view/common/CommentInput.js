import React, {Component} from 'react'
import {
 Image,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  TextInput,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';

import api from "../../network/ApiHelper";
import styles from "./style";
import Icon from 'react-native-vector-icons/Ionicons';
var placeText='';
import _ from 'lodash'
var _this;

let commBody="";


export default class CommentInput  extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isRank:0,
      textPlace:"",
      commentConfig:[],
      inputHeight:0,
      commentBody:""
    };
    _this=this
  }
  startIn(commentConfig,comType){
    _this.setState({commentConfig:commentConfig});
    if(commentConfig.autoFocus||commentConfig.ParentId==-1){
      _this.refs.commtext.focus();
    }
    _this.refs.commtext.clear();
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
        ParentId:this.state.commentConfig.ParentId==-1?this.state.commentConfig.Id:this.state.commentConfig.ParentId,
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
      ToastAndroid.show("评论内容最多不能超过32个字符",ToastAndroid.SHORT);
      return;
    }
    if(this.state.commentBody){
      this.state.commentBody=this.state.commentBody.trim();
      if(this.state.commentBody.length==0){
        ToastAndroid.show("输入项中不能有空格",ToastAndroid.SHORT);
        return;
      }
    }
    api.Comment.createComment(comment_model,null,null)
      .then((resData)=>{
        if(resData.Type!=1){
          ToastAndroid.show((resData.Data==undefined||resData.Data==null)?"未知错误":resData.Data,ToastAndroid.SHORT);
          return;
        }
        else{
          that.props.newcommentItem(resData.Data);
          that.refs.commtext.blur();
          that.refs.commtext.clear();
          this.setState({
            commentBody:"",
            inputHeight:41
          });
        }
      })
  }
  endEdit(){
    //_this.refs.commtext.clear();
  }
  getText(text){
    commBody=text;
    this.state.commentBody=text;
    //this.setState({commentBody: commBody})
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
            selectionColor='red'
            onChange={(event)=>{
              this.setState({inputHeight:event.nativeEvent.contentSize.height})
            }}
            onChangeText={(text) => {console.log(text);_this.setState({commentBody: text})}}
            underlineColorAndroid="transparent"
            />
        </View>
        <TouchableOpacity onPress={this.submitComment.bind(this)} style={styles.commentTou}>
          <View style={{alignItems: 'center',justifyContent :'center'}}>
            <Text style={[styles.nomText,{color:'white'}]}>评论</Text>
          </View>
        </TouchableOpacity>
      </View>:<View style={styles.commentTextView}>
        <View style={{flex:1,borderBottomColor:'#D7D7D7',borderBottomWidth: 1,marginRight:5}}>
          {
            this.props.type&&this.props.type=="task"?<TextInput
              style={[styles.comInput, {backgroundColor: '#F5F2F0', height: 41}]}
              placeholder={this.state.textPlace}
              multiline={true}
              ref='commtext'
              onFocus={this.props.haveFocus&&this.props.haveFocus.bind(this,true)}
              onBlur={this.props.haveFocus&&this.props.haveFocus.bind(this,false)}
              onEndEditing={this.endEdit.bind(this)}
              onChangeText={this.getText.bind(this)}
              underlineColorAndroid="transparent"
              />:<TextInput
              style={[styles.comInput, {backgroundColor: '#F5F2F0', height: Math.max(41, this.state.inputHeight)}]}
              placeholder={this.state.textPlace}
              multiline={true}
              ref='commtext'
              clearTextOnFocus={false}
              onEndEditing={this.endEdit.bind(this)}
              onChange={(event)=> {
                this.setState({inputHeight: event.nativeEvent.contentSize.height})
              }}
              onChangeText={(text) => {console.log(text);_this.setState({commentBody: text})}}
              underlineColorAndroid="transparent"
              />
          }
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

