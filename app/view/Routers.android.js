'use strict';

var React = require('react-native');
var { AppRegistry, View, BackAndroid, Navigator, Text,Alert,ToastAndroid,AppState } = React;
import Login from './account/Login.js'
import Register from './account/Register.js'
import FindPassword from './account/FindPassword.js'
import ResetPassword from './account/ResetPassword'
import RegisterSucceed from './account/RegisterSucceed.js'
import CreatCompany from './account/CreatCompany.js'
import JoinCompany from './account/JoinCompany.js'
import SelectCompany from './account/SelectCompany.js'
import ReportMain from './report/ReportMain.js'
import CreatReport from './report/CreatReport.js'
import ReportRules from './report/ReportRules.js'
import SubmitReport from './report/SubmitReport.js'
import ReceiveReport from './report/ReceiveReport.js'
import UncommittedReport from './report/UncommittedReport.js'
import ReportDetail from './report/ReportDetail.js'
import SubordinateReport from './report/SubordinateReport.js'
import UserCenterMain from './usercenter/UserCenterMain.js'
import UserSetting from './usercenter/UserSetting.js'
import MyFavorite from './usercenter/MyFavorite.js'
import UserInfo from './usercenter/UserInfo.js'
import UserSuperior from './usercenter/UserSuperior.js'
import ExitCompany from './usercenter/ExitCompany.js'
import AccountSafe from './usercenter/AccountSafe.js'
import UpdateUser from './usercenter/UpdateUser.js'
import UpdatePassword from './usercenter/UpdatePassword.js'
import Toast from  '@remobile/react-native-toast'
import AddressBook from './addressbook/AddressBook.js'
import SearchAddress from './addressbook/SearchAddress.js'
import ExportAddress from './addressbook/ExportAddress.js'
import AddressInfo from './addressbook/AddressInfo.js'
import SelectorMain from './selector/SelectorMain.js'
import AllActivities from './activities/AllActivities.js'
import ActivitiesDetail from './activities/ActivitiesDetail.js'
import VoteOrReceiptDetail from './activities/VoteOrReceiptDetail.js'
import ActivityScopesDetail from './activities/ActivityScopesDetail.js'
import SearchActivities from './activities/SearchActivities.js'
import SendActivity from './activities/SendActivity.js'
import SendVote from './activities/SendVote.js'
import MainTabView from './common/MainTabView.js'
import api from '../network/ApiHelper'
import Loading from './Loading.js'
import ImagesViewer from './common/ImagesViewer.js'
import KbMain from './kb/KbMain.js'
import SearchKb from './kb/SearchKb.js'
import PhotoSelector from './common/PhotoSelector.js'
import FileSelector from './common/FileSelector.js'
import KbFileDetail from './kb/KbFileDetail.js'
import KbArticleDetail from './kb/KbArticleDetail.js'
import CommentList from './common/CommentList.js'
import AttendanceMain from './attendance/AttendanceMain.js'
import JPush , {JpushEventReceiveMessage, JpushEventOpenMessage} from 'react-native-jpush'
import _ from "lodash";
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
var dismissKeyboard = require('dismissKeyboard');

var _navigator, _quitStatus = false;
var isPushNotice = false;

