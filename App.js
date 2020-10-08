/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Main from './src/components/Main';
import SearchList from './src/components/SearchList';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

FontAwesomeIcon.getStyledIconSet('brand').loadFont();
FontAwesomeIcon.getStyledIconSet('light').loadFont();
FontAwesomeIcon.getStyledIconSet('regular').loadFont();
FontAwesomeIcon.getStyledIconSet('solid').loadFont();

/* SECTION Variables */
// 0. Stacks
const Stack = createStackNavigator();

/* SECTION Main App class */
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        <StatusBar backgroundColor="#fff" barStyle={'dark-content'} />
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Main">
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="SearchList" component={SearchList} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

/* SECTION Export default */
export default App;
