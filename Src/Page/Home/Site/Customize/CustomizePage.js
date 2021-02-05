import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native';
import WKGeneralBackground from "../../../../Common/Components/WKGeneralBackground";
import TopView from "./Components/TopView";
import ReserveView from "./Components/ReserveView";
import PeriodsView from "./Components/PeriodsView";
import ChooseSettingView from "./Components/ChooseSettingView";
export default class CustomizePage extends Component {

    static navigationOptions = () => ({title: WK_T(wkLanguageKeys.customize)});

    state = {
        back_up_only: false,
        customized_periods: false,
        advanced: false,
    };

    
    _back_up_only_select = (flag) =>{
        this.setState({
            back_up_only: !flag,
            customized_periods: false,
            advanced: false,
        });
    }
    customized_periods_select = (flag) =>{
        this.setState({
            back_up_only: false,
            customized_periods: !flag,
            advanced: false,
        });
    }
    advanced_select = (flag) =>{
        this.setState({
            back_up_only: false,
            customized_periods: false,
            advanced: !flag,
        });
    }

    get_back_up_only_children = (flag) =>{
        return(flag ? <View>
              <Text style={styles.mtb_20_Text}>{WK_T(wkLanguageKeys.back_up_only_reserve)}</Text>
            <ReserveView count={50}/>
        </View> : null)
    }

    get_customized_periods_children = (flag) =>{
        return(flag ? <View>
            <Text style={styles.mtb_20_Text}>{WK_T(wkLanguageKeys.customized_periods_set_up)}</Text>
            <Text style={styles.mb_20_Text}>{WK_T(wkLanguageKeys.charge_periods)}:</Text>
          <PeriodsView periods={[]}/>
            <Text style={styles.mtb_20_Text}>{WK_T(wkLanguageKeys.discharge_periods)}:</Text>
          <PeriodsView periods={[]}/>
      </View>  : null)
    }

    get_advanced_children = (flag) =>{
        return(flag ? <View>
            <Text style={styles.mtb_20_Text}>{WK_T(wkLanguageKeys.advanced_choose_setting)}</Text>
          <ChooseSettingView count={50} isBalanced={true}/>
      </View> : null)
    }
    render() {
        const {
            back_up_only,
            customized_periods,
            advanced
        } = this.state;
        let back_up_only_children = this.get_back_up_only_children(back_up_only);
        let customized_periods_children = this.get_customized_periods_children(customized_periods);
        let advanced_children = this.get_advanced_children(advanced);
        return (<WKGeneralBackground>
            <ScrollView style={styles.scrollView}>
                <View style={styles.top}>
                    <TopView title={WK_T(wkLanguageKeys.back_up_only)} selected={back_up_only} 
                    description={WK_T(wkLanguageKeys.back_up_only_dec)} onSelect={()=>this._back_up_only_select(back_up_only)} 
                    children={back_up_only_children}/>
                </View>

                <View style={styles.top}>
                    <TopView title={WK_T(wkLanguageKeys.customized_periods)} selected={customized_periods} 
                    description={WK_T(wkLanguageKeys.customized_periods_dec)} onSelect={()=>this.customized_periods_select(customized_periods)}
                    children={customized_periods_children}/>
                </View>
    
                <View style={styles.top}>
                    <TopView title={WK_T(wkLanguageKeys.advanced)} subheading={WK_T(wkLanguageKeys.advanced_subheading)} selected={advanced} 
                    description={WK_T(wkLanguageKeys.advanced_dec)} onSelect={()=>this.advanced_select(advanced)}
                    children={advanced_children}/>
                </View>
                
            </ScrollView>
            
        </WKGeneralBackground>);
    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    top: {
        paddingLeft: 20,
        paddingVertical: 20,
        backgroundColor: 'rgb(18,30,65)',
        marginHorizontal: 10,
        marginTop: 20,
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
    version: {
        color: 'white',
        marginTop: 15
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    copyright: {
        color: 'white',
        marginTop: 15,
        marginBottom: 65,
        marginLeft: 15,
        marginRight: 15,
        textAlign: 'center',
    },
});
