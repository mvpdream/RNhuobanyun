import React, {Component} from 'react'
import {
 Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ToastAndroid,
    ListView,
  Dimensions
} from 'react-native';

import styles from "./style";
import NavigationBar from 'react-native-navbar';
import NavLeftView from '../common/NavLeftView'
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, widths} = Dimensions.get('window');
import GridView from 'rn-grid-view';


export default class Application extends React.Component{
    constructor(props){
        super(props);
        const nav = this.props.nav;
        const gridData = [
          {
            index: 0,
            title: "汇报",
            icon: 'file-text-o',
            iconColor: 'gray',
            onSelect: ()=> {
              nav.push({id: 'ReportMain'})
            }
          },
          {
            index: 1,
            title: "文库",
            icon: 'folder',
            iconColor: '#E6B02D',
            onSelect: ()=> {
              nav.push({id: 'KbMain'})
            }
          },
          {
            index: 3,
            title: "考勤",
            icon: 'map-marker',
            iconColor: '#3366CC',
            onSelect: ()=> {
              nav.push({id: 'AttendanceMain'})
            }
          },
          {
            index: 4,
            title: "通讯录",
            icon: 'phone-square',
            iconColor: '#33CC66',
            onSelect: ()=> {
              nav.push({id: 'AddressBook'})
            }
          }
          //{
          //  index:2,
          //  title: "嘀！",
          //  icon: 'bomb',
          //  iconColor:'red',
          //  onSelect: ()=> {nav.push({id: 'MyPunchCard'})
          //  }
          //}
        ];
        this.state = {
          gridData : gridData
        }
    };
    renderRow(item){
      return (
        <TouchableOpacity key={item.index} onPress={item.onSelect} activeOpacity={0.5}>
          <View style={[styles.itemView,{width:(Dimensions.get('window').width)/4}]}>
            <Icon
              name={item.icon}
              size={40}
              style={{height:50}}
              color={item.iconColor}
              />
            <Text style={{fontSize:13}}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    render() {
        const titleConfig = {
            title: '应用',
            tintColor:'white'
        };
        return (
            <View style={{flex:1}}>
                <NavigationBar
                  style={styles.NavSty}
                  title={titleConfig}/>
                <View style={styles.applicationWhiteV}>
                    <View style={{flex:1,marginTop:10}}>
                      <GridView
                        itemsPerRow={4}
                        renderFooter={null}
                        onEndReached={null}
                        scrollEnabled={true}
                        renderSeparator={null}
                        items={this.state.gridData}
                        fillIncompleteRow={false}
                        renderItem={this.renderRow}
                        automaticallyAdjustContentInsets={false} />
                    </View>
                </View>
            </View>
        );
    }
};

