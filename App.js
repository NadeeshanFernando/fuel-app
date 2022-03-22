/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';

import { DrawerContent } from './screens/DrawerContent';

import MainTabScreen from './screens/MainTabScreen';
import PaymentScreen from './screens/PaymentScreen';
import SettingsScreen from './screens/SettingsScreen';
// import BookmarkScreen from './screens/BookmarkScreen';

import { AuthContext } from './components/context';

import RootStackScreen from './screens/RootStackScreen';

import AsyncStorage from '@react-native-community/async-storage';

import * as userSession from './util/userSession'
import { awaitable } from './util/util';

const Drawer = createDrawerNavigator();

const App = () => {
    const [isDarkTheme, setIsDarkTheme] = React.useState(false);

    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        ...PaperDefaultTheme,
        colors: {
        ...NavigationDefaultTheme.colors,
        ...PaperDefaultTheme.colors,
        background: '#ffffff',
        text: '#333333'
        }
    }
    
    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        ...PaperDarkTheme,
        colors: {
        ...NavigationDarkTheme.colors,
        ...PaperDarkTheme.colors,
        background: '#333333',
        text: '#ffffff'
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

    const [isLoading, setIsLoading] = React.useState(true);
    const [isSessionActive, setIsSessionActive] = React.useState(userSession.isSessionActive());

    userSession.subscribe(() => {
        const isSession = userSession.isSessionActive();
        setIsSessionActive(isSession);
        console.log("Is session active  " + isSessionActive);
    })

  const authContext = React.useMemo(() => ({
    toggleTheme: () => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
    }
  }), []);

    useEffect(() => {
        (async () => {
            const [token, err] = await awaitable(userSession.loadSessionToken());
            if (!token) return;

            if (!isSessionActive) userSession.initialize(token);
        })()
            .then(() => setIsLoading(false));
    }, [])

  console.log("Session --> " + isSessionActive);

  if(isLoading) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
    <AuthContext.Provider value={authContext}>
    <NavigationContainer theme={theme}>
      { isSessionActive ? (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
          <Drawer.Screen name="PaymentScreen" component={PaymentScreen} />
          <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
          {/* <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} /> */}
        </Drawer.Navigator>
      )
    :
      <RootStackScreen/>
    }
    </NavigationContainer>
    </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;
