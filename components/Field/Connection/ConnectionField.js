import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

import Select from "components/Select";
import PostLink from "components/Post/PostLink";
import SheetHeader from "components/Sheet/SheetHeader";
import ConnectionSheet from "./ConnectionSheet";
import UsersContactsSheet from "./UsersContactsSheet";
import GroupsSheet from "./GroupsSheet";
import PeopleGroupsSheet from "./PeopleGroupsSheet";
import TrainingsSheet from "./TrainingsSheet";

import useBottomSheet from "hooks/use-bottom-sheet";
import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import {
  groupCircleIcon,
  groupDottedCircleIcon,
  baptiseIcon,
} from "constants/icons";

import { FieldNames, TabScreenConstants, ScreenConstants } from "constants";

import { localStyles } from "./ConnectionField.styles";

const ConnectionField = ({ editing, field, value, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { expand } = useBottomSheet();
  const { isPost, isContact, isGroup, getPostTypeByFieldName } = useType();

  // VALUES
  const values = value?.values || [];

  const onRemove = (id) => {
    onChange(
      { values: [{ value: id, delete: true }]},
      { autosave: true }
    );
  };

  const renderItemEdit = (item) => <PostLink id={item?.value} title={item?.name} type={getPostTypeByFieldName(field?.name)} onRemove={onRemove} />;
  const renderItemView = (item) => <PostLink id={item?.value} title={item?.name} type={getPostTypeByFieldName(field?.name)} />;
  const renderItemLinkless = (item) => <PostLink id={item?.value} title={item?.name} onRemove={onRemove} />;

  const PeopleGroupEdit = () => (
    <Select
      onOpen={() => {
        expand({
          renderHeader: () => (
            <SheetHeader
              expandable
              dismissable
              title={field?.label || ''}
            />
          ),
          renderContent: () => (
            <PeopleGroupsSheet
              values={values}
              onChange={onChange}
            />
          )
        });
      }}
      items={values}
      renderItem={renderItemLinkless}
    />
  );

  const PostEdit = () => {
    const route = useRoute();
    return(
      <Select
        onOpen={() => {
          expand({
            renderHeader: () => (
              <SheetHeader
                expandable
                dismissable
                title={field?.label || ''}
              />
            ),
            renderContent: () => 
              <ConnectionSheet
                id={route?.params?.id}
                fieldName={field?.name}
                values={values}
                onChange={onChange}
              />
          });
        }}
        items={values}
        renderItem={renderItemEdit}
        //style={style}
        //optionStyle={optionStyle}
      />
    );
  };

  const ContactEdit = () => {
    const route = useRoute();
    return(
      <Select
        onOpen={() => {
          expand({
            renderHeader: () => (
              <SheetHeader
                expandable
                dismissable
                title={field?.label || ''}
              />
            ),
            renderContent: () => 
              <UsersContactsSheet
                id={route?.params?.id}
                values={values}
                onChange={onChange}
              />
          });
        }}
        items={values}
        renderItem={renderItemEdit}
        //style={style}
        //optionStyle={optionStyle}
      />
    );
  };

  const GroupEdit = () => {
    const route = useRoute();
    return(
      <Select
        onOpen={() => {
          expand({
            renderHeader: () => (
              <SheetHeader
                expandable
                dismissable
                title={field?.label || ''}
              />
            ),
            renderContent: () => 
              <GroupsSheet
                id={route?.params?.id}
                values={values}
                onChange={onChange}
              />
          });
        }}
        items={values}
        renderItem={renderItemEdit}
        //style={style}
        //optionStyle={optionStyle}
      />
    );
  };

  const TrainingEdit = () => {
    const route = useRoute();
    return(
      <Select
        onOpen={() => {
          expand({
            renderHeader: () => (
              <SheetHeader
                expandable
                dismissable
                title={field?.label || ''}
              />
            ),
            renderContent: () => (
              <TrainingsSheet
                id={route?.params?.id}
                values={values}
                onChange={onChange}
              />
            )
          });
        }}
        items={values}
        renderItem={renderItemEdit}
        //style={style}
        //optionStyle={optionStyle}
      />
    );
  };

  const PeopleGroupView = () => (
    <Select
      items={values}
      renderItem={renderItemView}
    />
  );

  const GroupView = () => {
    const navigation = useNavigation();
    return (
      <View style={globalStyles.rowContainer}>
        <ScrollView horizontal>
          {values?.map((group, index) => {
            const id = group?.value;
            const title = group?.name;
            const isChurch = group?.is_church; 
            const baptizedMemberCount = group?.baptized_member_count?.length > 0 ? group.baptized_member_count : '0';
            const memberCount = group?.member_count?.length > 0 ? group.member_count : '0';
            // TODO: constant?
            const type = "groups";
            return (
              <Pressable
                key={index.toString()}
                style={[
                  globalStyles.columnContainer,
                  styles.groupCircleContainer
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
                { isChurch ? (
                  <Image
                    source={groupCircleIcon}
                    style={styles.groupCircle}
                  />
                ) : (
                  <Image
                    source={groupDottedCircleIcon}
                    style={styles.groupCircle}
                  />
                )}
                <Image
                  source={baptiseIcon}
                  style={styles.groupCenterIcon}
                />
                <View style={[globalStyles.rowContainer, styles.groupCircleName]}>
                  <Text style={styles.groupCircleNameText}>{group.name}</Text>
                </View>
                <View style={[globalStyles.rowContainer, styles.groupCircleCounter]}>
                  <Text>{baptizedMemberCount}</Text>
                </View>
                <View style={[globalStyles.rowContainer, styles.groupCircleCounter]}>
                  <Text>{memberCount}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const PostView = () => (
    <Select
      items={values}
      renderItem={renderItemView}
    />
  );

  const isPeopleGroupField = () => (
    field?.name === FieldNames.PEOPLE_GROUPS
  );

  const isGroupField = () => (
    field?.name === FieldNames.GROUPS ||
    field?.name === FieldNames.PARENT_GROUPS ||
    field?.name === FieldNames.PEER_GROUPS ||
    field?.name === FieldNames.CHILD_GROUPS
  );

  const isContactField = () => (
    field?.name === FieldNames.COACHES ||
    field?.name === FieldNames.MEMBERS
  );

  const isTrainingField = () => (
    field?.name === FieldNames.TRAININGS
  );

  const ConnectionFieldEdit = () => {
    if (isContactField()) return <ContactEdit />;
    if (isPeopleGroupField()) return <PeopleGroupEdit />;
    if (isGroupField()) return <GroupEdit />;
    if (isTrainingField()) return <TrainingEdit />;
    if (isContact) return <ContactEdit />;
    if (isGroup) return <GroupEdit />;
    if (isPost) return <PostEdit />;
    return null;
  };

  const ConnectionFieldView = () => {
    if (isPeopleGroupField()) return <PeopleGroupView />;
    if (isGroupField()) return <GroupView />;
    if (isPost) return <PostView />;
    return null; 
  };

  if (editing) return <ConnectionFieldEdit />;
  return <ConnectionFieldView />;
};
export default ConnectionField;
