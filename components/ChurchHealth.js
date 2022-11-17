import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";
//import ListItem from "components/ListItem";

import SheetHeader from "components/Sheet/SheetHeader";

import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";
import useSettings from "hooks/use-settings";

import { circleIcon, dottedCircleIcon } from "constants/icons";

import { ChurchHealthConstants } from "constants";
import { baptizeIconChurchHealth } from "constants/icons";

import { localStyles } from "./ChurchHealth.styles";

const size = 250;
const symbolSize = 16;

const radius = size / 2;
const center = radius;

const ChurchHealth = ({ items, selectedItems, post, values, onDone }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { settings } = useSettings();
  const { expand } = useBottomSheet();

  const showSheet = (iconDescription = "") => {
    expand({
      renderHeader: () => (
        <SheetHeader expandable dismissable title={"Church Health"} />
      ),
      renderContent: () => (
        <View style={{ marginHorizontal: 10 }}>
          <Text style={globalStyles.text}>{iconDescription}</Text>
        </View>
      ),
    });
  };

  const changeSelectStatus = (key, selected) => {
    let selectedKeys = selectedItems.map((item) => {
      return { value: item.key };
    });

    if (selected) {
      selectedKeys = selectedKeys.filter((item) => item?.value !== key);
    } else {
      selectedKeys.push({ value: key });
    }
    onDone({ values: selectedKeys });
  };

  const isSelected = (key) => selectedItems?.some((item) => item?.key === key);

  const hasChurchCommitment = isSelected(
    ChurchHealthConstants.CHURCH_COMMITMENT
  );

  let degToRad = (deg) => {
    return (deg * Math.PI) / 180;
  };

  let renderIcons = () => {
    const iconsData = settings?.fields?.health_metrics?.values || {};

    let iconsDataArray = [];

    // MAKING AN ARRAY OF OBJECTS FROM AN OBJECT OF OBJECTS
    for (let [key, value] of Object.entries(iconsData || {})) {
      if (
        key !== ChurchHealthConstants.CHURCH_COMMITMENT &&
        value.icon !== ""
      ) {
        iconsDataArray.push({ key, value });
      }
    }

    let totalIcons = iconsDataArray.length;

    let svgIconsArray = [];
    let angle = 0;
    let increaseAngle = Math.floor(360 / totalIcons);

    for (let i = 0; i < totalIcons; i++) {
      let angleRad = degToRad(angle);
      let x = radius * Math.cos(angleRad) + center - symbolSize / 2;
      let y = radius * Math.sin(angleRad) + center - symbolSize / 2;
      let selected = isSelected(iconsDataArray[i].key);

      let tempComp = (
        <Pressable
          onLongPress={() => showSheet(iconsDataArray[i].value.description)}
          style={{
            left: x + 25,
            top: y + 25,
            position: "absolute",
          }}
          onPress={() =>
            changeSelectStatus(
              iconsDataArray[i].key,
              selected,
              iconsDataArray[i].value
            )
          }
          key={iconsDataArray[i].key}
        >
          <SvgUri
            width={40}
            height={40}
            style={styles.iconImage(selected)}
            uri={iconsDataArray[i].value.icon}
          />
        </Pressable>
      );
      svgIconsArray.push(tempComp);
      angle += increaseAngle;
    }
    return svgIconsArray;
  };

  const ChurchCommitment = ({ hasChurchCommitment }) => {
    //const toggleChurchCommitment = () => null;
    return (
      <View style={styles.churchCommitmentSwitch}>
        <Text style={globalStyles.text}>Church Commitment </Text>
        <Switch
          trackColor={{ true: styles.switch.color }}
          thumbColor={styles.switch}
          value={hasChurchCommitment}
          onChange={() => {
            changeSelectStatus(
              ChurchHealthConstants.CHURCH_COMMITMENT,
              hasChurchCommitment
            );
          }}
        />
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.circleImageContainer}>
          <ImageBackground
            source={hasChurchCommitment ? circleIcon : dottedCircleIcon}
            style={styles.circle}
            imageStyle={styles.circleImage(hasChurchCommitment)}
          >
            {renderIcons()}
          </ImageBackground>
        </View>

        <View style={styles.baptismMainContainer}>
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
          <ChurchCommitment hasChurchCommitment={hasChurchCommitment} />
        </View>
      </View>
    </>
  );
};
export default ChurchHealth;
