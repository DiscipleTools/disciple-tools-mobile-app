import React, { useMemo, useState }  from "react";
import { Text, View } from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';

import { ClearIcon, EditIcon } from "components/Icon";

import useI18N from "hooks/useI18N";
import useStyles from "hooks/useStyles";

import { FieldNames } from "constants";

import { localStyles } from "./DateField.styles"

/*
 * https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#date
 */
const DateField = ({ editing, field, value, onChange }) => {

  const { locale } = useI18N();
  const { styles, globalStyles } = useStyles(localStyles);

  const [_editing, _setEditing] = useState(editing);

  // TODO: shared?
  const adjustForTimezone = (date) => {
    const timeOffsetInMS = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + timeOffsetInMS);
    return date;
  }

  /*
   * NOTE: API sends us a UTC in Number format as seconds from epoch
   * (ie, 1643760000 vs. 1643760000000 (ms since epoch))
   */
  // MAP VALUE FROM API
  const mapFromAPI = (value) => {
    if (!value) return null;
    return adjustForTimezone(new Date(parseInt(value)*1000));
  };
  const mappedValue = useMemo(() => mapFromAPI(value), [value]);

  // MAP VALUE TO API
  const mapToAPI = (value) => Math.floor(value.valueOf()/1000); 
  // see: _onChange

  const DateFieldEdit = () => {

    // ON CHANGE
    const _onChange = (event, newValue) => {
      if (newValue !== mappedValue) {
        const apiValue = mapToAPI(newValue);
        onChange(apiValue, {
          autosave: true,
        });
      };
    };

    const getMaxDate = () => {
      const fieldName = field?.name;
      if (fieldName === FieldNames.BAPTISM_DATE) return new Date();
      return null;
    };

    const maximumDate = getMaxDate();

    return (
      <View style={globalStyles.rowContainer}>
      <DateTimePicker
        value={mappedValue ?? new Date()}
        mode={"date"}
        maximumDate={maximumDate}
        display="default"
        locale={locale?.replace("_", "-")}
        onChange={_onChange}
        style={styles.picker}
      />
      { _editing && (
        <ClearIcon onPress={() => _setEditing(false)} />
      )}
      </View>
    );
  };

  const DateFieldView = () => {
    const formatDateView = (date) => {
      const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      };
      const locale_p = locale?.replace('_','-');
      // NOTE: Intl is not supported in Android
      //return new Intl.DateTimeFormat(locale_p, options).format(date);
      return date.toLocaleDateString(locale_p, options);
    };
    const dateValue = mappedValue ? formatDateView(mappedValue) : '';
    return (
      <View style={globalStyles.postDetailsContainer}>
        <Text>{dateValue}</Text>
        { !_editing && (
          <EditIcon onPress={() => _setEditing(true)} />
        )}
      </View>
    );
  };

  if (_editing) return <DateFieldEdit />;
  return <DateFieldView />;
};
export default DateField;