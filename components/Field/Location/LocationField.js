import React from "react";
import { Linking, Pressable, Text, View } from "react-native";
//import PropTypes from 'prop-types';

import useDevice from "hooks/useDevice";
import useI18N from "hooks/useI18N";
import useLocations from "hooks/useLocations";

//import MultiSelect from "components/MultiSelect";

import { styles } from "./LocationField.styles";

const LocationField = ({ editing, value, onChange }) => {

  const { isIOS } = useDevice();
  const { i18n, isRTL } = useI18N();

  // ITEMS
  const items = useLocations();
  if (!items) return null;

  // Locations relevant to this particular Post
  //const selectedItems = value?.values ?? null;

  // TODO: enable search
  //const searchLocationsDelayed = utils.debounce((queryText) => {...}, 750);

  const LocationFieldEdit = () => null;
  /*
  const LocationFieldEdit = () => (
    <MultiSelect
      items={items}
      selectedItems={value?.values} //selectedItems}
      onChange={onChange}
      // TODO
      //placeholder={i18n.t("global.selectLocations")}
    />
  );
  */

  const LocationFieldView = () => {
    return value?.values?.map((location) => {
      const name = location?.name || location?.label;
      let mapURL = isIOS
        ? `http://maps.apple.com/?q=${name}`
        : `https://www.google.com/maps/search/?api=1&query=${location?.name}`;
      if (location?.lat && location?.lng) {
        mapURL = isIOS
          ? `http://maps.apple.com/?ll=${location?.lat},${location?.lng}`
          : `https://www.google.com/maps/search/?api=1&query=${location?.lat},${location?.lng}`;
      }
      return (
        <Pressable
          onPress={() => Linking.openURL(mapURL)}
        >
          <Text
            style={[
              styles.linkingText,
              isRTL ? { textAlign: "left", flex: 1 } : {},
            ]}
          >
            {name}
          </Text>
        </Pressable>
      );
    });
  };

  return null;
  if (!value) return null;
  if (editing) return <LocationFieldEdit />;
  return <LocationFieldView />;
};
export default LocationField;
