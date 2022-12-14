import React, { useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import { LeaderIcon } from "components/Icon";
import Select from "components/Select";
import PostChip from "components/Post/PostChip";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import ConnectionSheet from "./ConnectionSheet";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useId from "hooks/use-id";
import useStyles from "hooks/use-styles";

import {
  groupCircleIcon,
  groupDottedCircleIcon,
  baptizeIcon,
} from "constants/icons";

import { ScreenConstants, TabScreenConstants, TypeConstants } from "constants";

import { localStyles } from "./ConnectionField.styles";
import { FieldNames } from "constants";

// eg, {"coaches":{"values":[{"value":"101"}]}}
const mapToAPI = ({ fieldKey, newValue }) => {
  return { [fieldKey]: { values: [{ value: newValue?.ID }]}};
};

const mapToComponentRemove = ({ existingItems, id }) => existingItems.filter(item => item.ID !== id);

// eg, {"coaches":{"values":[{"value":"101"}]}}
const mapToAPIRemove = ({ key, id }) => {
  return { [key]: { values: [{ value: id, delete: true }] }};
};

const renderItemView = (item) => (
  <PostChip
    id={item?.ID}
    title={item?.post_title}
    //type={item?.post_type}
    type={null}
  />
);

// TODO: improve
const GroupView = ({ values }) => {
  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  return (
    <View style={globalStyles.rowContainer}>
      <ScrollView horizontal>
        {values?.map((group, index) => {
          const id = group?.value;
          const title = group?.name;
          const isChurch = group?.is_church;
          const baptizedMemberCount =
            group?.baptized_member_count?.length > 0
              ? group.baptized_member_count
              : "0";
          const memberCount =
            group?.member_count?.length > 0 ? group.member_count : "0";
          // TODO: constant?
          const type = "groups";
          return (
            <Pressable
              key={index.toString()}
              style={[
                globalStyles.columnContainer,
                styles.groupCircleContainer,
              ]}
              onPress={() => {
                navigation.jumpTo(TabScreenConstants.GROUPS, {
                  screen: ScreenConstants.DETAILS,
                  id,
                  name: title,
                  type,
                  //onGoBack: () => onRefresh(),
                });
              }}
            >
              {isChurch ? (
                <Image source={groupCircleIcon} style={styles.groupCircle} />
              ) : (
                <Image
                  source={groupDottedCircleIcon}
                  style={styles.groupCircle}
                />
              )}
              <Image source={baptizeIcon} style={styles.groupCenterIcon} />
              <View
                style={[globalStyles.rowContainer, styles.groupCircleName]}
              >
                <Text style={styles.groupCircleNameText}>{group.name}</Text>
              </View>
              <View
                style={[globalStyles.rowContainer, styles.groupCircleCounter]}
              >
                <Text>{baptizedMemberCount}</Text>
              </View>
              <View
                style={[globalStyles.rowContainer, styles.groupCircleCounter]}
              >
                <Text>{memberCount}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const PostView = ({ values }) => <Select items={values} renderItem={renderItemView} />;

const ConnectionFieldView = ({ field, values }) => {
  const postType = field?.post_type;
  const isPost = field?.post_type ? true : false;
  if (postType === TypeConstants.GROUP) return <GroupView values={values} />;
  if (isPost) return <PostView value={values} />;
  return null;
};

const ConnectionFieldEdit = ({
  post,
  cacheKey,
  fieldKey,
  field,
  values,
  setValues,
  onChange
}) => {

  const postId = useId();
  const { cache, mutate } = useCache();
  const { updatePost } = useAPI();

  const _onRemove = async({ id }) => {
    // component state
    const componentData = mapToComponentRemove({ existingItems: values, id });
    setValues(componentData);
    // grouped/form state (if applicable)
    /*
    if (onChange) {
      onChange(newValue);
      return;
    };
    */
    // in-memory cache (and persisted storage) state
    const cachedData = cache.get(cacheKey);
    const cachedDataModified = cachedData?.[fieldKey]?.filter(item => item?.ID !== id.toString());
    if (!cachedDataModified) return; 
    cachedData[fieldKey] = cachedDataModified;
    mutate(cacheKey, async() => (cachedData), { revalidate: false });
    // remote API state
    const data = mapToAPIRemove({ key: fieldKey, id });
    await updatePost({ data });
  };

  const _onChange = async(newValue) => {
    // TODO:
    const exists = values?.find(existingItem => existingItem?.ID === newValue?.ID);
    if (exists) {
      _onRemove(newValue);
      return;
    };
    // component state
    setValues(values ? [...values, newValue] : [newValue]);
    // grouped/form state (if applicable)
    /*
    if (onChange) {
      onChange(newValue);
      return;
    };
    */
    // in-memory cache (and persisted storage) state
    const cachedData = cache.get(cacheKey);
    cachedData[fieldKey] = cachedData?.[fieldKey] ? [...cachedData[fieldKey], newValue] : [newValue];
    mutate(cacheKey, async() => (cachedData), { revalidate: false });
    // remote API state
    const data = mapToAPI({ fieldKey, newValue });
    await updatePost({ data });
  };

  const renderItemEdit = (item) => {
    const leaderIds = post?.leaders?.map(leader => leader?.ID);
    const icon = (fieldKey === FieldNames.MEMBERS && leaderIds?.includes(item?.ID)) ? <LeaderIcon /> : null; 
    return(
      <PostChip
        id={item?.ID}
        title={item?.post_title}
        icon={icon}
        type={item?.post_type}
        onRemove={() => _onRemove({ id: item?.ID })}
      />
    );
  };

  const renderItemLinkless = (item) => (
    <PostChip
      id={item?.ID}
      title={item?.post_title}
      onRemove={() => _onRemove({ id: item?.ID })}
    />
  );

  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `${fieldKey}_modal`;
  const defaultIndex =  getDefaultIndex();

  const postType = field?.post_type;
  const fieldLabel = field?.name;
  const linkless = postType === TypeConstants.PEOPLE_GROUP;

  return (
    <>
      <Select
        onOpen={() => modalRef.current?.present()} 
        items={values}
        renderItem={linkless ? renderItemLinkless : renderItemEdit}
        //style={style}
        //optionStyle={optionStyle}
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={fieldLabel}
        defaultIndex={defaultIndex}
      >
        <ConnectionSheet
          id={postId}
          type={postType}
          values={values}
          onChange={_onChange}
          modalName={modalName}
        />
      </ModalSheet>
    </>
  );
};

const ConnectionField = ({
  editing,
  post,
  cacheKey,
  fieldKey,
  field,
  value,
  onChange
}) => {

  const [_values, _setValues] = useState(value);

  if (editing) return(
    <ConnectionFieldEdit
      post={post}
      cacheKey={cacheKey}
      fieldKey={fieldKey}
      field={field}
      values={_values}
      setValues={_setValues}
      onChange={onChange}
    />
  );
  return <ConnectionFieldView field={field} value={_values} />;
};
export default ConnectionField;