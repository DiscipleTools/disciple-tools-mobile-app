import React from "react";
import { useSWRConfig } from 'swr'

import OfflineBar from "components/OfflineBar";
import Tile from "components/Post/Tile";

import useI18N from "hooks/useI18N";
import useType from "hooks/useType";
import useSettings from "hooks/useSettings";
import useAPI from "hooks/useAPI";

const CreateScreen = ({ navigation }) => {

  const { mutate } = useSWRConfig();
  const { i18n, isRTL } = useI18N();
  const { isContact } = useType();
  const { settings } = useSettings();
  const { createPost } = useAPI();

  const CreatePost = () => {
    if (!settings?.tiles) return null;
    let fields = [];
    settings.tiles.forEach((tile) => {
      let creationFieldsByTile = tile?.fields?.filter(
        (field) => field?.in_create_form === true
      );
      if (creationFieldsByTile.length > 0) {
        fields.push(...creationFieldsByTile);
      }
    });
    // TODO: translate
    if (isContact) {
      fields = [{
        label: "Contact Type",
        name: "type",
        type: "key_select",
        default: {
          access: {
            label: "Standard",
          },
          personal: {
            label: "Private",
          },
        }
      }, ...fields];
    };
    return (
      <Tile
        grouped
        fields={fields}
        save={createPost}
        mutate={mutate}
      />
    );
  };

  return (
    <>
      <OfflineBar />
      <CreatePost />
    </>
  );
};
export default CreateScreen;