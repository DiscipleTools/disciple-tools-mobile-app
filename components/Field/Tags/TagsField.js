import React from "react";
import { Text, View } from "react-native";

import { ClearIcon } from "components/Icon";
import Chip from "components/Chip";
import Select from "components/Select";

//import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";

import { localStyles } from "./TagsField.styles";

const TagsField = ({ editing, field, value, onChange }) => {

  const { styles } = useStyles(localStyles);
  //const { expand, snapPoints } = useBottomSheet();

  // VALUES
  const values = value?.values || [];

  const onRemove = (value) => {
    onChange(
      { values: [{ value, delete: true }]},
      { autosave: true }
    );
  };

  const renderItem = (item) => (
    <Chip
      label={item?.value}
      endIcon={onRemove ? (
        <View style={styles.clearIconContainer(false)}>
          <ClearIcon
            onPress={() => onRemove(item?.value)}
            style={styles.clearIcon}
          />
        </View>
      ) : null }
    />
  );

  const TagsFieldEdit = () => (
    <Select
      /*
      onOpen={() => {
        expand({
          index: snapPoints.length-1,
          renderContent: () => 
            <TagsSheet
              id={value?.key}
              title={field?.label || ''}
              values={value}
              onChange={onChange}
            />
        });
      }}
      */
      items={values}
      renderItem={renderItem}
    />
  );

  const TagsFieldView = () => (
    <Text>
      { values.map(tag => tag?.value).join(", ") }
    </Text>
  );

  if (editing) return <TagsFieldEdit />;
  return <TagsFieldView />;
};
export default TagsField;