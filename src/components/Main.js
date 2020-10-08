/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

/* SECTION Variables */
const cookingAnimation = require('../animations/cooking.json');

/* SECTION Main screen class */
export default class Main extends Component {
  /* ANCHOR Constructor */
  constructor(props) {
    super(props);
    this.state = {
      isFocusedSearch: false,
      searchText: '',
      isSearchLoading: false,
    };
  }

  /* ANCHOR UI */
  // 0. Search focus and blur
  handleFocusedSearch = () => this.setState({isFocusedSearch: true});
  handleBlurSearch = () => this.setState({isFocusedSearch: false});

  /* ANCHOR API */
  callSearchAPI = () => {
    const {searchText} = this.state;
    Keyboard.dismiss();
    this.handleBlurSearch();
    if (searchText.length === 0) {
      return;
    }
    this.setState({isSearchLoading: true});
    fetch('http://www.recipepuppy.com/api/?q=' + searchText)
      .then(response => response.json())
      .then(json => {
        const results = json.results;
        const {navigation} = this.props;
        this.setState({isSearchLoading: false});
        navigation.navigate('SearchList', {results, searchText});
      })
      .catch(e => {
        console.log(e);
        this.setState({isSearchLoading: false});
      });
  };

  /* ANCHOR Render */
  render() {
    const {isFocusedSearch, isSearchLoading, searchText} = this.state;
    return (
      <View
        style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center'}}>
        <View
          style={{
            position: 'absolute',
            bottom: 16,
          }}>
          <LottieView
            loop
            autoPlay
            ref={animation => {
              this.spinnerAnimation = animation;
            }}
            resizeMode="cover"
            source={cookingAnimation}
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            width: '90%',
            height: 150,
            justifyContent: 'center',
            alignSelf: 'center',
            top: '3%',
          }}>
          <Image
            source={require('../images/fast_recipes.png')}
            resizeMethod={'scale'}
            resizeMode={'contain'}
            style={{height: 150, width: '100%'}}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextInput
            style={[
              {
                borderBottomWidth: 1,
                borderColor: '#dfe0e4',
                borderWidth: 1,
                backgroundColor: '#ffffff',
                paddingStart: 10,
                borderRadius: 8,
                color: '#607d8b',
                marginStart: '4%',
                marginEnd: '4%',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 2,
                height: 50,
                fontSize: 16,
              },
              {
                borderColor: isFocusedSearch ? '#DB5A42' : '#dfe0e4',
              },
            ]}
            autoCompleteType="off"
            onChangeText={text => this.setState({searchText: text})}
            placeholder="Search for awesome recipes!"
            value={searchText}
            onFocus={() => {
              this.setState({searchText: ''});
              this.handleFocusedSearch();
            }}
            onEndEditing={this.callSearchAPI}
            onBlur={this.handleBlurSearch}
            placeholderTextColor={'#607d8b'}
            selectionColor="#607d8b20"
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.callSearchAPI}
            style={{
              alignSelf: 'center',
              marginTop: '6%',
              width: '100%',
            }}>
            <LinearGradient
              style={{
                justifyContent: 'center',
                marginStart: '4%',
                marginEnd: '4%',
                borderRadius: 20,
                display: 'flex',
                height: 50,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 4,
                borderWidth: 1,
                borderColor: '#fff',
              }}
              colors={['#DB5A42', '#007EA7']}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}>
              <Text
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: 16,
                }}>
                Search
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {isSearchLoading ? (
          <View
            style={{
              position: 'absolute',
              top: '5%',
              alignSelf: 'center',
              backgroundColor: '#007EA7',
              padding: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              borderRadius: 50,
            }}>
            <ActivityIndicator animating color="#fff" size="small" />
          </View>
        ) : null}
        <View />
      </View>
    );
  }
}
