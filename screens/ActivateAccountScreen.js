import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';

import { endpoints, requestMethods } from "../util/serverEndpoints";
import { isValidOTP } from "../util/dataValidation";
import { awaitable } from '../util/util';

const ActivateAccountScreen = ({ navigation, route }) => {
    const { email } = route.params || {};

    // Following condition won't be satisfied if you navigate to this screen in
    // the correct procedure.
    if (typeof email == "undefined") throw new Error("email is undefined");

    const [OTP, setOTP] = React.useState('');
    const [isActivateBtnDisabled, setActivateBtnDisabled] = React.useState(false);

    const onSubmitOTP = async () => {
        if (!isValidOTP(OTP)) {
            // Invalid OTP. Promp user a message about it.
            Alert.alert("Invalid OTP");
            return false;
        }

        const requestData = {
            email: email,
            otp: OTP
        }

        const fetchOptions = {
            method: requestMethods.OTP_VERIFY,
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Disabling activate btn before sending request. So that users can't send multiple requests.
        setActivateBtnDisabled(true);

        // Sending request.
        const [response, err] = await awaitable(fetch(endpoints.OTP_VERIFY, fetchOptions));

        // Now that the request has been completed, activate the button again.
        setActivateBtnDisabled(false);

        if (err) {
            // Failed to complete the request. Possibly due to a network error.
            // Return from the function after handling the error. 
            console.log("Network error!!!");
            return;
        }

        const response_json = await response.json();

        if (!response.ok) {
            // Server responded with error status code.
            // Handle it here.
            Alert.alert("Incorrect OTP code! Try again.");
            console.log(response_json);
            return;
        }

        navigation.navigate('SuccessScreen')
    }

    const { colors } = useTheme();

    // Removed some ui elements as they are not needed.
    // as we already got user's email, there's no need to ask it again in this screen.

    // OTP is not a password. Even someone looked over shoulder when the user is entering OTP,
    // they have no good in it. So there's no point of letting user hide/show OTP. 
    // Therefore, Removed it too.

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#FFA500' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Account Activation!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}>
                <Text style={[styles.text_footer, {
                    color: colors.text,
                }]}>OTP</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color="#A52A2A"
                        size={20} />
                    <TextInput
                        placeholder="OTP Number"
                        placeholderTextColor="#666666"
                        keyboardType="number-pad"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={setOTP} />
                </View>
                <View style={styles.textPrivate}>
                    <Text style={styles.color_textPrivate}>
                        We sent you a
                </Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}OTP number</Text>
                    <Text style={styles.color_textPrivate}>{" "}to your email,</Text>
                    <Text style={styles.color_textPrivate}>{" "}Please check your email and paste it here to</Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}activate your account!</Text>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        disabled={isActivateBtnDisabled}
                        onPress={onSubmitOTP} >
                        <LinearGradient
                            colors={['#FFA07A', '#FF6347']}
                            style={styles.signIn} >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Activate</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignInScreen')}
                        style={[styles.signIn, {
                            borderColor: '#FF6347',
                            borderWidth: 1,
                            marginTop: 15
                        }]} >
                        <Text style={[styles.textSign, {
                            color: '#FF6347'
                        }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default ActivateAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFA500'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 0
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10
    }
});
