import React from 'react';
import { useIsFocused } from '@react-navigation/native';

import Post from "components/Post/Post";
import FAB from "components/FAB";

const DetailsScreen = ({ navigation, route }) => {
  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();
  return(
    <>
      <Post />
      <FAB />
    </>
  );
};
export default DetailsScreen;