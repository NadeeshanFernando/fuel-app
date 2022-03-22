import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import{ AuthContext } from '../components/context';

import * as userSession from '../util/userSession';

export function DrawerContent(props) {

    const paperTheme = useTheme();

    const username = userSession.getUsername();
    const email = userSession.getEmail();

    const { toggleTheme } = React.useContext(AuthContext);

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image 
                                source={require('../assets/logo-round.png')}
                                size={55}
                                backgroundColor='#FFFFFF'
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>Smart Refuel</Title>
                                <Caption style={styles.caption}>from anton</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                {/* <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph> */}
                                {/* <Caption style={styles.caption}>{username}</Caption> */}
                            </View>
                            <View style={styles.section}>
                                {/* <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph> */}
                                <Caption style={styles.caption}>{email}</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color="#0040FF"
                                size={30}
                                />
                            )}
                            label="Home"
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color="#DF7401"
                                size={30}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="cards-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="New Tag"
                            onPress={() => {props.navigation.navigate('RequestTagScreen')}}
                        /> */}
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="settings-outline" 
                                color="#000000"
                                size={30}
                                />
                            )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('SettingScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="credit-card" 
                                color="#A52A2A"
                                size={30}
                                />
                            )}
                            label="Payment"
                            onPress={() => {props.navigation.navigate('PaymentScreen')}}
                        />
                    </Drawer.Section>
                    <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color="#FF0000"
                        size={30}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {
                        props.navigation.toggleDrawer();
                        Alert.alert(
                          'Sign Out',
                          'Are you sure? You want to Sign Out?',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => {
                                return null;
                              },
                            },
                            {
                              text: 'Confirm',
                              onPress: () => {
                                userSession.destroySession();
                              },
                            },
                          ],
                          {cancelable: false},
                        );
                      }}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });