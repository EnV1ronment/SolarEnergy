import React, {Component} from 'react';
import {
    Text,
    ScrollView,
    View,
    StyleSheet,
} from 'react-native';
import WKGeneralBackground from "../../../../../Common/Components/WKGeneralBackground";

export default class FAQPage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.faq)});

    render() {
        return (<WKGeneralBackground>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.des}>
                    {des}
                    <Text style={styles.email}>support@wankeauto.com.</Text>
                </Text>
                <View style={styles.placeholder}/>
            </ScrollView>
        </WKGeneralBackground>);
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    des: {
        color: 'white',
        padding: 15,
        marginTop: 5,
        fontSize: 13,
    },
    placeholder: {
        height: __iosSafeAreaBottomHeight__ + 15,
    },
    email: {
        color: Colors.buttonBgColor,
        fontSize: 13,
        textDecorationLine: 'underline',
    },
});

const des = '1. How to sign up?\n\n' +
    'Get into “Sign Up” page. Enter your phone number, your customized password (8-16 characters contain both letter and number), confirm your password (two passwords must strictly same). Then you need to enter your verification code (if your phone number is valid). Finally, you must agree with our privacy policy then you will sign up successfully.\n' +
    '\n\n' +
    '2. How to log in?\n\n' +
    'Get into “Log in” page, enter your phone number (must be valid and signed up first) and password (must be valid), then you can log into app.\n' +
    '\n\n' +
    '3. What if I forgot my password?\n\n' +
    'Get into “Log in” page, press “Forgot Password” and you will be led to password reset page.\n' +
    'First you must verify your phone number. Enter your phone number and get you verification code, if they are valid, you press “Continue” to reset your password.\n' +
    'Second, enter your password twice (8-16 characters contain both letter and number and new password must not be the same as your old one). Then you press ”Confirm” and your password will be reset.\n' +
    '\n\n' +
    '4. How can I switch stations and devices when I’m in the “Status” page?\n\n' +
    'Press “All Stations” button there would be a list contains all your own stations and other people’s stations which are shared with you. You can choose a station or device under the stations whichever you want.\n' +
    '\n\n' +
    '5. How can I share my stations to my friends?\n\n' +
    'Press the “Share” button lying on the top left of the “Status” page there would be a window where you can select your stations that you want to share with friends on the upper part and you can enter your friends phone numbers on the lower part. Then you press “Confirm” to share your stations.\n' +
    '\n\n' +
    '6. How can I filter the history alarms by level?\n\n' +
    'There are three labels with different colors that you can press to filter the alarms by “Severe”, “Medium” and “Mild” level. The color would turn to be grey when you do not want to see that level alarm.\n' +
    '\n\n' +
    '7. How can I check the statistic data by different time scale?\n\n' +
    'You press the time showing on the page and there would be a small window at the bottom of the page which contains “Day”, “Week”. “Month” and “Date Range” scales. You select a time scale whatever you want to check the statistic data for that time scale.\n' +
    '\n\n' +
    '8. How can I build, edit or delete a station?\n\n' +
    'Get into “Me” menu and press “Stations” item, you will be in the station list page. In this page you can edit and delete you station by hold the item and select the operation you want to do. You can edit you station name at the item place. If you want to build a new station, you press the “Add” button on the top right of the page. You enter you station name to finish the building operation.\n' +
    '\n\n' +
    '9. How can I register or delete a device?\n\n' +
    'Get into “Me” menu, press “Stations” item then choose a station the get into device list. If you want to delete the device, you can hold the device item and delete it. If you want to register a device, you press the “Add” button on the top right of the page and scan the QR code of your device or enter SN code manually.\n' +
    '\n\n' +
    '10. How can I reset my phone number?\n\n' +
    'Get into “Me” menu, press “Settings”, press “Account Settings” and press “Change Phone” you will be in the right page. You must verify your new phone number by entering the valid verification code then you change your phone number successfully.\n' +
    '\n\n' +
    '11. How can I manage the sharing account?\n\n' +
    'Get into “Me” menu, press “Settings”, press “Sharing Settings” then you will be in the right page. In this page you can delete accounts that sharing with you and the accounts you sharing with by holding the item.\n' +
    '\n\n' +
    '12. How can I log out?\n\n' +
    'Get into “Me” menu and press “Settings”, there will be a “Log Out” button. You press this button and then you will be log out the app.\n' +
    '\n\n' +
    '13. Any other questions?\n\n' +
    'Please feel free to contact us whenever you meet a question. Our customer support email address is \n';

;
