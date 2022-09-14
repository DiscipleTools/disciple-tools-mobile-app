import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

import Select from "components/Select";
import PostChip from "components/Post/PostChip";
import SheetHeader from "components/Sheet/SheetHeader";
import ConnectionSheet from "./ConnectionSheet";

import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import {
  groupCircleIcon,
  groupDottedCircleIcon,
  baptizeIcon,
} from "constants/icons";

import { ScreenConstants, TabScreenConstants, TypeConstants } from "constants";

import { localStyles } from "./ConnectionField.styles";

const ConnectionField = ({ editing, field, value, onChange }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const { expand } = useBottomSheet();
  const { isPost, getPostTypeByField } = useType();

  // VALUES
  const values = value?.values || [];

  const onRemove = (id) => {
    onChange({ values: [{ value: id, delete: true }] }, { autosave: true });
  };

  const renderItemEdit = (item) => (
    <PostChip
      id={item?.value}
      title={item?.name}
      type={getPostTypeByField(field)}
      onRemove={onRemove}
      color={item?.status.color}
    />
  );
  const renderItemView = (item) => (
    <PostChip
      id={item?.value}
      title={item?.name}
      type={getPostTypeByField(field)}
    />
  );
  const renderItemLinkless = (item) => (
    <PostChip id={item?.value} title={item?.name} onRemove={onRemove} />
  );

  const PostEdit = ({ linkless }) => {
    const route = useRoute();
    const type = getPostTypeByField(field);
    return (
      <Select
        onOpen={() => {
          expand({
            defaultIndex: 3,
            renderHeader: () => (
              <SheetHeader expandable dismissable title={field?.label || ""} />
            ),
            renderContent: () => (
              <ConnectionSheet
                id={route?.params?.id}
                type={type}
                values={values}
                onChange={onChange}
              />
            ),
          });
        }}
        items={values}
        renderItem={linkless ? renderItemLinkless : renderItemEdit}
        //style={style}
        //optionStyle={optionStyle}
      />
    );
  };

  const GroupView = () => {
    const navigation = useNavigation();
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

  const PostView = () => <Select items={values} renderItem={renderItemView} />;

  const ConnectionFieldEdit = () => {
    const postType = getPostTypeByField(field);
    if (postType === TypeConstants.PEOPLE_GROUP) return <PostEdit linkless />;
    if (isPost) return <PostEdit />;
    return null;
  };

  const ConnectionFieldView = () => {
    const postType = getPostTypeByField(field);
    if (postType === TypeConstants.GROUP) return <GroupView />;
    if (isPost) return <PostView />;
    return null;
  };

  if (editing) return <ConnectionFieldEdit />;
  return <ConnectionFieldView />;
};
export default ConnectionField;
