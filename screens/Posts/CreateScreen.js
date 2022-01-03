import React from "react";

import OfflineBar from "components/OfflineBar";
import Tile from "components/Tile";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import useSettings from "hooks/useSettings";
import useAPI from "hooks/useAPI";

import { styles } from "./CreateScreen.styles";

const CreateScreen = ({ navigation }) => {

  const isConnected = useNetworkStatus();
  const { i18n, isRTL } = useI18N();
  const { settings } = useSettings();
  const { createPost } = useAPI();

  const CreatePost = () => {
    if (!settings?.tiles) return null;
    const fields = [];
    settings.tiles.forEach((tile) => {
      let creationFieldsByTile = tile?.fields?.filter(
        (field) => field?.in_create_form === true
      );
      if (creationFieldsByTile.length > 0) {
        fields.push(...creationFieldsByTile);
      }
    });
    return null;
    return (
      <Tile
        //post={post}
        fields={fields}
        save={createPost}
        //mutate={mutate}
      />
    );
  };

  return (
    <>
      {!isConnected && <OfflineBar />}
      <CreatePost />
    </>
  );
};
export default CreateScreen;