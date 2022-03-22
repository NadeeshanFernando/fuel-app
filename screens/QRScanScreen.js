import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    ImageBackground,
    Image,
    StatusBar,
    TextInput,
    StyleSheet,
    PermissionsAndroid,
    Linking,
    Alert,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { CameraKitCameraScreen } from 'react-native-camera-kit';

const QRScanScreen = ({ navigation, route }) => {

    const theme = useTheme();

    const [qrvalue, setQrvalue] = useState('');
    const [opneScanner, setOpneScanner] = useState(false);

    const { email } = route.params || {};

    const { colors } = useTheme();

    const onOpenlink = () => {
        // If scanned then function to open URL in Browser
        Linking.openURL(qrvalue);
    };

    const onBarcodeScan = (qrvalue) => {
        // Called after te successful scanning of QRCode/Barcode
        setQrvalue(qrvalue);
        setOpneScanner(false);
    };

    const onOpneScanner = () => {
        // To Start Scanning
        if (Platform.OS === 'android') {
            async function requestCameraPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: 'Camera Permission',
                            message: 'App needs permission for camera access',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        // If CAMERA Permission is granted
                        setQrvalue('');
                        setOpneScanner(true);
                    } else {
                        alert('CAMERA permission denied');
                    }
                } catch (err) {
                    alert('Camera permission err', err);
                    console.warn(err);
                }
            }
            // Calling the camera permission function
            requestCameraPermission();
        } else {
            setQrvalue('');
            setOpneScanner(true);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            <View style={styles.sliderContainer}>
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/scan.gif')}
                        resizeMode="cover"
                        style={styles.sliderImage}
                    />
                </View>
            </View>

            {opneScanner ? (
                <View style={{ flex: 1, marginTop: 10 }}>
                    <CameraKitCameraScreen
                        showFrame={false}
                        // Show/hide scan frame
                        scanBarcode={true}
                        // Can restrict for the QR Code only
                        laserColor={'blue'}
                        // Color can be of your choice
                        frameColor={'yellow'}
                        // If frame is visible then frame color
                        colorForScannerFrame={'black'}
                        // Scanner Frame color
                        onReadCode={(event) =>
                            onBarcodeScan(event.nativeEvent.codeStringValue)
                        }
                    />
                </View>
            ) : (
                    <View style={styles.container}>
                        <Text style={styles.textStyle}>
                            {qrvalue ? 'Scanned Result: ' + qrvalue : ''}
                        </Text>
                        {qrvalue.includes('https://') ||
                            qrvalue.includes('http://') ||
                            qrvalue.includes('geo:') ? (
                                <TouchableHighlight onPress={onOpenlink}>
                                    <Text style={styles.textLinkStyle}>
                                        {
                                            qrvalue.includes('geo:') ?
                                                'Open in Map' : 'Open Link'
                                        }
                                    </Text>
                                </TouchableHighlight>
                            ) : null}
                        <TouchableHighlight
                            onPress={onOpneScanner}
                            style={styles.buttonStyle}>
                            <Text style={styles.buttonTextStyle}>
                                Open QR Scanner
                            </Text>
                        </TouchableHighlight>
                    </View>
                )}

        </SafeAreaView>

    );
};

export default QRScanScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 10,
        alignItems: 'center',

    },
    titleText: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    textStyle: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        marginTop: 16,
    },
    buttonStyle: {
        fontSize: 16,
        color: 'white',
        backgroundColor: '#FF6347',
        marginTop: '25%',
        padding: 10,
        borderRadius: 10,
        minWidth: 250,
    },
    buttonTextStyle: {
        padding: 5,
        color: 'black',
        textAlign: 'center',
    },
    textLinkStyle: {
        color: 'blue',
        paddingVertical: 20,
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
    sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
    }
});
