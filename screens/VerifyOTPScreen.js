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

import * as dataValidation from "../util/dataValidation";
import { endpoints, requestMethods } from "../util/serverEndpoints";
import { awaitable } from "../util/util";

const VerifyOTPScreen = ({ navigation, route }) => {
    const { email } = route.params || {};

    // Following condition won't be satisfied if you navigate to this screen in
    // the correct procedure.
    if (typeof email == "undefined") throw new Error("email is undefined");

    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const [otp, setOtp] = React.useState('');
    const [isValidOtp, setOtpValidity] = React.useState(false);

    const { colors } = useTheme();

    React.useEffect(() => {
        setOtpValidity(dataValidation.isValidOTP(otp));
    }, [otp]);

    const ValidFormFieldIcon = (
        <Animatable.View animation="bounceIn">
            <Feather
                name="check-circle"
                color="green"
                size={20} />
        </Animatable.View>
    );

    const onOtpSubmit = async () => {
        if (!isValidOtp) {
            Alert.alert("Invalid Otp", "Given OTP is not valid.");
            return;
        }

        const requestData = {
            email: email,
            otp: otp
        }

        const fetchOptions = {
            method: requestMethods.OTP_VERIFY_PASSWORD_RESET,
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Sending request.
        const [response, err] = await awaitable(fetch(endpoints.OTP_VERIFY_PASSWORD_RESET, fetchOptions));

        if (err) {
            // Failed to complete the request. Possibly due to a network error.
            console.log("Network error!!!");
            return;
        }

        const response_json = await response.json();

        if (!response.ok) {
            // Server responded with error status code.
            // Handle it here.
            Alert.alert("Incorrect OTP code! Try again.");
            console.log(response_json);
            console.log(requestData);
            return;
        }

        navigation.navigate('ResetPasswordScreen', { email: email });
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#FFA500' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Enter OTP number!</Text>
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
                        onChangeText={val => setOtp(val.trim())} />

                    {isValidOtp && ValidFormFieldIcon}

                </View>

                <View style={styles.textPrivate}>
                    <Text style={styles.color_textPrivate}>
                        Please check
                </Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}your email</Text>
                    <Text style={styles.color_textPrivate}>{" "}for a message with your</Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}OTP.</Text>
                    <Text style={styles.color_textPrivate}>{" "}Your</Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}OTP</Text>
                    <Text style={styles.color_textPrivate}>{" "}is</Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}6 digits long.</Text>
                </View>

                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={onOtpSubmit}>
                        <LinearGradient
                            colors={['#FFA07A', '#FF6347']}
                            style={styles.signIn}>
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Continue</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignInScreen')}
                        style={[styles.signIn, {
                            borderColor: '#FF6347',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: '#FF6347'
                        }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFA500'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50,
        // marginTop: 5
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
        fontSize: 15,
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
        borderRadius: 10
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
