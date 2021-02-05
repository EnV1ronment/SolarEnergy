/**
 * @format
 */

import {AppRegistry} from 'react-native';
import './Src/Common/Constant/Global';
import './Src/Common/MultiLanguage';
import Root from './Src/Main/Root';
import {name as appName} from './app';

AppRegistry.registerComponent(appName, () => Root);
