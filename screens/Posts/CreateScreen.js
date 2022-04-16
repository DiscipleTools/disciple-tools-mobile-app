import React, { useLayoutEffect, useReducer, useState } from "react";
import { useSWRConfig } from "swr";

import OfflineBar from "components/OfflineBar";
import Tile from "components/Post/Tile";

import useAPI from "hooks/use-api";
import useI18N from "hooks/use-i18n";
import useSettings from "hooks/use-settings";
import useType from "hooks/use-type";

const CreateScreen = ({ navigation }) => {
  const { mutate } = useSWRConfig();
  const { i18n } = useI18N();
  const { isContact } = useType();
  const { settings } = useSettings();
  const { createPost } = useAPI();

  useLayoutEffect(() => {
    const title = i18n.t("global.addNew");
    navigation.setOptions({ title });
  });

  let fields = [];
  if (!settings?.tiles) return null;
  settings.tiles.forEach((tile) => {
    let creationFieldsByTile = tile?.fields?.filter(
      (field) => field?.in_create_form === true
    );
    if (creationFieldsByTile.length > 0) {
      fields.push(...creationFieldsByTile);
    }
  });
  if (isContact) {
    fields = [
      {
        label: i18n.t("global.contactType"),
        name: "type",
        type: "key_select",
        default: {
          access: {
            label: i18n.t("global.standard"),
          },
          personal: {
            label: i18n.t("global.private"),
          },
        },
      },
      ...fields,
    ];
  };

  return (
    <>
      <OfflineBar />
      <Tile
        isCreate
        grouped
        fields={fields}
        save={createPost}
        mutate={mutate}
      />
    </>
  );
};
export default CreateScreen;