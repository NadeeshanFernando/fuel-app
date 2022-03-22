import React, { useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';

import * as dataValidation from "../util/dataValidation";
import { endpoints, requestMethods } from '../util/serverEndpoints';
import { awaitable } from '../util/util';
import * as userSession from '../util/userSession';

const SignInScreen = ({navigation}) => {
    const [isValidPassword, setPasswordValidity] = React.useState(false);
    const [isValidEmail, setEmailValidity] = React.useState(false);
    const [isPasswordShown, setIsPasswordShown] = React.useState(false);

    const [isSignInDisabled, setSignInDisabled] = React.useState(false);

    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');

    const { colors } = useTheme();

    const onSignInClick = async () => {

        if(!email.trim() || !password.trim()) {
            Alert.alert(
                'Warning!',
                'Fields Are Empty!');
            return;
        }

        if (!dataValidation.isValidEmail(email.trim())) {
            // Invalid email. Prompt user a message about it.
            Alert.alert(
                'Warning!',
                'Please Enter Valid Email!');
            return;
        }
        
        if (!dataValidation.isValidPassword(password.trim())) {
            // Invalid password. Prompt user a message about it.
            Alert.alert(
                'Warning!',
                'Please Enter Valid Password!');
            return;
        }

        const requestData = {
            email : email.trim(),
            password : password.trim()
        };

        const signInOptions = {
            method : requestMethods.SIGN_IN,
            body : JSON.stringify(requestData),
            headers: { 
                'Content-Type': 'application/json'
            }
        };

        // Disabling signup button so that user can't send several requests.
        setSignInDisabled(true);

        const [response_signIn, err_signIn] = await awaitable(fetch(endpoints.SIGN_IN, signInOptions));

        setSignInDisabled(false);

        if (err_signIn) {
            // Failed to complete the request. Possibly due to a network error.
            // Return from the function after handling the error. 
            console.log("Network error!!!");
            Alert.alert(
                'Warning!',
                'Please Check Your Network Connection!');
            return;
        }

        // responseBody contains body of server's response.
        const responseBody_signIn = await response_signIn.json();

        if (response_signIn.status === 401) {
            // Server responded with error status code.
            // Handle it here.
            console.log(responseBody_signIn);
            Alert.alert(
                'Warning!',
                'No active account found with the given credentials!');
            return;
        } 

        // Server response is ok. Write any extra logic on successful server response.

        const token = responseBody_signIn.access;
        const isSignedIn = await userSession.initialize(token);

        if(!isSignedIn) {
            Alert.alert("Could not sign in", "Sign in attempt failed!");
            setSignInDisabled(true);
        }
    }

    useEffect(() => {
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
        </Animatable.View>
    );

    const InvalidPasswordWarning = (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
        </Animatable.View>
    );

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#FFA500' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}>
            <Text style={[styles.text_footer, {
                color: colors.text
            }]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="envelope"
                    color={colors.text}
                    color="#FF0000"
                    size={20} />
                <TextInput 
                    placeholder="Your Email"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={setEmail} 
                    onEndEditing={e => {
                        const emailValidity = dataValidation.isValidEmail(e.nativeEvent.text);
                        setEmailValidity(emailValidity);
                    }}/>

                { isValidEmail && ValidFormFieldIcon }

            </View>
            
            <Text style={[styles.text_footer, {
                color: colors.text,
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    color="#A52A2A"
                    size={20} />
                <TextInput 
                    placeholder="Your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={isPasswordShown ? false : true}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={setPassword} />
                <TouchableOpacity onPress={() => setIsPasswordShown(!isPasswordShown)}>
                    <Feather 
                        name={isPasswordShown? "eye-off" : "eye"}
                        color="grey"
                        size={20} />
                </TouchableOpacity>
            </View>

            { !isValidPassword && password.length > 0 && InvalidPasswordWarning}

            <TouchableOpacity>
                <Text style={{color: '#FF6347', marginTop:15}}
                onPress={() => navigation.navigate('RequestResetScreen')}>Forgotten password?</Text>
            </TouchableOpacity>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    disabled={isSignInDisabled}
                    onPress={onSignInClick} >
                    <LinearGradient
                        colors={['#FFA07A', '#FF6347']}
                        style={styles.signIn}>
                        <Text style={[styles.textSign, {
                            color:'#fff'
                        }]}>Sign In</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUpScreen')}
                    style={[styles.signIn, {
                        borderColor: '#FF6347',
                        borderWidth: 1,
                        marginTop: 15
                    }]} >
                    <Text style={[styles.textSign, {
                        color: '#FF6347'
                    }]}>Sign Up</Text>
                </TouchableOpacity>
            </View>
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
        fontSize: 15,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
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
    }
  });
