import React from "react";
import { Linking, Text, View } from "react-native";

import { ClearIcon, MapIcon } from "components/Icon";
import Chip from "components/Chip";
import Select from "components/Select";
import LocationsSheet from "./LocationsSheet";

import useBottomSheet from "hooks/use-bottom-sheet";
import useDevice from "hooks/use-device";
import useStyles from "hooks/use-styles";

import { localStyles } from "./LocationField.styles";

const LocationField = ({ grouped, editing, field, value, onChange }) => {
  const { styles } = useStyles(localStyles);
  const { expand, snapPoints } = useBottomSheet();
  const { isIOS } = useDevice();

  // SELECTED VALUES
  const values = value?.values || [];

  // TODO: enable remove
  /*
   * NOTE: currently we get Locations list from the D.T Mobile App plugin:
   * wp-json/dt-mobile-app/v1/locations
   * but this endpoint only provides 'grid_id' and not also 'grid_meta_id'
   * and 'grid_meta_id' is required to remove a value from the field
   * eg, { location_grid_meta: { "values": [ { "grid_meta_id": 98, "delete": true } ] } }
   */
  const onRemove = (id) => {
    onChange(
      { values: [{ grid_meta_id: Number(id), delete: true }] },
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
    }
    return (
      <Chip
        label={name}
        onPress={() => Linking.openURL(mapURL)}
        startIcon={<MapIcon style={styles.startIcon} />}
        /*
         * NOTE: see note from 'onRemove' above
        endIcon={onRemove ? (
          <View style={styles.clearIconContainer(false)}>
            <ClearIcon
              onPress={() => onRemove(item?.grid_id)}
              style={styles.clearIcon}
            />
          </View>
        ) : null }
        */
        //style={styles?.container}
      />
    );
  };

  const LocationFieldEdit = () => (
    <Select
      onOpen={() => {
        expand({
          defaultIndex: 3,
          renderContent: () => (
            <LocationsSheet
              id={value?.key}
              title={field?.label || ""}
              grouped={grouped}
              values={value}
              onChange={onChange}
            />
          ),
        });
      }}
      items={values}
      renderItem={renderItemMapLink}
    />
  );

  const LocationFieldView = () => (
    <Text>{values.map((tag) => tag?.value).join(", ")}</Text>
  );

  if (editing) return <LocationFieldEdit />;
  return <LocationFieldView />;
};
export default LocationField;
