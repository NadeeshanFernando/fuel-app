import React from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import * as serverEndpoints from "../util/serverEndpoints";
import * as dataValidation from "../util/dataValidation";
import { awaitable } from '../util/util';

const SignInScreen = ({ navigation }) => {
    const [isValidPassword, setPasswordValidity] = React.useState(false);
    const [isPasswordShown, setIsPasswordShown] = React.useState(false);

    const [showConfirmedPassword, setShowConfirmedPassword] = React.useState(false);

    const [isValidEmail, setEmailValidity] = React.useState(false);

    const [isValidUsername, setUsernameValidity] = React.useState(false);
    const [isUsernameShown, setIsUsernameShown] = React.useState(false);

    const [isSignupDisabled, setSignupDisabled] = React.useState(false);

    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmedPassword, setConfirmedPassword] = React.useState('');

    const { colors } = useTheme();

    const onSignupClick = async () => {

        if (!username.trim() || !email.trim() || !password.trim() || !confirmedPassword.trim()) {
            // Email is invalid. Prompt user a message telling the email is invalid.
            console.log("Fields Are Empty!");
            Alert.alert(
                'Warning!',
                'Fields Are Empty!');
            return;
        }

        if (!dataValidation.isValidEmail(email.trim())) {
            // Email is invalid. Prompt user a message telling the email is invalid.
            console.log("Invalid email");
            Alert.alert(
                'Warning!',
                'Please Enter Valid Email!');
            return;
        }

        if (!dataValidation.isValidUsername(username.trim())) {
            // Username is invalid. Prompt user a message telling the username is invalid.
            console.log("Invalid username");
            Alert.alert(
                'Warning!',
                'Username must be more than 4 characters');
            return;
        }

        if (!dataValidation.isValidPassword(password.trim())) {
            // Password is invalid. Prompt user a message.
            console.log("Invalid password");
            Alert.alert(
                'Warning!',
                'Password must be 8 characters long including,' +'\n'+ '-Upper and lower case characters,' +'\n'+ '-1 or more numbers,' +'\n'+ '-Optionally use special characters');
            return;
        }

        if (password.trim() !== confirmedPassword.trim()) {
            // Passwords mismatched. Prompt user a message.
            console.log("password mismatch");
            Alert.alert(
                'Warning!',
                'Password mismatch!');
            return;
        }

        const { endpoints, requestMethods } = serverEndpoints;

        const signupRequestData = {
            name: username.trim(),
            email: email.trim(),
            password: password.trim(),
            re_password: confirmedPassword.trim()
        }


        const fetchOptions = {
            method: requestMethods.SIGN_UP,
            body: JSON.stringify(signupRequestData),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Disabling signup button so that user can't send several requests.
        setSignupDisabled(true);

        // Sending the request to the server.
        const [response, err] = await awaitable(fetch(endpoints.SIGN_UP, fetchOptions));

        // Now that request has been completed, enabling signup button again.
        setSignupDisabled(false);

        if (err) {
            // Failed to complete the request. Possibly due to a network error.
            // Return from the function after handling the error. 
            Alert.alert(
                'Warning!',
                'Please Check Your Network Connection!');
            console.log("Network error!!!");
            return;
        }

        // response_json contains body of server's response.
        const response_json = await response.json();

        //400
        if (response.status === 400) {
            Alert.alert( 
              'Warning!',
              'User account with this email already exists!');
            console.log(response_json);
            return;
          }

        // if (response.status === 201) {
        //     // Alert.alert(
        //     //     'Success!',
        //     //     'The password is too similar to the email!');
        //     console.log(response_json);
        //     return;
        // }

        // if (!response.ok) {
        //     // Server responded with error status code.
        //     // Handle it here.
        //     console.log(response_json);
        //     Alert.alert(
        //         'Warning!',
        //         'The password is too similar to the email!');
        //     return;
        // }

        // Server response is ok. Write any extra logic on successful server response.
        // response_json contains body of the server response in JSON. 

        // Sending OTP request
        fetch(endpoints.OTP_REQUEST, {
            method: requestMethods.OTP_REQUEST,
            body: JSON.stringify({ email: email.trim() }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                navigation.navigate('ActivateAccountScreen', { email: email.trim() });
            })
            .catch(() => {
                // OTP request failed. Possibly a network error. Handle it here.
            })

    }

    React.useEffect(() => {
        setEmailValidity(dataValidation.isValidEmail(email.trim()));
    }, [email.trim()]);

    React.useEffect(() => {
        if (dataValidation.isValidUsername(username.trim())) setUsernameValidity(true);
        else setUsernameValidity(false);
    }, [username.trim()]);

    React.useEffect(() => {
        if (dataValidation.isValidPassword(password.trim())) setPasswordValidity(true);
        else setPasswordValidity(false);
    }, [password.trim()]);

    const ValidFormFieldIcon = (
        <Animatable.View animation="bounceIn">
            <Feather
                name="check-circle"
                color="green"
                size={20}
            />
        </Animatable.View>);

    const InvalidPasswordWarning = (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>e.g: @Bcd3$f9</Text>
        </Animatable.View>
    );

    const InvalidUsernameWarning = (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Username must be 4 characters long.</Text>
        </Animatable.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#FFA500' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}>
                <ScrollView>

                    <Text style={[styles.text_footer, {
                        color: colors.text,
                        marginTop: 5
                    }]}>Username</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-circle"
                            color={colors.text}
                            color="#0000FF"
                            size={20} />
                        <TextInput
                            placeholder="Your Username"
                            style={[styles.textInput, {
                                color: colors.text
                            }]}
                            autoCapitalize="none"
                            onChangeText={setUsername} />

                        {isValidUsername && ValidFormFieldIcon}
                        <TouchableOpacity onPress={() => setIsUsernameShown(!isUsernameShown)}>

                        </TouchableOpacity>

                    </View>
                    {!isValidUsername && username.length > 0 && InvalidUsernameWarning}

                    <Text style={[styles.text_footer, {
                        marginTop: 5
                    }]}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="envelope"
                            color="#FF0000"
                            size={20} />
                        <TextInput
                            placeholder="Your Email"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={setEmail} />

                        {isValidEmail && ValidFormFieldIcon}

                    </View>

                    <Text style={[styles.text_footer, {
                        color: colors.text,
                        marginTop: 5
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#A52A2A"
                            size={20} />
                        <TextInput
                            placeholder="Your Password"
                            secureTextEntry={isPasswordShown ? false : true}
                            style={[styles.textInput, {
                                color: colors.text
                            }]}
                            autoCapitalize="none"
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setIsPasswordShown(!isPasswordShown)}>
                            <Feather
                                name={!isPasswordShown ? "eye" : "eye-off"}
                                color="grey"
                                size={20} />
                        </TouchableOpacity>
                    </View>
                    {!isValidPassword && password.length > 0 && InvalidPasswordWarning}

                    <Text style={[styles.text_footer, {
                        marginTop: 5
                    }]}>Confirm Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#A52A2A"
                            size={20} />
                        <TextInput
                            placeholder="Confirm Your Password"
                            secureTextEntry={!showConfirmedPassword}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={setConfirmedPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmedPassword(!showConfirmedPassword)}>
                            <Feather
                                name={!showConfirmedPassword ? "eye" : "eye-off"}
                                color="grey"
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            By signing up you agree to our
                </Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
                        <Text style={styles.color_textPrivate}>{" "}and</Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={onSignupClick}
                            disabled={isSignupDisabled}>
                            <LinearGradient
                                colors={['#FFA07A', '#FF6347']}
                                style={styles.signIn}>
                                <Text style={[styles.textSign, { color: '#fff' }]}>Sign Up</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#FF6347',
                                borderWidth: 1,
                                marginTop: 15
                            }]}>
                            <Text style={[styles.textSign, {
                                color: '#FF6347'
                            }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFA500'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
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
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
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
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 15,
    },
    button: {
        alignItems: 'center',
        marginTop: 20
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
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
});
