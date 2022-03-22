import React from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Share from 'react-native-share';

import files from '../assets/filesBase64';
import * as userSession from "../util/userSession";

const ProfileScreen = () => {

  const myCustomShare = async () => {
    const shareOptions = {
      message: 'Next time refuel your vehicle with Smart-Refuel App. I\'ve already installed the app and saved my time with Smart-Refuel.',
      url: files.appLogo,
      // urls: [files.image1, files.image2]
    }

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  const username = userSession.getUsername();
  const email = userSession.getEmail();

  return (
    <ScrollView style={styles.container}>

      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: 'row', marginTop: 55, color: '#FFFFFF' }}>
          <Avatar.Image
            source={require('../assets/logo-round.png')}
            size={80}
            backgroundColor='#FFFFFF'
          />
          <View style={{ marginLeft: 20 }}>
            <Title style={[styles.title, {
              marginTop: 15,
              marginBottom: 5,
            }]}>{username}</Title>
            <Caption style={styles.caption}>{email}</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        {/* <View style={styles.row}>
          <Icon name="map-marker-radius" color="#FF0000" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>Negombo, Sri Lanks</Text>
        </View> */}
        {/* <View style={styles.row}>
          <Icon name="phone" color="#0C58FA" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>+94-72 661 8185</Text>
        </View> */}
        <View style={styles.row}>
          <Icon name="email" color="#FF0000" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>{email}</Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
        <View style={[styles.infoBox, {
          borderRightColor: '#41A317',
          borderRightWidth: 1
        }]}>
          <Title>Rs.140.50</Title>
          <Caption>Wallet</Caption>
        </View>
        <View style={styles.infoBox}>
          <Title>12</Title>
          <Caption>Payments</Caption>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        
        <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <Icon name="credit-card" color="#A52A2A" size={25} />
            <Text style={styles.menuItemText}>Payment</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={myCustomShare}>
          <View style={styles.menuItem}>
            <Icon name="share-outline" color="#0000FF" size={25} />
            <Text style={styles.menuItemText}>Tell Your Friends</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <Icon name="account-check-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <Icon name="settings-outline" color="#000000" size={25} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#41A317',
    borderBottomWidth: 1,
    borderTopColor: '#41A317',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});
