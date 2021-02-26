import { Button } from '@ant-design/react-native';
import React, {Component} from 'react';
import {StyleSheet, View, Linking, Text, PermissionsAndroid, Image, TouchableWithoutFeedback, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';

const titleOfNavigation = 'Photo';
const options = {
    title: '请选择',
    cancelButtonTitle:'取消',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'从相册选择',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

class PhotoPage extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: titleOfNavigation,
        };
    };
    constructor(props) {
        super(props);
        const {navigation} = props;
        this.state = {
            response: null,
        };
    }

    componentDidMount() {
    }

    operate = ()=>{
        Alert.alert('', '',
            [
                {text: " 取消", onPress: () => {
                    return
                }},
                {
                    text: "设为封面", onPress: () => {this.setMask()}
                },
                {
                    text: "删除", onPress: () => {this.delete()}
                },
            ]
        )
    }

    _click = () => {
        ImagePicker.showImagePicker(options, (response) => {
            this.setState({response: response});
          });
    };

    render() {
        const {response} = this.state;

        return (
            <View style={styles.container}>
                <Button
            title="Take image"
            onPress={() =>
                this._click()
           }
         />
 
         <Button
           title="Select image"
           onPress={() =>
            console.warn(response)
            //  ImagePicker.launchImageLibrary(
            //    {
            //      mediaType: 'photo',
            //      includeBase64: false,
            //      maxHeight: 200,
            //      maxWidth: 200,
            //    },
            //    (response) => {
            //      this.setState({response});
            //    },
            //  )
           }
         />
 
         {response && (
             <TouchableWithoutFeedback onLongPress={()=>{this.operate()}}>
             
           <Image
           style={{width: 200, height: 200}}
           source={{uri: response.uri}}/>
             </TouchableWithoutFeedback>
         )}
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
});

export default PhotoPage;