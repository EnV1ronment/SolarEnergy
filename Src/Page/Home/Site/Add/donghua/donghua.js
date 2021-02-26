import React,{Component} from 'react'
import {View,Text,StyleSheet,Animated,TouchableOpacity,TouchableHighlight} from 'react-native'
class donghua extends Component {

    
    UNSAFE_componentWillMount=()=>{
        //创建动画属性对象
        this.ax=new Animated.Value(0);
        this.ay=new Animated.Value(0);

    }
    AnimatedBox=()=>{
        Animated.timing(this.ax,{
            toValue:100,
            duration:5000
        }).start()

        Animated.timing(this.ay,{toValue:100,duration:5000}).start()

        console.warn(this.ax,this.ax === '0')
    }

   

    render() {
        return (
            <View style={styles.container}>
              
              <TouchableOpacity
                            onPress={this.AnimatedBox}
                        >
                            <Animated.View style={[styles.box,{top:this.ax,left:this.ay}]}><Text>hh</Text></ Animated.View>
                        </TouchableOpacity>
               </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.theme,
    },
    box:{
        position: 'absolute',
        backgroundColor:'blue',
        width:50,
        height:100
    }
});

export default donghua;