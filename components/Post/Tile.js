import React, { useState } from "react";
import { RefreshControl, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { UpdateRequiredIcon } from "components/Icon";
import Alert from "components/Alert";
import Field from "components/Field/Field";

import useI18N from "hooks/use-i18n";
import useStyles from "hooks/use-styles";

import { localStyles } from "./Tile.styles";

const Tile = ({ cacheKey, editing, idx, post, fields, mutate }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    if (mutate) mutate();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    return;
  };

  const Fields = () => {
    return fields?.map(([key, field], _idx) => (
      <View key={key}>
        {idx === 0 && _idx === 0 && post?.requires_update && (
          <Alert
            title={i18n.t("global.updateRequired")}
            subtitle={i18n.t("global.updateRequiredText")}
            icon={<UpdateRequiredIcon style={styles.icon} />}
          />
        )}
        <Field
          key={key}
          editing={editing}
          cacheKey={cacheKey}
          fieldKey={key}
          field={field}
          post={post}
          mutate={mutate}
        />
      </View>
    ));
  };

  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          // TODO
          //color={null}      // Android
          //tintColor={null}  //iOS
        />
      }
      extraScrollHeight={75}
      keyboardShouldPersistTaps="handled"
      style={globalStyles.surface}
      contentContainerStyle={[globalStyles.surface, globalStyles.screenGutter]}
    >
      <Fields />
    </KeyboardAwareScrollView>
  );
};
export default React.memo(Tile);
