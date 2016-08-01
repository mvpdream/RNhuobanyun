'use strict';

import React, {
  Text,
  View
  } from 'react-native';
import styles from "./style";
import Icon from 'react-native-vector-icons/FontAwesome';
import api from "../../network/ApiHelper.js";
var Dimensions = require('Dimensions');
import _ from 'lodash';
var zanflag=false;
import Toast from  '@remobile/react-native-toast'

export default class FavorUsersView extends React.Component {
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
  toggleLike(activityId){
    api.Activity.toggleLikeState(activityId)
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
};

