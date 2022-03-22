const endpoints = {
    SIGN_UP : "http://smart-iot-app.herokuapp.com/auth/users/",
    SIGN_IN : "http://smart-iot-app.herokuapp.com/auth/jwt/create/",
    OTP_REQUEST : "http://smart-iot-app.herokuapp.com/auth/send_otp",
    OTP_VERIFY : "http://smart-iot-app.herokuapp.com/auth/user_verification",
    OTP_VERIFY_PASSWORD_RESET : "http://smart-iot-app.herokuapp.com/auth/user_verification",
    RESET_PASSWORD : "http://smart-iot-app.herokuapp.com/auth/set_new_password",
    GET_USER_INFO : "http://smart-iot-app.herokuapp.com/auth/users/me/",
    REQUEST_TAG : "http://smart-iot-app.herokuapp.com/user/rfid-detail",
    REQUEST_REFUEL : "http://smart-iot-app.herokuapp.com/user/request-purchase",
    RFID_DETAILS : "http://smart-iot-app.herokuapp.com/user/rfid-detail",
    REFUEL_HISTORY : "http://smart-iot-app.herokuapp.com/user/request-purchase-history",
    MAKE_INQUIRY : "http://smart-iot-app.herokuapp.com/user/make-inquiry",
    REFRESH : "http://smart-iot-app.herokuapp.com/auth/jwt/refresh/",
}

const requestMethods = {
    SIGN_UP : "POST",
    SIGN_IN : "POST",
    OTP_REQUEST : "PUT",
    OTP_VERIFY : "PUT",
    OTP_VERIFY_PASSWORD_RESET: "POST",
    RESET_PASSWORD : "PATCH",
    GET_USER_INFO : "GET",
    REQUEST_TAG : "POST",
    REQUEST_REFUEL : "POST",
    RFID_DETAILS : "GET",
    REFUEL_HISTORY : "GET",
    MAKE_INQUIRY : "POST",
    REFRESH : "POST",
}

export { requestMethods, endpoints };