api.Util.setErrConsumeFunction(err=>{
  if (err instanceof TypeError) {
    if(err.message=="Network request failed"){
      //网络问题 连接不到服务器
      Alert.alert(
        '警告',
        '请检查你的网络情况！',
        [
          {text: 'OK'}
        ]
      )
    }
    else{
      Alert.alert(
        '警告',
        '未知错误！！！',
        [
          {text: 'OK'}
        ]
      )
    }
  } else if (err instanceof SyntaxError) {
    Alert.alert(
      '警告',
      '呀！！不小心网络出问题了',
      [
        {text: 'OK'}
      ]
    )
  } else {
    Alert.alert(
      '警告',
      '未知错误！！！',
      [
        {text: 'OK'}
      ]
    )
  }
});
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1) {
    if (_quitStatus) {
      return false;
    } else {
      Toast.show("再按一次返回键退出伙伴客户端","short");
      _quitStatus = true;
      setTimeout(()=> {
        _quitStatus = false;
      }, 2000);
      return true;
    }
  }
  if(_navigator.getCurrentRoutes()[_navigator.getCurrentRoutes().length-1].id!="FileSelector"){
    _navigator.pop();
  }
  else if(_navigator.getCurrentRoutes()[_navigator.getCurrentRoutes().length-1].id=="ActivitiesDetail"){
    dismissKeyboard();
    _navigator.pop();
  }
  return true;
});

