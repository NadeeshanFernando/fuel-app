import React, { useEffect } from 'react';
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
  SafeAreaView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Swiper from 'react-native-swiper';
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

const RequestTagScreen = ({ navigation, route }) => {

  const theme = useTheme();

  const { email } = route.params || {};

  const [isValidPhone, setPhoneValidity] = React.useState(false);
  const [isPhoneShown, setIsPhoneShown] = React.useState(false);

  const [isValidVehicle, setVehicleValidity] = React.useState(false);
  const [isVehicleShown, setIsVehicleShown] = React.useState(false);

  const [isRequestTagEnabled, setRequestTagEnabled] = React.useState(false);

  const [vehicleNo, setvehicleNo] = React.useState('');
  const [engineNo, setengineNo] = React.useState('');
  const [fuelType, setfuelType] = React.useState('');
  const [phone, setphone] = React.useState('');
  const [country, setcountry] = React.useState('');
  const [city, setcity] = React.useState('');

  const [selectedValue, setSelectedValue] = React.useState("Petrol");

  const { colors } = useTheme();

  const onRequestTagClick = async () => {

    if (!vehicleNo.trim() || !engineNo.trim() || !fuelType || !phone.trim() || !city.trim()) {
      // Email is invalid. Prompt user a message telling the email is invalid.
      console.log("Fields Are Empty!");
      Alert.alert(
        'Warning!',
        'Fields Are Empty!');
      return;
    }

    if (!dataValidation.isValidVehicle(vehicleNo.trim())) {
      // Email is invalid. Prompt user a message telling the email is invalid.
      console.log("Invalid Vehicle");
      Alert.alert(
        'Warning!',
        'Please Enter Valid Vehicle Number!' +'\n'+ 'e.g: ABC-1234');
      return;
    }

    if (!isValidPhone) {
      // Phone is invalid. Prompt user a message telling the email is invalid.
      console.log("Invalid Phone number");
      Alert.alert(
        'Warning!',
        'Please enter valid phone number!');
      return;
    }

    if (fuelType == "0") {
      // Phone is invalid. Prompt user a message telling the email is invalid.
      console.log("Please select fuel type!");
      Alert.alert(
        'Warning!',
        'Please select fuel type!');
      return;
    }

    const token = userSession.getAccessToken();

    const requestData = {
      vehicle_no: vehicleNo.trim(),
      engine_no: engineNo.toUpperCase().trim(),
      fuel_type: fuelType,
      phone: phone.trim(),
      address: city.trim()
    }

    const fetchOptions = {
      method: requestMethods.REQUEST_TAG,
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`
      }
    }

    setRequestTagEnabled(true);

    // Sending request.
    const [response, err] = await awaitable(fetch(endpoints.REQUEST_TAG, fetchOptions));

    setRequestTagEnabled(false);

    if (err) {
      // Failed to complete the request. Possibly due to a network error.
      Alert.alert(
        'Warning!',
        'Please Check Your Network Connection!');
      console.log("Network error!!!");
      return;
    }

    const response_json = await response.json();

    //400
    if (response.status === 400) {
      Alert.alert( 
        'Warning!',
        'Already assigned a tag for' +'\n'+ 'Vehicle: ' + vehicleNo.trim() + ", Engine: " + engineNo.toUpperCase().trim());
      console.log(response_json);
      console.log(token);
      return;
    }

    //401
    if (response.status === 401) {
      Alert.alert( 
        'Session Timeout!',
        'Something went wrong. Please try again in few minutes or Sign in again to continue');
      console.log(response_json);
      console.log(token);
      return;
    }

    if (response.status === 201) {
      // Alert.alert(
      //   'Success!',
      //   'Thanks for your purchase for' +'\n'+ 'Vehicle: ' + vehicleNo + ", Engine: " + engineNo.toUpperCase());
      console.log(response_json);
      console.log(token);
      navigation.navigate('PaymentScreen', { items: vehicleNo, amount: "500", phone: phone, address: city, engineNo: engineNo.toUpperCase().trim() })
    }
  }

  React.useEffect(() => {
    if (dataValidation.isValidPhone(phone.trim())) setPhoneValidity(true);
    else setPhoneValidity(false);
  }, [phone.trim()]);

  React.useEffect(() => {
    if (dataValidation.isValidVehicle(vehicleNo.trim())) setVehicleValidity(true);
    else setVehicleValidity(false);
}, [vehicleNo.trim()]);

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

const InvalidPhoneWarning = (
  <Animatable.View animation="fadeInLeft" duration={500}>
      <Text style={styles.errorMsg}>e.g: xxx-xxx-xxxx</Text>
  </Animatable.View>
);

  return (
    <SafeAreaView style={styles.container}>

      {/* <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <View style={styles.sliderContainer}>
          <View style={styles.slide}>
            <Image
              source={require('../assets/banners/shed1.jpg')}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
      </View> */}

      <Text style={[styles.text_footer, {
        marginTop: 10
      }]}>Location</Text>
      <View style={styles.action}>
        {/* imporeted from 'react-native-vector-icons/FontAwesome' */}
      <FontAwesome name="globe" color="#0C58FA" size={27} />
      {/* imported from 'react-native-google-places-autocomplete' */}
    <GooglePlacesAutocomplete
      // ref={ref}
      placeholder='Search'
      // if fetchDetails={false}, places will not retrieve in detail 
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        // set selected value to the global variable
        setcity(data.description)
        
        console.log("GooglePlacesAutocomplete:" ,data.description)       
      }}
      query={{
        // Paste Google Maps API key belove
        key: 'AIzaSyBvMpfZgNHmFZib32x4HHLpKWstfhKhUAs',
        // language = English
        language: 'en',
      }}
      // currentLocation={true}
      // currentLocationLabel='Current location'
    /> 
    </View>

    <ScrollView>

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
      }]}>Engine Number</Text>
      <View style={styles.action}>
        <MaterialCommunityIcons name="engine" color="#000000" size={30} />
        <TextInput
          placeholder="Engine Number"
          placeholderTextColor="#C0C0C0"
          autoCorrect={false}
          onChangeText={setengineNo}
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
      }]}>Fuel Type</Text>
      <View style={styles.action}>
        <MaterialCommunityIcons name="gas-station" color="#DF7401" size={35} />
        <Picker
          selectedValue={fuelType}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue, itemIndex) => setfuelType(itemValue)}
        >
          <Picker.Item label="Select Fuel Type" color="#C0C0C0" value="0" />
          <Picker.Item label="Petrol" color="#000000" value="Petrol" />
          {/* <Picker.Item label="Super Petrol" color="#000000" value="Super Petrol" /> */}
          <Picker.Item label="Diesel" color="#000000" value="Diesel" />
          {/* <Picker.Item label="Super Diesel" color="#000000" value="Super Diesel" /> */}
        </Picker>
      </View>

      <Text style={[styles.text_footer, {
        marginTop: 10
      }]}>Phone</Text>
      <View style={styles.action}>
        <Icon name="cellphone-android" color="#0000A0" size={30} />
        <TextInput
          placeholder="Phone"
          placeholderTextColor="#C0C0C0"
          keyboardType="number-pad"
          autoCorrect={false}
          onChangeText={setphone}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
        />
        {isValidPhone && ValidFormFieldIcon}
        <TouchableOpacity onPress={() => setIsPhoneShown(!isPhoneShown)}>

        </TouchableOpacity>
      </View>
      {!isValidPhone && phone.length > 0 && InvalidPhoneWarning}

      <TouchableOpacity style={styles.commandButton}
        onPress={onRequestTagClick}
        disabled={isRequestTagEnabled}>
        <Text style={styles.panelButtonTitle}>Submit</Text>
      </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>




  );
};

export default RequestTagScreen;

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
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
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
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    fontSize: 15,
},
});
