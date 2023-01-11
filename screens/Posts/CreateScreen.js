import React, { useLayoutEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { SaveIcon } from "components/Icon";
import OfflineBar from "components/OfflineBar";
import Button from "components/Button";
import Field from "components/Field/Field";
import { HeaderRight } from "components/Header/Header";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useI18N from "hooks/use-i18n";
import useNetwork from "hooks/use-network";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";
import useType from "hooks/use-type";

import { generateTmpId, getCurrentDate } from "helpers";
import { getListURL, getPostURL } from "helpers/urls";
import { labelize } from "utils";
import {
  FieldConstants,
  FieldNames,
  FieldTypes,
  ScreenConstants,
  TypeConstants,
} from "constants";

import { localStyles } from "./CreateScreen.styles";

const initialMapFieldsToPost = ({ fields, post, postType }) => {
  let initialPost = {};
  fields?.forEach(([key, _]) => {
    initialPost[key] = null;
  });
  // defaults
  if (postType === TypeConstants.CONTACT) {
    initialPost[FieldNames.TYPE] = { key: "personal" };
  }
  if (postType === TypeConstants.GROUP) {
    // TODO: this does not hold for OM
    initialPost[FieldNames.GROUP_TYPE] = { key: "pre-group" };
  }
  initialPost = { ...initialPost, ...post };
  return initialPost;
};

const filterEmptyFields = ({ post }) => {
  return Object.fromEntries(
    Object.entries(post).filter(([_, val]) => {
      if (Array.isArray(val)) {
        if (
          val.length === 1 && (
            (val[0]?.value === null || val[0]?.value === "") ||
            (val[0]?.key === null || val[0]?.key === "") ||
            (val[0]?.id === null || val[0]?.id === "")
          )
        ) {
          return false;
        }
      }
      if (val === null || val === "") return false;
      return true;
    })
  );
};

const validateFields = ({ fields, post, i18n, toast }) => {
  const requiredFields = fields?.filter(
    ([_, field]) => field?.required === true && field?.in_create_form === true
  );
  for (const [key, val] of requiredFields) {
    if (!post?.[key]) {
      toast(i18n.t("global.error.isRequired", { item: val?.name }), true);
      return false;
    }
  }
  return true;
};

const mapToAPI = ({ post }) => {
  const mappedPost = { ...post };
  for (const [key, val] of Object.entries(post)) {
    if (val?.key) {
      mappedPost[key] = val.key;
    };
    if (Array.isArray(val)) {
      mappedPost[key] = { values: val.map(item => ({ value: item?.key || item?.value || item?.id || "" })) };
    };
  };
  return mappedPost;
};

const mapToCache = ({ post, postType, postId }) => {
  const mappedPost = { ...post };
  mappedPost[FieldNames.ID] = postId;
  mappedPost[FieldNames.POST_TYPE] = postType;
  mappedPost[FieldNames.POST_TITLE] = post?.name ?? "";
  const currentDate = getCurrentDate();
  mappedPost[FieldNames.POST_DATE] = currentDate;
  mappedPost[FieldNames.LAST_MODIFIED] = currentDate;
  return mappedPost;
};

const CreateScreen = ({ navigation, route }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { isConnected } = useNetwork();
  const { isContact, postType } = useType();
  const { settings } = useSettings();
  const { cache } = useCache();
  const { createPost } = useAPI();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const title = `${labelize(postType)} - ${i18n.t("global.addNew")}`;
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
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          renderStartIcons={() => (
            <Pressable onPress={onSave}>
              <SaveIcon />
            </Pressable>
          )}
          props
        />
      ),
    });
  });

  const fields = settings?.post_types?.[postType]?.fields;
  if (!fields) return null;
  const fieldEntries = Object.entries(fields);
  const creationFields = fieldEntries?.filter(
    ([_, value]) => value?.in_create_form === true && value?.hidden !== true
  );
  if (isContact) {
    if (!creationFields?.find(([key, _]) => key === FieldNames.TYPE)) {
      creationFields.unshift([
        FieldNames.TYPE,
        {
          type: FieldTypes.KEY_SELECT,
          required: true,
          in_create_form: true,
          name: i18n.t("global.contactType"),
          default: {
            access: {
              label: i18n.t("global.standard"),
            },
            personal: {
              label: i18n.t("global.private"),
            },
          },
        },
      ]);
    }
    // TODO: populate values in SelectSheet
    /*
    if (!creationFields?.find(([key, _]) => key === FieldNames.SOURCES)) {
      creationFields.push([
        FieldNames.SOURCES,
        {
          type: "multi_select",
          in_create_form: true,
          name: i18n.t("global.sources"),
        }
      ])
    };
    */
    if (
      route?.params?.post?.[FieldNames.CONTACT_PHONE] &&
      !creationFields?.find(([key, _]) => key === FieldNames.CONTACT_PHONE)
    ) {
      creationFields.push([
        FieldNames.CONTACT_PHONE,
        {
          type: FieldTypes.COMMUNICATION_CHANNEL,
          in_create_form: true,
          name: fields?.[FieldNames.CONTACT_PHONE]?.name,
        },
      ]);
    }
    if (
      route?.params?.post?.[FieldNames.CONTACT_EMAIL] &&
      !creationFields?.find(([key, _]) => key === FieldNames.CONTACT_EMAIL)
    ) {
      creationFields.push([
        FieldNames.CONTACT_EMAIL,
        {
          type: FieldTypes.COMMUNICATION_CHANNEL,
          in_create_form: true,
          name: fields?.[FieldNames.CONTACT_EMAIL]?.name,
        },
      ]);
    }
  }

  const onChange = ({ key, value }) => {
    if (postRef?.current) {
      postRef.current[key] = value;
    }
    return;
  };

  // TODO: break this down into multiple, testable methods
  const onSave = async () => {
    if (!postRef?.current) return;
    setLoading(true);
    // filter out any empty fields
    const post = filterEmptyFields({ post: postRef.current });
    // validate form fields, and display any errors
    if (!validateFields({ fields: creationFields, post, i18n, toast })) {
      setLoading(false);
      return;
    }
    let postId = null;
    let cachePost = null;
    const tmpId = generateTmpId();
    if (!isConnected) {
      post[FieldNames.ID] = tmpId;
      post[FieldNames.OFFLINE] = true;
    };
    const apiPost = mapToAPI({ post });
    const res = await createPost({ data: apiPost });
    if (isConnected && res?.ID) {
      // use the ID returned from the API
      postId = res.ID;
      cachePost = { ...res };
    } else if (!isConnected) {
      // use a temporary ID while offline
      postId = tmpId;
      cachePost = mapToCache({ post, postType, postId });
    } else {
      // somethin went wrong, display error
      toast(i18n.t("global.error.tryAgain"), true);
      setLoading(false);
      return;
    }
    // update the new post cache
    const postURL = getPostURL({ postType, postId });
    cache.set(postURL, cachePost);
    // update the list cache
    const listURL = getListURL({ postType });
    const cachedList = cache.get(listURL);
    if (!cachedList?.posts) return;
    cachedList.posts.unshift(cachePost);
    cache.set(listURL, cachedList);
    // navigate to the new post
    const postName = post?.name ?? "";
    // delay to give time for cache to update
    setTimeout(() => {
      postRef.current = {};
      setLoading(false);
      navigation.navigate(ScreenConstants.DETAILS, {
        id: postId,
        type: postType,
        name: postName,
      });
    }, 1000);
    return;
  };

  const postRef = useRef(null);
  const initialPost = initialMapFieldsToPost({
    fields: creationFields,
    post: route?.params?.post,
    postType,
  });
  if (!postRef?.current) postRef.current = initialPost;

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={75}
      keyboardShouldPersistTaps="handled"
      style={globalStyles.surface}
      contentContainerStyle={[globalStyles.surface, globalStyles.screenGutter]}
    >
      <OfflineBar />
      {creationFields?.map(([key, field], _idx) => (
        <Field
          key={key}
          editing
          grouped={true}
          fieldKey={key}
          field={field}
          post={postRef.current}
          onChange={onChange}
        />
      ))}
      <View style={styles.saveButtonContainer}>
        <Button
          title={i18n.t("global.save")}
          loading={loading}
          onPress={onSave}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};
export default CreateScreen;
