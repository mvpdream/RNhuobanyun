/**
 * Created by lizx on 2016/2/4.
 */

/**
 * Created by wangshuo on 2016/2/3.
 */
import React, {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    Dimensions,
    Animated,
    Easing
    } from 'react-native';
import styles from "./style";
import Icon from 'react-native-vector-icons/Ionicons';
import api from "../../network/ApiHelper";

export default class CompanyCell extends React.Component{
  constructor(props){
    super(props);
    const nav = this.props.nav;
      this.state = {
          statues:null,
          fadeAnim: new Animated.Value(0),
      };
  };
    deleteAction(){
        this.props.deleteAction();
    };
    selectAction(item){
        this.props.onSelect(item)
    };
    componentDidMount() {
        Animated.timing(
            this.state.fadeAnim,
            {toValue: 1,duration:200,easing:Easing.in(Easing.ease)}
        ).start();
    }
  render(){
    var item = this.props.comData;
      switch (item.Status) {
          case 0:
              this.state.statues="等待审核";
              break;
          case 1:
              this.state.statues="未审核通过";
              break;
          case 2:
              this.state.statues="已审核通过";
              break;
          case 3:
              this.state.statues="已离职";
              break;
          default:
              this.state.statues="未激活";
              break;
      }

    return (
        <TouchableOpacity onPress={()=>this.selectAction(item)} activeOpacity={0.8}>
            <Animated.View  style={[styles.comcellCont,{opacity: this.state.fadeAnim,
                   transform: [{
                     translateX: this.state.fadeAnim.interpolate({
                      inputRange: [0, 1],
                       outputRange: [150, 0]
                     })
                   }]}]}>
              <View style={this.state.statues=="已审核通过"?[styles.comcellView,{backgroundColor:'#DFF0D8'}]:styles.comcellView}>
                <Text style={{fontSize:18,color:'black'}}>{item.Company.Name}</Text>
                <View style={{flexDirection:'row',marginTop:6}}>
                  <Text style={{fontSize:16}}>企业ID：{item.Company.Code}</Text>
                  <Text style={{fontSize:14,color:'#696161',position: 'absolute',top:0,right:6}}>{this.state.statues}</Text>
                </View>
              </View>
                {
                    this.state.statues=="已审核通过"?null:<Icon name='ios-close' size={26} color='#C7254E' onPress={this.deleteAction.bind(this)} style={{width: 26, height: 26,position: 'absolute',top:-3,right:5}}/>
                }
            </Animated.View>
        </TouchableOpacity>
    );
  };

}
