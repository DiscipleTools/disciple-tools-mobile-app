import { useState } from "react";
import { Text, View } from "react-native";

import { DeleteIcon, DownloadIcon } from "components/Icon";
import ActionButton from "components/Button/ActionButton";
import DangerButton from "components/Button/DangerButton";

import useCache from "hooks/use-cache";
import useStyles from "hooks/use-styles";
import useI18N from "hooks/use-i18n";

import { downloadAllData, memorySizeOf, persistCache } from "helpers";

import { localStyles } from "./StorageScreen.styles";

const FetchData = ({ setFetching }) => {
  setTimeout(() => setFetching(false), 20000); // timeout after 20 seconds
  (async () => {
    await downloadAllData();
    await persistCache();
    setFetching(false);
  })();
  return null;
};

// TODO: translate
const StorageScreen = () => {
  const { styles, globalStyles } = useStyles(localStyles);
  const [fetching, setFetching] = useState(false);
  const { cache, clearStorage } = useCache();
  const [cacheObj, setCacheObj] = useState(Object.fromEntries(cache));
  const sizeOfCache = memorySizeOf(cacheObj);
  return (
    <View style={globalStyles.screenContainer}>
      <View style={[styles.listItemContainer, { borderTopWidth: 0 }]}>
        <Text>
          Usage: <Text style={{ fontWeight: "bold" }}>{sizeOfCache}</Text>
        </Text>
      </View>
      {fetching && <FetchData setFetching={setFetching} />}
      <View style={styles.listItemContainer}>
        <ActionButton
          label={i18n.t("global.downloadData")}
          loading={fetching}
          onPress={() => setFetching(true)}
          startIcon={<DownloadIcon style={styles.buttonIcon} />}
        />
      </View>
      <View style={styles.buttonDescriptionContainer}>
        <Text style={styles.buttonDescriptionText}>
          {i18n.t("global.downloadDataNote")}
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <DangerButton
          label={i18n.t("global.clearStorage")}
          onPress={() => {
            clearStorage();
            cache.clear();
            setCacheObj({});
          }}
          startIcon={<DeleteIcon style={styles.buttonIcon} />}
        />
      </View>
      <View style={styles.buttonDescriptionContainer}>
        <Text style={styles.buttonDescriptionText}>
          {i18n.t("global.clearStorageNote")}
        </Text>
      </View>
    </View>
  );
};
export default StorageScreen;