var Routers = React.createClass({
  getInitialState : function () {
    return {type:0,currentAppState:""};
  },
  componentDidMount() {
    AndroidKeyboardAdjust.setAdjustResize();
    JPush.requestPermissions();
    this.pushlisteners = [
      JPush.addEventListener(JpushEventReceiveMessage, this.onReceiveMessage),
      JPush.addEventListener(JpushEventOpenMessage, this.onOpenMessage)
    ];

  },
  componentWillUnmount() {
    this.pushlisteners.forEach(listener=> {
      JPush.removeEventListener(listener);
    });
  },
  renderScene: function (route, navigator) {
    _navigator = navigator;
    if (route.id === 'MainTabView') {
      return (
        <View style={{flex: 1}}>
          <MainTabView nav={navigator} type={route.type} selectedTab={route.selectedTab}/>
        </View>
      );
    }
    if (route.id === 'Login') {
      return (
        <View style={{flex: 1}}>
          <Login nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'Register') {
      return (
        <View style={{flex: 1}}>
          <Register nav={navigator}/>
        </View>
      );
    }
    if(route.id==='ResetPassword'){
      return(
        <View>
          <ResetPassword nav={navigator} phonenum={route.phonenum}/>
        </View>
      )
    }
    if (route.id === 'FindPassword') {
      return (
        <View style={{flex: 1}}>
          <FindPassword nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'RegisterSucceed') {
      return (
        <View style={{flex: 1}}>
          <RegisterSucceed nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'CreatCompany') {
      return (
        <View style={{flex: 1}}>
          <CreatCompany nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'JoinCompany') {
      return (
        <View style={{flex: 1}}>
          <JoinCompany nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'SelectCompany') {
      return (
        <View style={{flex: 1}}>
          <SelectCompany nav={navigator} icon={route.icon}/>
        </View>
      );
    }
    if (route.id === 'ReportMain') {
      //<MainTabView currentroute={this.state.currentRoute} onselect={this.onSelectMenu}/>
      return (
        <View style={{flex: 1}}>
          <ReportMain nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'ReportRules') {
      return (
        <View style={{flex: 1}}>
          <ReportRules nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'CreatReport') {
      return (
        <View style={{flex: 1}}>
          <CreatReport nav={navigator} type={route.type} curryear={route.curryear} currmonth={route.currmonth}/>
        </View>
      );
    }
    if (route.id === 'SubmitReport') {
      return (
        <View style={{flex: 1}}>
          <SubmitReport nav={navigator} reportItems={route.reportItems} updateState={route.updateState}/>
        </View>
      );
    }
    if (route.id === 'ReportDetail') {
      return (
        <View style={{flex: 1}}>
          <ReportDetail nav={navigator} reportItem={route.reportItem}/>
        </View>
      );
    }
    if (route.id === 'ActivitiesDetail') {
      return (
        <View style={{flex: 1}}>
          <ActivitiesDetail
            nav={navigator}
            activityId={route.activityId}
            type={route.type}
            indexId={route.indexId}
            deleteactivity={route.deleteactivity}
            getIsReceipt={route.getIsReceipt}
            getfavorandcomNum={route.getfavorandcomNum}
            isfouces={route.isfouces}/>
        </View>
      );
    }
    if (route.id === 'VoteOrReceiptDetail') {
      return (
        <View style={{flex: 1}}>
          <VoteOrReceiptDetail nav={navigator} optionId={route.optionId} type={route.type}/>
        </View>
      );
    }
    if (route.id === 'ActivityScopesDetail') {
      return (
        <View style={{flex: 1}}>
          <ActivityScopesDetail nav={navigator} activityId={route.activityId}/>
        </View>
      );
    }
    if (route.id === 'SendActivity') {
      return (
        <View style={{flex: 1}}>
          <SendActivity nav={navigator} type={route.type}/>
        </View>
      );
    }
    if (route.id === 'SendVote') {
      return (
        <View style={{flex: 1}}>
          <SendVote nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'UserCenterMain') {
      return (
          <View style={{flex: 1}}>
            <UserCenterMain nav={navigator} userData={route.userData}/>
          </View>
      );
    }
    if (route.id === 'UserSetting') {
      return (
        <View style={{flex: 1}}>
          <UserSetting nav={navigator} />
        </View>
      );
    }
    if (route.id === 'UserSuperior') {
      return (
          <View style={{flex: 1}}>
            <UserSuperior nav={navigator} userData={route.userData}/>
          </View>
      );
    }
    if (route.id === 'ExitCompany') {
      return (
          <View style={{flex: 1}}>
            <ExitCompany nav={navigator}/>
          </View>
      );
    }
    if(route.id==='AccountSafe'){
      return(
          <View style={{flex:1}}>
            <AccountSafe nav={navigator}/>
          </View>
      )
    }
    if(route.id==='UpdatePassword'){
      return(
          <View style={{flex:1}}>
            <UpdatePassword nav={navigator}/>
          </View>
      )
    }
    if(route.id==='UpdateUser'){
      return(
          <View style={{flex:1}}>
            <UpdateUser nav={navigator} userData={route.userData}/>
          </View>
      )
    }
    if (route.id === 'UserInfo') {
      return (
          <View style={{flex: 1}}>
            <UserInfo nav={navigator} userData={route.userData}/>
          </View>
      );
    }
    if (route.id === 'SelectorMain') {
      return (
        <View style={{flex: 1}}>
          <SelectorMain nav={navigator} selectorConfig={route.selectorConfig}/>
        </View>
      );
    }
    if (route.id === 'ReceiveReport') {
      return (
        <View style={{flex: 1}}>
          <ReceiveReport nav={navigator} type={route.type}/>
        </View>
      );
    }
    if (route.id === 'UncommittedReport') {
      return (
        <View style={{flex: 1}}>
          <UncommittedReport nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'SubordinateReport') {
      return (
        <View style={{flex: 1}}>
          <SubordinateReport nav={navigator} type={route.type} userid={route.userid} username={route.username}/>
        </View>
      );
    }
    if (route.id === 'AddressBook') {
      return (
          <View style={{flex: 1}}>
            <AddressBook nav={navigator}/>
          </View>
      );
    }
    if (route.id === 'SearchAddress') {
      return (
        <View style={{flex: 1}}>
          <SearchAddress nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'ExportAddress') {
      return (
        <View style={{flex: 1}}>
          <ExportAddress nav={navigator}/>
        </View>
      );
    }
    if (route.id === 'AddressInfo') {
      return (
        <View style={{flex: 1}}>
          <AddressInfo nav={navigator} Id={route.Id}/>
        </View>
      );
    }
    if (route.id === 'AllActivities') {
      return (
        <View style={{flex: 1}}>
          <AllActivities nav={navigator} type={route.type}/>
        </View>
      )
    }
    if (route.id === 'SearchActivities') {
      return (
        <View style={{flex: 1}}>
          <SearchActivities nav={navigator}/>
        </View>
      )
    }
    if (route.id === 'Loading') {
      return (
        <View style={{flex: 1}}>
          <Loading nav={navigator} type={route.type}/>
        </View>
      )
    }
    if(route.id==='MyFavorite'){
      return (
        <View style={{flex: 1}}>
          <MyFavorite nav={navigator}/>
        </View>
      )
    }
    if(route.id==='ImagesViewer'){
      return (
        <View style={{flex: 1}}>
          <ImagesViewer nav={navigator} imageUrls={route.imageUrls} imgindex={route.imgindex}/>
        </View>
      )
    }
    if(route.id==='KbMain'){
      return(
        <View style={{flex:1}}>
          <KbMain nav={navigator} kbName={route.kbName} kbId={route.kbId} managePermission={route.managePermission}/>
        </View>
      )
    }
    if(route.id==='SearchKb'){
      return(
        <View style={{flex:1}}>
          <SearchKb nav={navigator} kbId={route.kbId}/>
        </View>
      )
    }
    if(route.id==='KbFileDetail'){
      return(
        <View style={{flex:1}}>
          <KbFileDetail nav={navigator}
            kbName={route.kbName}
            fileType={route.fileType}
            kbId={route.kbId}
            managePermission={route.managePermission}
            updateFile={route.updateFile}
            updateFileName={route.updateFileName}
            removeFile={route.removeFile}
            lockFile={route.lockFile}
            menuText={route.menuText}/>
        </View>
      )
    }
    if(route.id==='KbArticleDetail'){
      return(
        <View style={{flex:1}}>
          <KbArticleDetail nav={navigator}
                        kbName={route.kbName}
                        fileType={route.fileType}
                        kbId={route.kbId}
                        updateFile={route.updateFile}
                        managePermission={route.managePermission}
                        updateFileName={route.updateFileName}
                        removeFile={route.removeFile}
                        lockFile={route.lockFile}
                        menuText={route.menuText}/>
        </View>
      )
    }
    if(route.id==='FileSelector'){
      return (
        <View style={{flex: 1}}>
          <FileSelector
            nav={navigator}
            path={route.path}
            fileName={route.fileName}
            navTil={route.navTil}
            getSelFile={route.getSelFile}
            fileSize={route.fileSize}/>
        </View>
      )
    }
    if(route.id==='AttendanceMain'){
      return (
        <View style={{flex: 1}}>
          <AttendanceMain nav={navigator} type={route.type}/>
        </View>
      )
    }
    if(route.id==='PhotoSelector'){
      return (
        <View style={{flex: 1}}>
          <PhotoSelector nav={navigator} num={route.num}  getSelImg={route.getSelImg} />
        </View>
      )
    }
    if(route.id==='CommentList'){
      return(
        <View style={{flex:1}}>
         <CommentList nav={navigator} attachmentId={route.attachmentId} creatorUser={route.creatorUser} />
        </View>
      )
    }

  },
  render: function () {

    return (
      <Navigator
        ref="navigator"
        initialRoute={{id: 'Loading'}}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={this.renderScene}
        />
    );

  },
  onReceiveMessage(message) {

  },

  onOpenMessage(message) {
    var currUser=api.User.getCurrentUser();
    if(currUser!=null){
      let tempIds=_.pluck(_navigator.getCurrentRoutes(),'id');
      let _index=tempIds.indexOf("AttendanceMain");
      if(_index!=-1){
        this.refs.navigator.replaceAtIndex({
        id:'AttendanceMain'}, _index);
      }
      else{
      this.refs.navigator.push({id:'AttendanceMain'});
      }
    }else{
      let tempId=_.pluck(_navigator.getCurrentRoutes(),'id');
      let index=tempId.indexOf("Login");
      if(index!=-1){
        this.refs.navigator.replaceAtIndex({
          id:'Login'}, index);
      }
      else{
        this.refs.navigator.push({id:'Login'});
      }
    }
  }
});


module.exports = Routers;