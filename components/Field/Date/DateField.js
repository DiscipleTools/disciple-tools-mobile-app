import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { CancelIcon, EditIcon } from "components/Icon";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useDevice from "hooks/use-device";
import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { FieldNames } from "constants";

import { localStyles } from "./DateField.styles";

const TimezoneConstants = Object.freeze({
  SECONDS: "seconds",
  MILLISECONDS: "milliseconds",
});

const getTimezoneOffset = ({ date, unit }) => {
  try {
    let timezoneOffset = date.getTimezoneOffset(); // in minutes
    switch (unit) {
      case TimezoneConstants.SECONDS:
        timezoneOffset *= 60;
        break;
      case TimezoneConstants.MILLISECONDS:
        timezoneOffset *= 60 * 1000;
        break;
      default:
        break;
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset#description
    return timezoneOffset * -1;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const adjustForTimezone = ({ date }) => {
  if (!date) return date;
  const timezoneOffsetInMS = getTimezoneOffset({
    date,
    unit: TimezoneConstants.MILLISECONDS,
  });
  date.setTime(date.getTime() + timezoneOffsetInMS);
  return date;
};

/*
 * NOTE: API sends us a UTC in Number format as seconds from epoch
 * (ie, 1643760000 vs. 1643760000000 (ms since epoch))
 */
const mapFromAPI = ({ value }) => {
  if (!value) return null;
  try {
    return new Date(parseInt(value) * 1000);
  } catch (error) {
    console.error(error);
    return null;
  }
};

//const mapToComponent = ({ newValue }) => Math.floor(newValue.valueOf());

const mapToCache = ({ newValue }) => {
  if (!newValue) return null;
  const formatted = newValue?.toISOString()?.split("T")[0] ?? null;
  return { formatted, timestamp: Math.floor(newValue.valueOf() / 1000) };
};

const mapToAPI = ({ fieldKey, newValue }) => {
  if (!newValue)
    return {
      [fieldKey]: "",
    };
  return {
    [fieldKey]: Math.floor(newValue.valueOf() / 1000),
  };
};

const formatDateView = ({ date, locale }) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  const locale_p = locale?.replace("_", "-");
  // NOTE: Intl is not supported in Android
  //return new Intl.DateTimeFormat(locale_p, options).format(date);
  return date.toLocaleDateString(locale_p, options);
};

const DateFieldView = ({ editing, setEditing, locale, value }) => {
  const { globalStyles } = useStyles(localStyles);
  const dateValue = value ? formatDateView({ date: value, locale }) : "";
  return (
    <View style={globalStyles.fieldContainer}>
      <Text>{dateValue}</Text>
      {!editing && <EditIcon onPress={() => setEditing(true)} />}
    </View>
  );
};

const DateFieldEdit = ({
  editing,
  setEditing,
  cacheKey,
  fieldKey,
  locale,
  value,
  setValue,
  onChange,
}) => {
  const { styles, globalStyles } = useStyles(localStyles);

  const { updatePost } = useAPI();

  const { cache, mutate } = useCache();

  const { isAndroid } = useDevice();

  const _onChange = async (evt, newValue) => {
    /*
    if (onChange) {
      onChange(newValue);
      return;
    };
    */
    if (isAndroid && evt.type === "neutralButtonPressed") {
      newValue = null;
    }
    // if Android, then we need to check the DateTimePicker event type
    if (
      (isAndroid &&
        (evt.type === "set" || evt.type === "neutralButtonPressed") &&
        value != newValue) ||
      (!isAndroid && value != newValue)
    ) {
      // in-memory cache (and persisted storage) state
      const cachedData = cache.get(cacheKey);
      const mappedCacheData = mapToCache({ fieldKey, newValue });
      cachedData[fieldKey] = mappedCacheData;
      mutate(cacheKey, () => cachedData, { revalidate: false });
      // component state
      setValue(newValue);
      // remote API state
      const data = mapToAPI({ fieldKey, newValue });
      await updatePost({ data });
    }
    setEditing(false);
  };

  const getMaxDate = () => {
    if (
      fieldKey === FieldNames.BAPTISM_DATE ||
      fieldKey === FieldNames.DATE_OF_BIRTH
    )
      return new Date();
    return null;
  };

  const maximumDate = getMaxDate();

  const dateValue = value ?? new Date();
  const timezoneOffsetInMinutes = getTimezoneOffset({ date: dateValue });

  return (
    <View style={globalStyles.rowContainer}>
      <DateTimePicker
        value={dateValue}
        timeZoneOffsetInMinutes={timezoneOffsetInMinutes}
        mode={"date"}
        maximumDate={maximumDate}
        display="default"
        locale={locale?.replace("_", "-")}
        onChange={_onChange}
        neutralButtonLabel="clear"
        style={styles.picker}
      />
      {editing && <CancelIcon onPress={() => setEditing(false)} />}
    </View>
  );
};

// https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#date
const DateField = ({ editing, cacheKey, fieldKey, value, onChange }) => {
  const { locale } = useI18N();
  const [_editing, _setEditing] = useState(editing);

  const mappedValue = useMemo(
    () => mapFromAPI({ value: value?.timestamp }),
    [value?.timestamp]
  );
  const [_value, _setValue] = useState(mappedValue);

  const adjustedValue = useMemo(
    () => adjustForTimezone({ date: _value }),
    [_value]
  );

  if (_editing)
    return (
      <DateFieldEdit
        editing={_editing}
        setEditing={_setEditing}
        cacheKey={cacheKey}
        fieldKey={fieldKey}
        locale={locale}
        value={adjustedValue}
        setValue={_setValue}
        onChange={onChange}
      />
    );
  return (
    <DateFieldView
      editing={_editing}
      setEditing={_setEditing}
      locale={locale}
      value={adjustedValue}
    />
  );
};
export default DateField;
