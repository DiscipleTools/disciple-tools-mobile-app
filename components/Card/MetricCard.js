import React from 'react';
import { Text, View, useWindowDimensions } from "react-native";
import { TabActions, useNavigation } from '@react-navigation/native';

import { ArrowIcon } from "components/Icon";
import Card from "components/Card/Card";

import useMetric from "hooks/use-metric";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import { ScreenConstants } from "constants";

import { localStyles } from './MetricCard.styles';

const MetricCard = ({ title, filter, type }) => {
  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { getTabScreenFromType } = useType();
  const metric = useMetric({ filter, type });
  const layout = useWindowDimensions();
  const windowWidth = layout.width;
  const offset = 40;
  return (
    <Card
      center
      title={title}
      body={(
        <View style={[
          styles.bodyContainer,
          { width: windowWidth/2-offset },
        ]}>
          <View style={[
            globalStyles.rowContainer,
            styles.rowContainer
          ]}>
            <Text style={[
              globalStyles.buttonText,
              styles.buttonText
            ]}>
              { metric ? metric : "-" }  
            </Text>
            { filter && (
              <ArrowIcon
                onPress={() => {
                  const tabScreen = getTabScreenFromType(type);
                  navigation.jumpTo(tabScreen, {
                    screen: ScreenConstants.LIST,
                    type,
                    filter: filter,
                  });
                }}
                style={styles.buttonContainer}
              />
            )}
          </View>
        </View>
      )}
    />
  );
};
export default MetricCard;