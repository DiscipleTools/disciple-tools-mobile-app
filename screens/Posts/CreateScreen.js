import React, { useLayoutEffect, useReducer, useState } from "react";
import { useSWRConfig } from "swr";

import OfflineBar from "components/OfflineBar";
import Tile from "components/Post/Tile";
import { HeaderRight } from "components/Header/Header";

import useAPI from "hooks/use-api";
import useI18N from "hooks/use-i18n";
import useSettings from "hooks/use-settings";
import useType from "hooks/use-type";

import { labelize } from "utils";

const CreateScreen = ({ navigation, route }) => {
  const { mutate } = useSWRConfig();
  const { i18n } = useI18N();
  const { isContact, postType } = useType();
  const { settings } = useSettings();
  const { createPost } = useAPI();

  useLayoutEffect(() => {
    const title = `${ labelize(postType) } - ${ i18n.t("global.addNew") }`;
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: `${postType}/new`,
      },
      {
        label: i18n.t("global.documentation"),
        url: `https://disciple.tools/user-docs/disciple-tools-mobile-app/how-to-use/add-new-screens/#${postType}-screen`,
      },
    ];
    navigation.setOptions({ 
      title,
      headerRight: (props) => <HeaderRight kebabItems={kebabItems} props />,
    });
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
        post={route?.params?.post ?? null}
        fields={fields}
        save={createPost}
        mutate={mutate}
      />
    </>
  );
};
export default CreateScreen;