'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
  },
  userInfo: {
    flex:1,
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height:120,
    backgroundColor:'#175898',
    padding:15
  },
  sideNavItem:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding:20,
    backgroundColor: 'white',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#CCCCCC',
  },
});