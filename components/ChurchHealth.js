import React from "react";
import { Image, ImageBackground, Switch, Text, View } from "react-native";

import ListItem from "components/ListItem";

import useStyles from "hooks/use-styles";

import {
  baptismIcon,
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

import { localStyles } from "./ChurchHealth.styles";

const ChurchHealth = ({ items, selectedItems }) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const isSelected = (key) => selectedItems?.some(item => item?.key === key);

  const hasChurchCommitment = isSelected(ChurchHealthConstants.CHURCH_COMMITMENT);

  const ChurchCommitment = ({ hasChurchCommitment }) => {
    const toggleChurchCommitment = () => null;
    return(
      <ListItem
        // TODO: translate
        label={"Church Commitment"}
        endComponent={
          <Switch
            trackColor={{ true: styles.switch.color }}
            thumbColor={styles.switch}
            value={hasChurchCommitment}
            onChange={toggleChurchCommitment}
            disabled={false}
          />
        }
        style={styles.listItem}
      />
    );
  };

  const GridItem = ({ top, left, icon, selected }) => (
    <View style={[
      { 
        position: "absolute",
        top,
        left,
      },
      styles.gridBox
    ]}>
      {icon && (
        <Image
          source={icon}
          style={[
            styles.gridBox,
            styles.iconImage(selected)
          ]}
        />
      )}
    </View>
  );
  
  return(
    <>
      <View style={styles.container}>
        <ImageBackground
          source={hasChurchCommitment ? circleIcon : dottedCircleIcon}
          style={styles.circle}
          imageStyle={styles.circleImage(hasChurchCommitment)}
        />
        <GridItem top={0+20} left={0+10} />
        <GridItem top={0+20} left={60+10} />
        <GridItem top={0+20} left={150+15} icon={sharingIcon} selected={isSelected(ChurchHealthConstants.SHARING)} />
        <GridItem top={0+20} left={180+20} />
        <GridItem top={0+20} left={240+25} />
        <GridItem top={0+20} left={300+30} />

        <GridItem top={60+10} left={0+10} />
        <GridItem top={60+10} left={60+10} icon={praiseIcon} selected={isSelected(ChurchHealthConstants.PRAISE)} />
        <GridItem top={60+10} left={120+15} />
        <GridItem top={60+10} left={180+20} />
        <GridItem top={60+10} left={240+25} icon={leadersIcon} selected={isSelected(ChurchHealthConstants.LEADERS)} />
        <GridItem top={60+10} left={300+30} />

        <GridItem top={120+15} left={0+15} icon={prayerIcon} selected={isSelected(ChurchHealthConstants.PRAYER)} />
        <GridItem top={120+15} left={60+10} />
        <GridItem top={120+15} left={120+15} />
        <GridItem top={120+15} left={180+20} />
        <GridItem top={120+15} left={240+25} />
        <GridItem top={150+15} left={300+15} icon={baptismIcon} selected={isSelected(ChurchHealthConstants.BAPTISM)} />

        <GridItem top={180+20} left={0+15} icon={givingIcon} selected={isSelected(ChurchHealthConstants.GIVING)} />
        <GridItem top={180+20} left={60+10} />
        <GridItem top={180+20} left={120+15} />
        <GridItem top={180+20} left={180+20} />
        <GridItem top={180+20} left={240+25} />
        <GridItem top={180+20} left={300+30} />

        <GridItem top={240+25} left={0+10} />
        <GridItem top={240+25} left={60+10} icon={fellowshipIcon} selected={isSelected(ChurchHealthConstants.FELLOWSHIP)} />
        <GridItem top={240+25} left={120+15} />
        <GridItem top={240+25} left={180+20} />
        <GridItem top={240+25} left={240+25} icon={bibleStudyIcon} selected={isSelected(ChurchHealthConstants.BIBLE)} />
        <GridItem top={240+25} left={300+30} />

        <GridItem top={300+20} left={0+5} />
        <GridItem top={300+20} left={60+10} />
        <GridItem top={300+20} left={120+15} />
        <GridItem top={300+20} left={150+20} icon={communionIcon} selected={isSelected(ChurchHealthConstants.COMMUNION)} />
        <GridItem top={300+20} left={240+25} />
        <GridItem top={300+20} left={300+30} />
      </View>
      <View style={{ padding: 5 }}>
        <ChurchCommitment hasChurchCommitment={hasChurchCommitment} />
      </View>
    </>
  );
};
export default ChurchHealth;