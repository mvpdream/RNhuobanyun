/**
 * Created by wangshuo on 2016/2/16.
 */
'use strict';

import React, {
  Image,
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ListView,
  Component
  } from 'react-native';
import colorManager from '../common/styles/manager'
import styles from "./style";
import NavToolbar from '../navigation/navToolBar/NavToolBar.android';
import NavTab from '../navigation/navTab/NavTab.android';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons'
var Dimensions = require('Dimensions');
import api from "../../network/ApiHelper";
var {height, widths} = Dimensions.get('window');  //获取屏幕宽高
var loaderHandler = require('react-native-busy-indicator/LoaderHandler');
var BusyIndicator = require('react-native-busy-indicator');
var HTMLView = require('react-native-htmlview');
var that;
var _this;
var favorflag=false;
var comflag=false;
import Toast from  '@remobile/react-native-toast'

class Cell extends Component {
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {
      favorNum:this.props.item.FavorAmount,
      commentNum:this.props.item.CommentAmount,
      tempObj:[],
      itemText:""
    };
    that=this;

  }

  componentDidMount() {
    //处理投票以及回执
    var actItem=this.props.item;
    var tempObj=actItem && actItem.Items&&actItem.Items.filter((tempitem)=> {
        if(tempitem.TenantType=='Receipt'||tempitem.TenantType=='Vote'){return tempitem}
      });
    if(tempObj&&tempObj.length>0&&tempObj[0].hasOwnProperty('TenantType')&&tempObj[0].TenantType=="Vote"){
      this.setState({itemText:"投票："+tempObj[0].Title})
    }
    if(tempObj&&tempObj.length>0&&tempObj[0].hasOwnProperty('TenantType')&&tempObj[0].TenantType=="Receipt"){

      if(tempObj[0].HasVoted){
        this.setState({itemText:'已回执'})
      }
      else if(tempObj[0].hasOwnProperty('WasCreator')&&tempObj[0].WasCreator){
        if(tempObj[0].hasOwnProperty('Options')&&tempObj[0].Options.length>0){
          var isReceiptednums=0;
          for(var i=0;i<tempObj[0].Options.length;i++){
            isReceiptednums+=tempObj[0].Options[i].Count
          }
        }
        var isReceiptnums=0;
        if(tempObj[0].hasOwnProperty('UnreceiptedUsers')&&tempObj[0].UnreceiptedUsers.length>0){
          isReceiptnums=tempObj[0].UnreceiptedUsers.length
        }
        this.setState({itemText:'已回执'+isReceiptednums+'人'+'/'+'未回执'+isReceiptnums+'人'})
      }
      else{
        this.setState({itemText:'未回执'})
      }
    }
    this.setState({tempObj:tempObj})
  }
  getActivitiesInfo(activityId){
    this.props.nav.push({
      id: 'ActivitiesDetail',
      activityId:activityId,
      getfavorandcomNum:(fnum,cnum,favored)=>{this.getfavorandcomNum(fnum,cnum,favored)},
      deleteactivity:(activityId,index)=>{_this.deleteActivity(activityId,index)}
    });
  }
  getfavorandcomNum(fnum,cnum,isfavored){
    comflag=true;
    favorflag=true;
    if(fnum==null){
      fnum=this.state.favorNum
    }
    if(cnum==null){
      cnum=this.state.commentNum
    }
    this.setState({favorNum:fnum,commentNum:cnum,favored:isfavored});
  }
  commentAct(activityId){
    this.props.nav.push({ id: 'ActivitiesDetail',
      activityId:activityId,
      getfavorandcomNum:(fnum,cnum,favored)=>{this.getfavorandcomNum(fnum,cnum,favored)},
      isfouces:1,
      deleteactivity:(activityId,index)=>{_this.deleteActivity(activityId,index)}
    })
  }
  toggleLike(activityId){
    api.Activity.toggleLikeState(activityId)
      .then((resData)=>{
        //ToastAndroid.show(resData.Data, ToastAndroid.SHORT);
        if(resData.Data=='收藏成功!'){
          favorflag=true;
          this.setState({
            favorNum:this.state.favorNum+1,
            favored:true
          })

        }
        else{
          favorflag=true;
          this.setState({
            favorNum:this.state.favorNum-1,
            favored:false,
          })
        }
      });

  }
  render() {
    var item=this.props.item;
    if(!favorflag){
      this.state.favored=item.IsFavorite;
      this.state.favorNum=item.FavorAmount;}
    if(!comflag){
      this.state.commentNum=item.CommentAmount;
    }
    var body="<p>"+item.Body+"</p>";
    return (
      <View>
        <View style={styles.activityItemView}>
          <View style={styles.itemHead}>
            <Image
              source={{uri:item.UserCreated.Avatar}}
              style={styles.itemUserimg}
              />
            <View style={styles.itemnamesope}>
              <Text style={styles.itemNamesope}>{item.UserCreated.Name}</Text>
              <Text onPress={()=>{
             this.props.nav.push({
                id: 'ActivityScopesDetail',
                activityId:item.Id
              });
            }} style={styles.scopeText}>--{item.Scopes==""?"我自己":item.Scopes}  {item['CreateDate']}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={this.getActivitiesInfo.bind(this,item.Id)}>
            {
              item.Body==""?null:<View style={styles.itemBody}>
                <HTMLView
                  value={body}
                  onLinkPress={(url) => {
              Linking.openURL(url);
              }}
                  stylesheet={baseStyles}
                  />
              </View>
            }
            <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
              {
                item.Images && item.Images.map((imageitem, index)=> {
                  return (
                    <View key={index} style={{padding:10}}>
                      <Image
                        source={{uri:imageitem.Url}}
                        style={{width: 70,height: 85}}
                        />
                    </View>
                  )
                })
              }
            </View>
            {this.state.tempObj&&this.state.tempObj.length>0?
              <View style={styles.itemOther}>
                {
                  this.state.tempObj&&this.state.tempObj[0].TenantType=="Vote"?
                    <Icon
                      name="list-ul"
                      size={18}
                      color="#2F2F2F"
                      style={{height:20,width:30}}
                      />:
                    <Icon
                      name="reply-all"
                      size={18}
                      color="#2F2F2F"
                      style={{height:20,width:30}}
                      />
                }
                <Text style={[styles.nomText,{fontSize: 14,width:Dimensions.get('window').width-70}]}>{this.state.itemText}</Text>
              </View>:null
            }
          </TouchableOpacity>


          <View style={styles.itemBottom}>
            <TouchableOpacity style={{ flex: 1}} onPress={this.commentAct.bind(this,item.Id,item.UserCreated)}>
              <View style={[styles.itemBottomView,{borderRightColor: '#ECEFF1',borderRightWidth: 1.2}]}>
                <Icon
                  name="commenting"
                  size={18}
                  color="#175898"
                  style={{width:25}}
                  />
                <Text style={[styles.nomText,{paddingRight:10,textAlign: 'center',}]}>
                  <Text style={[styles.countnum]}>{this.state.commentNum}</Text>
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1}} onPress={this.toggleLike.bind(this,item.Id)}>
              <View style={styles.itemBottomView}>
                <Icon
                  name="thumbs-up"
                  size={18}
                  color={this.state.favored?'#FCC44D':'#175898'}
                  style={{width:25}}
                  />
                <Text style={[styles.nomText,{paddingRight:5,textAlign: 'center'}]}>
                  <Text style={styles.countnum}>{this.state.favorNum}</Text>
                </Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    );
  }
}
var baseStyles = StyleSheet.create({
  p: {
    color:'black',
    fontSize: 14
  },
  a: {
    fontWeight: '200',
    color: '#0277BD'
  }
});
export default class SearchActivities extends React.Component {
  constructor(props){
    super(props);
    const nav = this.props.nav;
    this.state = {
      keywords:"",
      nodata:false,
      activityData: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
    _this=this;
  };
  fetchData(keyword){
    favorflag=false;
    comflag=false;
    loaderHandler.showLoader("加载中...");
    api.Activity.getActivityList(54,1,100,keyword)
      .then((resData)=>{
        loaderHandler.hideLoader();
        if(resData.Data!=""){
        this.setState({
          activityData:this.state.activityData.cloneWithRows(resData.Data),
          nodata:false
        });
          //处理投票以及回执
          var actItem=resData.Data.item;
          var tempObj=actItem && actItem.Items&&actItem.Items.filter((tempitem)=> {
              if(tempitem.TenantType=='Receipt'||tempitem.TenantType=='Vote'){return tempitem}
            });
          if(tempObj&&tempObj.length>0&&tempObj[0].hasOwnProperty('TenantType')&&tempObj[0].TenantType=="Vote"){
            this.setState({itemText:"投票："+tempObj[0].Title})
          }
          if(tempObj&&tempObj.length>0&&tempObj[0].hasOwnProperty('TenantType')&&tempObj[0].TenantType=="Receipt"){

            if(tempObj[0].HasVoted){
              this.setState({itemText:'已回执'})
            }
            else if(tempObj[0].hasOwnProperty('WasCreator')&&tempObj[0].WasCreator){
              if(tempObj[0].hasOwnProperty('Options')&&tempObj[0].Options.length>0){
                var isReceiptednums=0;
                for(var i=0;i<tempObj[0].Options.length;i++){
                  isReceiptednums+=tempObj[0].Options[i].Count
                }
              }
              var isReceiptnums=0;
              if(tempObj[0].hasOwnProperty('UnreceiptedUsers')&&tempObj[0].UnreceiptedUsers.length>0){
                isReceiptnums=tempObj[0].UnreceiptedUsers.length
              }
              this.setState({itemText:'已回执'+isReceiptednums+'人'+'/'+'未回执'+isReceiptnums+'人'})
            }
            else{
              this.setState({itemText:'未回执'})
            }
          }
          this.setState({tempObj:tempObj})
        }
        else{
          this.setState({
            nodata:true
          });
        }
      })
  };
  activityItem(item){
    return(<Cell item={item} nav={this.props.nav} actType={this.props.actType}/>)
  }
  search(){
    this.state.keywords=this.state.keywords.trim();
    if(this.state.keywords==""||this.state.keywords.length==0){
      Toast.show("请输入搜索关键字","short");
    }
    else{
     this.fetchData(this.state.keywords);
    }
  }
  deleteActivity(activityid,index){
      api.Activity.removeActivity(activityid)
        .then((res)=>{
          if(res.Type==1){
            if(index==128){
              //我赞过的页面
              this.props.nav.immediatelyResetRouteStack([{id: 'MainTabView',selectedTab:'UserCenter'},{
                id: 'MyFavorite'
              }]);
            }
            if(index!=128){
              this.props.nav.immediatelyResetRouteStack([{
                id: 'MainTabView',selectedTab:'Activities'
              }]);}
          }
        })

  }
  render() {
    return (
      <View style={styles.containersw}>
         <View style={{height: 55,alignItems: 'center',backgroundColor:colorManager.getCurrentStyle().NAVCOLOR,flexDirection: 'row',}}>
           <TouchableOpacity onPress={() => {this.props.nav.pop();}}>
             <Icons
               name="android-arrow-back"
               size={28}
               color="white"
               style={styles.serchImg}
               />
           </TouchableOpacity>
            <View style={[styles.searchView,{width:Dimensions.get('window').width*0.7,alignItems: 'center',marginLeft:0,justifyContent: 'center',}]}>
              <Icon
                name="search"
                size={20}
                color="#5D5B5B"
                style={{marginLeft:10}}
                />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder=" 关键字"
                autoFocus={true}
                textAlignVertical='center'
                onChangeText={(text) => this.setState({keywords: text})}
                style={{flex:1,width:Dimensions.get('window').width*0.6}}
                />
            </View>
           <TouchableOpacity style={{padding:10}} onPress={this.search.bind(this)}>
            <Text style={{color :'white',fontSize:15}}>搜索</Text>
           </TouchableOpacity>
         </View>

        <View style={styles.Acontainer}>
          {
            this.state.nodata?
              <View style={styles.nodataView}>
                <Icon
                  name="exclamation-circle"
                  size={50}
                  color="#717171"
                  />
                <Text style={styles.nodataViewText}>暂无相关动态</Text>
              </View>
              :<ScrollView keyboardShouldPersistTaps={true} keyboardDismissMode ='on-drag'><ListView
              dataSource={this.state.activityData}
              renderRow={this.activityItem.bind(this)}
             /></ScrollView>
          }

        </View>
        <BusyIndicator color='#EFF3F5' loadType={1} loadSize={10} textFontSize={15} overlayColor='#4A4A4A' textColor='white' />
      </View>

    );
  }
};

