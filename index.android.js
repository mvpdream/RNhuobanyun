/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
} = React;

var Routers = require('./app/view/Routers.android');
AppRegistry.registerComponent('RNhuobanyun', () => Routers);
