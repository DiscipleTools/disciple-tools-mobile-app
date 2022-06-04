import React from "react";
import { Image, ImageBackground, Switch, Text, View } from "react-native";

//import ListItem from "components/ListItem";

import useStyles from "hooks/use-styles";

import {
  baptismsIcon,
  bibleStudyIcon,
  communionIcon,
  fellowshipIcon,
  givingIcon,
  prayerIcon,
  praiseIcon,
  sharingIcon,
  leadersIcon,
  circleIcon,
  dottedCircleIcon,
} from "constants/icons";

import { ChurchHealthConstants } from "constants";
import { baptizeIconChurchHealth } from "constants/icons";

import { localStyles } from "./ChurchHealth.styles";

const ChurchHealth = ({ items, selectedItems, post, values }) => {
  const { styles, globalStyles } = useStyles(localStyles);

  const isSelected = (key) => selectedItems?.some((item) => item?.key === key);

  const hasChurchCommitment = isSelected(
    ChurchHealthConstants.CHURCH_COMMITMENT
  );

  /*
  const ChurchCommitment = ({ hasChurchCommitment }) => {
    //const toggleChurchCommitment = () => null;
    return(
      <ListItem
        label={i18n.t("global.churchCommitment")}
        endComponent={
          <Switch
            trackColor={{ true: styles.switch.color }}
            thumbColor={styles.switch}
            value={hasChurchCommitment}
            //onChange={toggleChurchCommitment}
            // NOTE: disabled bc user will click Edit and use multi-select
            disabled={true}
          />
        }
        style={styles.listItem}
      />
    );
  };
  */

  const GridItem = ({ top, left, icon, selected }) => (
    <View
      style={[
        {
          position: "absolute",
          top,
          left,
        },
        styles.gridBox,
      ]}
    >
      {icon && (
        <Image
          source={icon}
          //resizeMode="contain"
          style={[styles.gridBox, styles.iconImage(selected)]}
        />
      )}
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={hasChurchCommitment ? circleIcon : dottedCircleIcon}
          style={styles.circle}
          imageStyle={styles.circleImage(hasChurchCommitment)}
        />
        <GridItem top={0 + 10} left={0} />
        <GridItem top={0 + 10} left={60} />
        <GridItem
          top={0 + 10}
          left={150}
          icon={sharingIcon}
          selected={isSelected(ChurchHealthConstants.SHARING)}
        />
        <GridItem top={0 + 10} left={180} />
        <GridItem top={0 + 10} left={240} />
        <GridItem top={0 + 10} left={300} />

        <GridItem top={60 - 5} left={0} />
        <GridItem
          top={60 - 5}
          left={60}
          icon={praiseIcon}
          selected={isSelected(ChurchHealthConstants.PRAISE)}
        />
        <GridItem top={60 - 5} left={120} />
        <GridItem top={60 - 5} left={180} />
        <GridItem
          top={60 - 5}
          left={240}
          icon={leadersIcon}
          selected={isSelected(ChurchHealthConstants.LEADERS)}
        />
        <GridItem top={60 - 5} left={300} />

        <GridItem
          top={120 - 5}
          left={0 + 25}
          icon={prayerIcon}
          selected={isSelected(ChurchHealthConstants.PRAYER)}
        />
        <GridItem top={120} left={60} />
        <GridItem top={120} left={120} />
        <GridItem top={120} left={180} />
        <GridItem top={120} left={240} />
        <GridItem
          top={120 + 30}
          left={300 - 20}
          icon={baptismsIcon}
          selected={isSelected(ChurchHealthConstants.BAPTISM)}
        />

        <GridItem
          top={180}
          left={0 + 25}
          icon={givingIcon}
          selected={isSelected(ChurchHealthConstants.GIVING)}
        />
        <GridItem top={180} left={60} />
        <GridItem top={180} left={120} />
        <GridItem top={180} left={180} />
        <GridItem top={180} left={240} />
        <GridItem top={180} left={300} />

        <GridItem top={240} left={0} />
        <GridItem
          top={240}
          left={60 + 10}
          icon={fellowshipIcon}
          selected={isSelected(ChurchHealthConstants.FELLOWSHIP)}
        />
        <GridItem top={240} left={120} />
        <GridItem top={240} left={180} />
        <GridItem
          top={240}
          left={240 - 20}
          icon={bibleStudyIcon}
          selected={isSelected(ChurchHealthConstants.BIBLE)}
        />
        <GridItem top={240} left={300} />

        <GridItem top={300} left={0} />
        <GridItem top={300} left={60} />
        <GridItem top={300} left={120} />
        <GridItem
          top={300 - 20}
          left={180 - 30}
          icon={communionIcon}
          selected={isSelected(ChurchHealthConstants.COMMUNION)}
        />
        <GridItem top={300} left={240} />
        <GridItem top={300} left={300} />
        <View style={styles.baptismContainer}>
          <Text>
            {post?.member_count && post?.baptized_member_count
              ? post.member_count - post.baptized_member_count
              : 0}
          </Text>
          <Image
            resizeMode="contain"
            source={baptizeIconChurchHealth}
            style={styles.baptizeIconChurchHealth}
          />
          <Text>{post?.baptized_member_count ?? ""}</Text>
        </View>
      </View>
      {/*
      <View style={{ padding: 5 }}>
        <ChurchCommitment hasChurchCommitment={hasChurchCommitment} />
      </View>
      */}
    </>
  );
};
export default ChurchHealth;
