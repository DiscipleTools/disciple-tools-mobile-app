import React from 'react';
import { View, Text } from 'react-native';

//import { styles } from "./MemberList.styles";

const MemberList = ({ members }) => (
  <View>
    {members.map((member, idx) => (
      <Text
        key={member?.name ?? idx}
      >
        {member?.name}
      </Text>
    ))}
  </View>
);
export default MemberList;
