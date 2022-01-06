import React from "react";

import OfflineBar from "components/OfflineBar";
import Tile from "components/Post/Tile";

import useI18N from "hooks/useI18N";
import useType from "hooks/useType";
import useSettings from "hooks/useSettings";
import useAPI from "hooks/useAPI";

const CreateScreen = ({ navigation }) => {

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
        name: "contact_type",
        type: "key_select",
        default: {
          personal: {
            label: "Personal",
          },
          access: {
            label: "Access",
          },
        }
      }, ...fields];
    };
    return (
      <Tile
        editOnly
        grouped
        //post={null}
        fields={fields}
        save={createPost}
        //mutate={mutate}
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