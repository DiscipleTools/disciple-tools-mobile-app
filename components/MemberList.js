import React from "react";
import { Text } from "react-native";

const MemberList = ({ members }) => {
  return (
    <>
      {members.map((member) => (
        <Text>{member?.name}</Text>
      ))}
    </>
  );
};
export default MemberList;
