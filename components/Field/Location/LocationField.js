import React from "react";
import { Linking, View } from "react-native";

import { ClearIcon, MapIcon } from "components/Icon";
import Chip from "components/Chip";
import Select from "components/Select";
import LocationsSheet from "./LocationsSheet";

import useBottomSheet from "hooks/useBottomSheet";
import useDevice from "hooks/useDevice";
import useStyles from "hooks/useStyles";

import { localStyles } from "./LocationField.styles";

const LocationField = ({ editing, field, value, onChange }) => {

  const { styles } = useStyles(localStyles);
  const { expand, snapPoints } = useBottomSheet();
  const { isIOS } = useDevice();

  // SELECTED VALUES
  const values = value?.values || [];

  const onRemove = (id) => {
    onChange(
      { values: [{ value: id, delete: true }]},
      { autosave: true }
    );
  };

  const renderItemMapLink = (item) => {
    const name = item?.name || item?.label;
    let mapURL = isIOS
      ? `http://maps.apple.com/?q=${name}`
      : `https://www.google.com/maps/search/?api=1&query=${item?.name}`;
    if (item?.lat && item?.lng) {
      mapURL = isIOS
        ? `http://maps.apple.com/?ll=${item?.lat},${item?.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${item?.lat},${item?.lng}`;
    };
    return(
      <Chip
        label={name}
        onPress={() => Linking.openURL(mapURL)}
        //startIcon={<MapIcon style={styles.startIcon} />}
        endIcon={onRemove ? (
          <View style={styles.clearIconContainer(false)}>
            <ClearIcon
              onPress={() => onRemove(item?.grid_id)}
              style={styles.clearIcon}
            />
          </View>
        ) : null }
        //style={styles?.container}
      />
    );
  };

  const LocationFieldEdit = () => (
    <Select
      onOpen={() => {
        expand({
          index: snapPoints.length-1,
          renderContent: () => 
            <LocationsSheet
              id={value?.key}
              title={field?.label || ''}
              values={value}
              onChange={onChange}
            />
        });
      }}
      items={values}
      renderItem={renderItemMapLink}
    />
  );

  const LocationFieldView = () => null;

  if (editing) return <LocationFieldEdit />;
  return <LocationFieldView />;
};
export default LocationField;