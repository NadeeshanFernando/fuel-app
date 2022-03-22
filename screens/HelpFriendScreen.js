import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Image,
  StatusBar,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { data } from '../model/data';
import Card from '../components/Card';

import * as dataValidation from "../util/dataValidation";
import { endpoints, requestMethods } from '../util/serverEndpoints';
import { awaitable } from '../util/util';
import * as userSession from '../util/userSession';

const HelpFriendScreen = ({ navigation }) => {

  const theme = useTheme();

  const [isRequestSessionEnabled, setRequestSessionEnabled] = React.useState(false);

  const [vehicleNo, setvehicleNo] = React.useState('');
  const [merchantId, setMerchantId] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const [isValidVehicle, setVehicleValidity] = React.useState(false);

  const [isValidAmount, setAmountValidity] = React.useState(false);
  const [isAmountShown, setIsAmountShown] = React.useState(false);

  const { colors } = useTheme();

  const onRequestSessionClick = async () => {

    if (!vehicleNo.trim() || !merchantId.trim() || !amount.trim()) {
      // Email is invalid. Prompt user a message telling the email is invalid.
      console.log("Fields Are Empty!");
      Alert.alert(
        'Warning!',
        'Fields Are Empty!');
      return;
    }

    if (!dataValidation.isValidVehicle(vehicleNo)) {
      // Email is invalid. Prompt user a message telling the email is invalid.
      console.log("Invalid Vehicle");
      Alert.alert(
        'Warning!',
        'Please Enter Valid Vehicle Number!' +'\n'+ 'e.g: ABC-1234');
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

    const token = userSession.getAccessToken();

    const requestData = {
      vehicle_no: vehicleNo.trim(),
      merchant_id: merchantId.toUpperCase().trim(),
      amount: amount.trim(),
    }

    const fetchOptions = {
      method: requestMethods.REQUEST_REFUEL,
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`
      }
    }

    setRequestSessionEnabled(true);

    // Sending request.
    const [response, err] = await awaitable(fetch(endpoints.REQUEST_REFUEL, fetchOptions));

    setRequestSessionEnabled(false);

    if (err) {
      // Failed to complete the request. Possibly due to a network error.
      Alert.alert(
        'Warning!',
        'Please Check Your Network Connection!');
      console.log("Network error!!!");
      return;
    }

    const response_json = await response.json();
    // const error_json = await err.JSON();response.status === 400

    if (response.status === 500) {
      // Server responded with error status code.
      // Handle it here.
      Alert.alert(
        'Warning!',
        'Vehicle ' + vehicleNo.trim() + ', is already requested a new tag. Please wait for activation!');
      console.log(response_json);
      return;
    }

    if (response.status === 401) {
      // Server responded with error status code.
      // Handle it here.
      Alert.alert(
        'Warning!',
        'Vehicle ' + vehicleNo.trim() + ', is not registerd with our system. Please enter registered vehicle number.');
      console.log(response_json);
      return;
    }    

    if (response.status === 403) {
      // Server responded with error status code.
      // Handle it here.
      Alert.alert(
        'Warning!',
        'Please wait 3 minutes to place another request!');
      console.log(response_json);
      return;
    }

    if (response.status === 201) {
      // Server responded with error status code.
      // Handle it here.
      Alert.alert(
        'Success',
        'Session activated for Vehicle: ' + vehicleNo.trim() + ',' +'\n'+ 'Refuel for Rs.' + amount.trim());
      console.log(response_json);
      return;
    }
  }

  React.useEffect(() => {
    if (dataValidation.isValidVehicle(vehicleNo.trim())) setVehicleValidity(true);
    else setVehicleValidity(false);
}, [vehicleNo.trim()]);

React.useEffect(() => {
  if (dataValidation.isValidAmount(amount.trim())) setAmountValidity(true);
  else setAmountValidity(false);
}, [amount.trim()]);

const ValidFormFieldIcon = (
  <Animatable.View animation="bounceIn">
    <Feather
      name="check-circle"
      color="green"
      size={25}
    />
  </Animatable.View>);

const InvalidVehicleWarning = (
  <Animatable.View animation="fadeInLeft" duration={500}>
      <Text style={styles.errorMsg}>e.g: ABC-1234, AB-1234</Text>
  </Animatable.View>
);

const InvalidAmountWarning = (
  <Animatable.View animation="fadeInLeft" duration={500}>
      <Text style={styles.errorMsg}>e.g: should be more than 100 rupees</Text>
  </Animatable.View>
);

  return (
    <ScrollView style={styles.container}>

      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <View style={styles.sliderContainer}>
        <View style={styles.slide}>
          <Image
            source={require('../assets/banners/shed3.jpg')}
            resizeMode="cover"
            style={styles.sliderImage}
          />
        </View>
      </View>


      <Text style={[styles.text_footer, {
        marginTop: 20
      }]}>Vehicle Number</Text>
      <View style={styles.action}>
        <FontAwesome name="car" color="#E85B06" size={28} />
        <TextInput
          placeholder="Vehicle Number"
          placeholderTextColor="#C0C0C0"
          autoCorrect={false}
          onChangeText={setvehicleNo}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
        {isValidVehicle && ValidFormFieldIcon}
        <TouchableOpacity onPress={() => setIsVehicleShown(!isVehicleShown)}>

        </TouchableOpacity>
      </View>
      {!isValidVehicle && vehicleNo.length > 0 && InvalidVehicleWarning}

      <Text style={[styles.text_footer, {
        marginTop: 10
      }]}>Merchant ID</Text>
      <View style={styles.action}>
        <MaterialCommunityIcons name="account-details" color="#0040FF" size={40} />
        <TextInput
          placeholder="Merchant ID"
          placeholderTextColor="#C0C0C0"
          autoCorrect={false}
          onChangeText={setMerchantId}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
      </View>

      <Text style={[styles.text_footer, {
        marginTop: 10
      }]}>Fuel Amount</Text>
      <View style={styles.action}>
        <MaterialCommunityIcons name="gas-station" color="#DF7401" size={35} />
        <TextInput
          placeholder="Fuel Amount"
          placeholderTextColor="#C0C0C0"
          keyboardType="number-pad"
          autoCorrect={false}
          onChangeText={setAmount}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
        {isValidAmount && ValidFormFieldIcon}
        <TouchableOpacity onPress={() => setIsAmountShown(!isAmountShown)}>

        </TouchableOpacity>
      </View>
      {!isValidAmount && amount.length > 0 && InvalidAmountWarning}

      <TouchableOpacity style={styles.commandButton}
        onPress={onRequestSessionClick}
        disabled={isRequestSessionEnabled}>
        <Text style={styles.panelButtonTitle}>Submit</Text>
      </TouchableOpacity>

    </ScrollView>




  );
};

export default HelpFriendScreen;

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
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    fontSize: 15,
},
});
