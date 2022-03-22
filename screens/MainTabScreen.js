import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './HomeScreen';
import NotificationScreen from './NotificationScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import MapTestScreen from './MapTestScreen';
import EditProfileScreen from './EditProfileScreen';

import {useTheme, Avatar} from 'react-native-paper';
import {View} from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RequestTagScreen from './RequestTagScreen';
import RequestSessionScreen from './RequestSessionScreen';
import HelpFriendScreen from './HelpFriendScreen';
import ContactScreen from './ContactScreen';
import HelpScreen from './HelpScreen';
import QRScanScreen from './QRScanScreen';
import ChatBot from '../chatbot';
import CardItemDetails from './CardItemDetails';
import TestScreen from './TestScreen';

const HomeStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ExploreStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator initialRouteName="Home" activeColor="#fff">
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: '#FF6347',
        tabBarIcon: ({color}) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={NotificationStackScreen}
      options={{
        tabBarLabel: 'Notifications',
        tabBarColor: '#1f65ff',
        tabBarIcon: ({color}) => (
          <Icon name="ios-notifications" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarColor: '#41A317',
        tabBarIcon: ({color}) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Map"
      component={ExploreStackScreen}
      options={{
        tabBarLabel: 'Map',
        tabBarColor: '#F88017',
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="google-maps" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => {
  const {colors} = useTheme();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Smart Refuel',
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <Icon.Button
                name="ios-menu"
                size={25}
                color={colors.text}
                backgroundColor={colors.background}
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
          headerRight: () => (
            <View style={{flexDirection: 'row', marginRight: 10}}>
              {/* <Icon.Button
                name="ios-search"
                size={25}
                color={colors.text}
                backgroundColor={colors.background}
                onPress={() => {}}
              /> */}
              <TouchableOpacity
                style={{paddingHorizontal: 10, marginTop: 5}}
                onPress={() => {
                  navigation.navigate('Profile');
                }}>
                <Avatar.Image
                  source={require('../assets/logo-round.png')}
                  backgroundColor='#FFFFFF'
                  size={45}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <HomeStack.Screen 
        name="RequestTagScreen"
        component={RequestTagScreen}
        options={({route}) => ({
          title: route.params.title,
          headerBackTitleVisible: false
        })}
      />
      <HomeStack.Screen 
        name="RequestSessionScreen"
        component={RequestSessionScreen}
        options={({route}) => ({
          title: route.params.title,
          headerBackTitleVisible: false
        })}
      />
      <HomeStack.Screen 
        name="HelpFriendScreen"
        component={HelpFriendScreen}
        options={({route}) => ({
          title: route.params.title,
          headerBackTitleVisible: false
        })}
      />
      <HomeStack.Screen 
        name="QRScanScreen"
        component={QRScanScreen}
        options={({route}) => ({
          title: route.params.title,
          headerBackTitleVisible: false
        })}
      />
      <HomeStack.Screen 
        name="TestScreen"
        component={QRScanScreen}
        options={({route}) => ({
          title: route.params.title,
          headerBackTitleVisible: false
        })}
      />
      <HomeStack.Screen 
        name="ContactScreen"
        component={ContactScreen}
        options={({route}) => ({
          title: route.params.title,
          headerBackTitleVisible: false
        })}
      />
      <HomeStack.Screen 
        name="HelpScreen"
        component={HelpScreen}
        options={({route}) => ({
          title: route.params.title,
          headerBackTitleVisible: false
        })}
      />
      <HomeStack.Screen 
        name="ChatBot"
        component={ChatBot}
        options={({route}) => ({
          title: route.params.title,
          headerBackTitleVisible: false
        })}
      />
      <HomeStack.Screen 
        name="CardItemDetails"
        component={CardItemDetails}
        options={({route}) => ({
          // title: route.params.title,
          headerBackTitleVisible: false,
          headerTitle: false,
          headerTransparent: true,
          headerTintColor: '#fff'
        })}
      />
    </HomeStack.Navigator>
  );
};

const NotificationStackScreen = ({navigation}) => (
  <NotificationStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1f65ff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <NotificationStack.Screen
      name="Notifications"
      component={NotificationScreen}
      options={{
        headerLeft: () => (
          <View style={{marginLeft: 10}}>
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1f65ff"
            onPress={() => navigation.openDrawer()}
          />
          </View>
        ),
      }}
    />
  </NotificationStack.Navigator>
);

const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#41A317',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerLeft: () => (
          <View style={{marginLeft: 10}}>
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#41A317"
            onPress={() => navigation.openDrawer()}
          />
          </View>
        ),
      }}
    />
  </ProfileStack.Navigator>
);

const ExploreStackScreen = ({navigation}) => (
  <ExploreStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#F88017',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <ExploreStack.Screen
      name="Map"
      component={ExploreScreen}
      options={{
        headerLeft: () => (
          <View style={{marginLeft: 10}}>
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#F88017"
            onPress={() => navigation.openDrawer()}
          />
          </View>
        ),
      }}
    />
  </ExploreStack.Navigator>
);

// const ProfileStackScreen = ({navigation}) => {
//   const {colors} = useTheme();

//   return (
//     <ProfileStack.Navigator
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: colors.background,
//           shadowColor: colors.background, // iOS
//           elevation: 0, // Android
//         },
//         headerTintColor: colors.text,
//       }}>
//       <ProfileStack.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           title: '',
//           headerLeft: () => (
//             <View style={{marginLeft: 10}}>
//               <Icon.Button
//                 name="ios-menu"
//                 size={25}
//                 backgroundColor={colors.background}
//                 color={colors.text}
//                 onPress={() => navigation.openDrawer()}
//               />
//             </View>
//           ),
//           headerRight: () => (
//             <View style={{marginRight: 10}}>
//               <MaterialCommunityIcons.Button
//                 name="account-edit"
//                 size={25}
//                 backgroundColor={colors.background}
//                 color={colors.text}
//                 onPress={() => navigation.navigate('EditProfile')}
//               />
//             </View>
//           ),
//         }}
//       />
//       <ProfileStack.Screen
//         name="EditProfile"
//         options={{
//           title: 'Edit Profile',
//         }}
//         component={EditProfileScreen}
//       />
//     </ProfileStack.Navigator>
//   );
// };
