import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const marginAuto = { marginTop: 'auto', marginTop: 'auto' };

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};
