import React from "react";
import { Text, View, useWindowDimensions } from "react-native";

import { ArrowIcon } from "components/Icon";
import Card from "components/Card/Card";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { localStyles } from "./MetricCard.styles";

const MetricCard = ({ title, value, onPress }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { numberFormat } = useI18N();
  const layout = useWindowDimensions();
  const windowWidth = layout.width;
  const offset = 40;
  return (
    <Card
      center
      title={title}
      body={
        <View
          style={[styles.bodyContainer, { width: windowWidth / 2 - offset }]}
        >
          <View style={[globalStyles.rowContainer, styles.rowContainer]}>
            <Text style={[globalStyles.buttonText, styles.buttonText]}>
              {value ? numberFormat(value) : "-"}
            </Text>
            {onPress && (
              <ArrowIcon onPress={onPress} style={styles.buttonContainer} />
            )}
          </View>
        </View>
      }
    />
  );
};
export default MetricCard;
