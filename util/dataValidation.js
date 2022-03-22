import { isNumericString } from "./util";

export function isValidEmail(email) {
    if (typeof email != "string") return false;
    if (email.length > 100) return false;
    // Following email validating regexp is found on stackoverflow.
    const emailRegexp = 
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegexp.test(email);
}

export function isValidUsername(username) {
    // Write user name validating logic here.
    // Return true for valid usernames, false otherwise.
    const usernameRegexp = /.{4}/g;
    return usernameRegexp.test(username);
}

export function isValidPassword(password) {
    // Write the logic for a valid password here.
    // Return true for a valid password, false otherwise.
    if (password.length < 8) return false;
    const passwordRegexp = 
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegexp.test(password)
}

export function isValidVehicle(vehicleNo) {
    // Write vehicleNo validating logic here.
    // Return true for valid vehicleNo, false otherwise.
    const vehicleNumberRegexp = /^\(?([A-Z]{3})\)?[-. ]?-([0-9]{4})[-. ]?|^\(?([A-Z]{2})\)?[-. ]?-([0-9]{4})[-. ]?/g;
    return vehicleNumberRegexp.test(vehicleNo);
}

export function isValidOTP(otp){
    if (otp.length != 6) return false;
    return isNumericString(otp);
}

export function isValidPhone(phone){
    const phoneNumberRegexp = /^\(?([0-9]{3})\)?[-. ]?-([0-9]{3})[-. ]?-([0-9]{4})$/g;
    return phoneNumberRegexp.test(phone);;
}

export function isValidAmount(amount){
    if (amount < 100) return false;
    return isNumericString(amount);
}
