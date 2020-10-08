/* eslint-disable no-extend-native */
/* eslint-disable react-native/no-inline-styles */
import React, {Component, PureComponent} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Linking,
  ImageBackground,
} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

/* SECTION Variables */
const cookingAnimation = require('../animations/cooking.json');
const foodImage = require('../images/food.jpg');
let isLoading = false;
let currentPage = 1;

/* SECTION Global functions */
String.prototype.trunc = function(n) {
  return this.substr(0, n - 1) + (this.length > n ? '...' : '');
};

/* SECTION Search item class */
class SearchItem extends PureComponent {
  constructor(props) {
    super(props);
    const {thumbnail} = this.props;
    let fixedThumbnail = {uri: thumbnail};
    if (thumbnail.length === 0) {
      fixedThumbnail = foodImage;
    }
    this.state = {
      thumbnail: fixedThumbnail,
    };
  }

  onErrorThumbnail = () => this.setState({thumbnail: foodImage});
  openURL = () => {
    const {link} = this.props;
    Linking.openURL(link).catch(e => {
      console.log(e);
    });
  };

  render() {
    const {thumbnail} = this.state;
    const {title, ingredients} = this.props;
    return (
      <Ripple
        rippleDuration={1400}
        onPress={this.openURL}
        rippleColor={'#DB5A42'}
        rippleOpacity={0.5}
        rippleContainerBorderRadius={15}
        style={{
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          flex: 1,
          marginStart: '3%',
          marginEnd: '3%',
          marginBottom: '2%',
          marginTop: '2%',
          borderRadius: 15,
          padding: 8,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            height: 65,
            width: 65,
            backgroundColor: '#fff',
            borderRadius: 15,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}>
          <FastImage
            source={thumbnail}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#DB5A42',
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignSelf: 'center',
            flex: 1,
            marginStart: '5%',
          }}>
          <Text style={{color: '#7f8593', fontSize: 17}}>{title}</Text>
          <Text style={{color: '#BEBBBB', fontSize: 13}}>
            {ingredients.trunc(90)}
          </Text>
        </View>
      </Ripple>
    );
  }
}

/* SECTION SearchList screen class */
export default class SearchList extends Component {
  /* ANCHOR Constructor */
  constructor(props) {
    super(props);
    const {route} = this.props;
    const {results, searchText} = route.params;
    this.state = {
      results,
      searchText,
    };
  }

  /* ANCHOR UI */
  // 0. Search focus and blur
  handleFocusedSearch = () => this.setState({isFocusedSearch: true});
  handleBlurSearch = () => this.setState({isFocusedSearch: false});
  // 0. Go back to main screen
  goBackToMain = () => {
    const {navigation} = this.props;
    currentPage = 0;
    isLoading = false;
    navigation.navigate('Main');
  };

  /* ANCHOR API */
  callSearchAPI = isNextPage => {
    const {searchText, results} = this.state;
    Keyboard.dismiss();
    this.handleBlurSearch();
    if (searchText.length === 0) {
      return;
    }
    if (isLoading === true) {
      return;
    }
    isLoading = true;
    currentPage = currentPage + 1;
    const URL = 'http://www.recipepuppy.com/api/?q=' + searchText + '&p=' + currentPage;
    fetch(URL)
      .then(response => response.json())
      .then(json => {
        const r = json.results;
        results = [...r];
        isLoading = false;
        this.setState({results});
      })
      .catch(e => {
        console.log(e);
        isLoading = false;
      });
  };

  /* ANCHOR Render */
  render() {
    const {isSearchLoading, results} = this.state;
    const getHeader = () => (
      <>
        <View
          style={{
            width: '80%',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Image
            source={require('../images/fast_recipes.png')}
            resizeMethod={'scale'}
            resizeMode={'contain'}
            style={{height: 150, width: '100%'}}
          />
        </View>
      </>
    );
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flex: 1}}>
          <FlatList
            data={results}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.href}
            ListHeaderComponent={getHeader}
            onEndReached={() => this.callSearchAPI(true)}
            onEndReachedThreshold={0.8}
            renderItem={({item}) => (
              <SearchItem
                thumbnail={item.thumbnail}
                title={item.title}
                ingredients={item.ingredients}
                link={item.href}
              />
            )}
          />
          <Ripple
            rippleColor={'#DB5A42'}
            rippleOpacity={0.5}
            rippleCentered
            rippleDuration={500}
            onPress={this.goBackToMain}
            rippleContainerBorderRadius={35}
            style={{
              position: 'absolute',
              bottom: '6%',
              right: '6%',
              width: 60,
              height: 60,
              borderRadius: 30,
              borderColor: '#DB5A42',
              borderWidth: 2,
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              justifyContent: 'center',
            }}>
            <FontAwesome5
              size={20}
              name={'search'}
              color={'#DB5A42'}
              style={{alignSelf: 'center'}}
            />
          </Ripple>
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
