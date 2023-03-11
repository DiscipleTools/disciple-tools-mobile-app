import { useState } from "react";
import { Text, View } from "react-native";

import { DeleteIcon, DownloadIcon } from "components/Icon";
import ActionButton from "components/Button/ActionButton";
import DangerButton from "components/Button/DangerButton";

import useCache from "hooks/use-cache";
import useStyles from "hooks/use-styles";

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
          label={"Download Data"}
          loading={fetching}
          onPress={() => setFetching(true)}
          startIcon={<DownloadIcon style={styles.buttonIcon} />}
        />
      </View>
      <View style={styles.buttonDescriptionContainer}>
        <Text style={styles.buttonDescriptionText}>
          This action will trigger the app to fetch and storage all possible
          data (including all contacts, groups, their associated comments,
          locations, people groups, etc...). Depending on your team's usage,
          this may be several MBs of data and cause the app to run sluggishly.
          (By default, we download only favorites and their associated data. Any
          other data *accessed* while online is also storaged and available for
          offline use, unless deleted).
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <DangerButton
          label={"Clear Storage"}
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
          Warning! If you are OFFLINE and you clear storage, then you will not
          be able to access your data until you are back online and it is
          refreshed.
        </Text>
      </View>
    </View>
  );
};
export default StorageScreen;
