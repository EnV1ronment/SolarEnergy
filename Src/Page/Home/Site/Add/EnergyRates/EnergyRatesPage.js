
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    View,
    Switch,
} from 'react-native';
import WKGeneralBackground from "../../../../../Common/Components/WKGeneralBackground";
import PeriodsView from "./Components/PeriodsView";


class EnergyRatesPage extends Component {

    state = {
        differentiateDay: false,
        differentiateTime: false,
        isWeekend: false,
        peak_periods: [],
        off_peak_periods: [],
    };

    dataSource = [
        {title: WK_T(wkLanguageKeys.account_setting), route: RouteKeys.AccountPage},
        {title: WK_T(wkLanguageKeys.faq), route: RouteKeys.FAQPage},
    ];

    // static navigationOptions = () => ({title: WK_T(wkLanguageKeys.setting)});
    static navigationOptions = () => ({title: 'EnergyRates'});

    componentDidMount () {
    }

    _save = () => {
        console.warn(this.state)
    };

    get_customized_periods_children = (flag) =>{
        const {peak_periods, off_peak_periods} = this.state;
        return(flag ? <View>
            <Text style={styles.mb_20_Text}>Peak:</Text>
          <PeriodsView periods={peak_periods} onValueChange={(periods)=>this.setState({peak_periods: periods})}/>
            <Text style={styles.mtb_20_Text}>Off - Peak:</Text>
          <PeriodsView periods={off_peak_periods} onValueChange={(periods)=>this.setState({off_peak_periods: periods})}/>
      </View>  : null)
    }
    render() {
        const {differentiateDay, differentiateTime, isWeekend} = this.state;
        let weekdayBGColor = !isWeekend ? {backgroundColor: 'rgb(31, 54, 119)'} : null;
        let weekdendBGColor = isWeekend ? {backgroundColor: 'rgb(31, 54, 119)'} : null;
        let periods = this.get_customized_periods_children(differentiateTime);
        return (<WKGeneralBackground>
            <View style={{width: __SCREEN_WIDTH__, height: __SCREEN_HEIGHT__ - 200}}>
                <ScrollView
                    nestedScrollEnabled={true}
                    contentContainerStyle={{flexGrow: 1}}>
                    <View style={styles.cardView}>
                        <View style={styles.titleView}>
                            <Text style={styles.title}>Energy rates varies from weekday to weekend</Text> 
                            <Switch 
                                style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }} 
                                trackColor={{ false: 'rgb(191, 191, 191)', true: Colors.buttonBgColor }} 
                                ios_backgroundColor='rgb(191, 191, 191)'
                                onValueChange={()=>this.setState({differentiateDay: !differentiateDay})}
                                value={differentiateDay}/>
                        </View>  
                        <Text style={styles.info}>Turn on the switch if your rates vary from time to time</Text>  
                        {differentiateDay && <View style={styles.selectrdBar}>
                            <TouchableOpacity
                                style={[styles.leftButton, weekdayBGColor]}
                                onPress={()=>this.setState({isWeekend: false})}
                                activeOpacity={0.5}
                            >
                                <Text style={styles.leftButtonText}>WeekDay</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.rightButton, weekdendBGColor]}
                                onPress={()=>this.setState({isWeekend: true})}
                                activeOpacity={0.5}
                            >
                                <Text style={styles.rightButtonText}>Weekend</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>
                    <View style={styles.cardView}>
                        <View style={styles.titleView}>
                            <Text style={styles.title}>Time of Use Rate</Text>  
                            <Switch 
                                style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }} 
                                trackColor={{ false: 'rgb(191, 191, 191)', true: Colors.buttonBgColor }} 
                                ios_backgroundColor='rgb(191, 191, 191)'
                                onValueChange={()=>this.setState({differentiateTime: !differentiateTime})}
                                value={differentiateTime}/>
                        </View>  
                        <Text style={styles.info}>Turn on the switch if your energy rates vary from weekday an weekend</Text>  
                        {periods}
                    </View>
                </ScrollView>
            </View>
           
            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity
                    style={styles.bottomButton}
                    onPress={this._save}
                    activeOpacity={0.5}
                >
                    <Text style={styles.bottomButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
        </WKGeneralBackground>);
    }

}

const styles = StyleSheet.create({
    cardView: {
        borderRadius: 3,
        padding: 20,
        backgroundColor: Colors.cellBackgroundColor,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        justifyContent: 'space-between',
    },
    titleView: {
        flexDirection: 'row'
    },
    title: {
        marginBottom: 20,
        width: __SCREEN_WIDTH__ - 120,
        color: Colors.white,
        fontSize:24,
        fontWeight: 'bold',
    },
    switchView: {
        width: 20,
        height: 20
    },
    info: {
        marginBottom: 20,
        color: Colors.placeholder,
        fontSize:16,
        lineHeight: 22
    },
    selectedView: {
        borderRadius: 3,
        padding: 20,
        backgroundColor: Colors.cellBackgroundColor,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        justifyContent: 'space-between',
    },
    selectrdBar: {
        flexDirection: 'row'
    },
    leftButton: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems:'center',
        borderWidth: 1,
        borderColor: 'rgb(31, 54, 119)',
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
    },
    leftButtonText: {
        color: Colors.white,
        fontSize:16,
    },
    rightButton: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems:'center',
        borderWidth: 1,
        borderColor: 'rgb(31, 54, 119)',
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
    },
    rightButtonText: {
        color: Colors.white,
        fontSize:16,
    },
    mtb_20_Text: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 16,
        color: "#fff",
    },
    mb_20_Text: {
        marginBottom: 20,
        fontSize: 16,
        color: "#fff",
    },
    // Bottom button
    bottomButtonContainer: {
        height: 80,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButton: {
        backgroundColor: Colors.buttonBgColor,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 240,
    },
    bottomButtonText: {
        color: Colors.white,
        fontSize:16,
    },
})

export default EnergyRatesPage;
