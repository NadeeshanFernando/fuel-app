import React, { Component, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { data } from '../model/data';

import { endpoints, requestMethods } from '../util/serverEndpoints';
import { awaitable } from '../util/util';
import * as userSession from '../util/userSession';
import * as dataValidation from "../util/dataValidation";

export default function RequestSessionScreen({ navigation, route }) {

    const { email } = route.params || {};

    const theme = useTheme();

    const [selectedValue, setSelectedValue] = useState('');
    const [userValues, setUserValues] = useState([]);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [merchantId, setMerchantId] = useState('');
    const [amount, setAmount] = useState('');

    const [isRequestSessionEnabled, setRequestSessionEnabled] = React.useState(false);

    const [isValidAmount, setAmountValidity] = React.useState(false);
    const [isAmountShown, setIsAmountShown] = React.useState(false);

    const token = userSession.getAccessToken();

    useEffect(() => {
        getRFIDData();
    }, [])

    const onRequestSession = async () => {

        if (!merchantId.trim() || !amount.trim()) {
            // Email is invalid. Prompt user a message telling the email is invalid.
            console.log("Fields Are Empty!");
            Alert.alert(
              'Warning!',
              'Fields Are Empty!');
            return;
          }

        if (!isValidAmount) {
            // Phone is invalid. Prompt user a message telling the email is invalid.
            console.log("Invalid Fuel amount");
            Alert.alert(
                'Warning!',
                'Fuel amount should be more than 100 rupees!');
            return;
        }

        const user = {
            vehicle_no: vehicleNumber,
            merchant_id: merchantId.toUpperCase().trim(),
            amount: amount.trim(),
        }

        const fetchOptions = {
            method: requestMethods.REQUEST_REFUEL,
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            }
        };

        setRequestSessionEnabled(true);

        const [response, err] = await awaitable(fetch(endpoints.REQUEST_REFUEL, fetchOptions));

        setRequestSessionEnabled(false);

        if (err) {
            // Request failed. Possibly a network error. Handle it here.
            Alert.alert(
                'Warning!',
                'Please Check Your Network Connection!');
            return;
        }

        const response_json = await response.json();

        if (response.status === 403) {
            Alert.alert( 
                'Warning!',
                'You have already activated a session for' +'\n'+ 'Vehicle: ' + vehicleNumber.trim() + ',' +'\n'+ 'Refuel for Rs.' + amount.trim() +'\n'+ 'Please wait 3mins to placed another!');
          console.log(response_json);
          console.log(user);
          console.log(token);
          return;
        }

        if (response.status === 401) {
            Alert.alert( 
              'Session Timeout!',
              'Something went wrong. Please try again in few minutes or Sign in again to continue');
            console.log(response_json);
            console.log(token);
            return;
          }

        if (response.status === 201) {
            Alert.alert( 
                'Success!',
                'Session activated for Vehicle: ' + vehicleNumber.trim() + ',' +'\n'+ 'Refuel for Rs.' + amount.trim());
            console.log(response_json);
            console.log(token);
            navigation.navigate('Home')
        }

        // Alert.alert(
        //     'Warning',
        //     'Something went wrong. Please try again in few minutes or Sign in again to continue');
        // console.log(response_json);
        // console.log(token);
        // navigation.navigate('Home');
      
    }

    const getRFIDData = async () => {
        const token = userSession.getAccessToken();
        const fetchOptions = {
            method: requestMethods.RFID_DETAILS,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`
            }
        }

        const [response, err] = await awaitable(fetch(endpoints.RFID_DETAILS, fetchOptions));
        const responseBody = await response.json();
        console.log(responseBody);
        setUserValues(responseBody);
    } 

    const userData = userValues.map((rfid, id) => {
        console.log('RFIDValue: ' + rfid.vehicle_no);
        return  (
            <Picker.Item 
                label={rfid.vehicle_no} 
                value={rfid.vehicle_no} 
                key={id} />
        );
    })

    React.useEffect(() => {
        if (dataValidation.isValidAmount(amount.trim())) setAmountValidity(true);
        else setAmountValidity(false);
      }, [amount.trim()]);

      const InvalidAmountWarning = (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>e.g: should be more than 100 rupees</Text>
        </Animatable.View>
      );

    return (
        <ScrollView style={styles.container}>

            <StatusBar />
            
            <View style={styles.sliderContainer}>
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/banners/shed2.jpg')}
                        resizeMode="cover"
                        style={styles.sliderImage} />
                </View>
            </View>

            <Text style={[styles.text_footer, {marginTop: 20}]}>
                Vehicle Number
            </Text>
            <View style={styles.action}>
                <FontAwesome name="car" color="#E85B06" size={28} />
                <Picker 
                    selectedValue={vehicleNumber} 
                    style={{ height: 50, width: 200 }}
                    onValueChange={(itemValue, itemIndex) => setVehicleNumber(itemValue)}
                    >
                    {userData}
                </Picker>
            </View>

            <Text style={[styles.text_footer, {marginTop: 10}]}>
                Merchant ID
            </Text>

            <View style={styles.action}>
                <MaterialCommunityIcons name="account-details" color="#0040FF" size={40} />
                <TextInput
                placeholder="Merchant ID"
                placeholderTextColor="#C0C0C0"
                autoCorrect={false}
                // value={merchantId}
                onChangeText={setMerchantId} />
            </View>

            <Text style={[styles.text_footer, { marginTop: 10}]}>
                Fuel Amount
            </Text>
            <View style={styles.action}>
                <MaterialCommunityIcons name="gas-station" color="#DF7401" size={35} />
                <TextInput
                    placeholder="Fuel Amount"
                    placeholderTextColor="#C0C0C0"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    // value={amount}
                    onChangeText={setAmount} />

                {/* {isValidAmount && ValidFormFieldIcon} */}
                <TouchableOpacity onPress={() => setIsAmountShown(!isAmountShown)}>

                </TouchableOpacity>
            </View>
            {!isValidAmount && amount.length > 0 && InvalidAmountWarning}

            <TouchableOpacity 
                style={styles.commandButton}
                onPress={onRequestSession} 
                disabled={isRequestSessionEnabled}>
                <Text style={styles.panelButtonTitle}>Submit</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 10,
  
    },
    action: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 15
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
    },
    sliderContainer: {
        height: 200,
        width: '100%',
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 100,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    }
});