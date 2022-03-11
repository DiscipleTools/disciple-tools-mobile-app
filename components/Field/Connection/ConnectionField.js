import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
//import { Col, Row, Grid } from "react-native-easy-grid";
//import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

import Select from "components/Select";
import PostLink from "components/Post/PostLink";
import ConnectionSheet from "./ConnectionSheet";
import UsersContactsSheet from "./UsersContactsSheet";
import GroupsSheet from "./GroupsSheet";
import PeopleGroupsSheet from "./PeopleGroupsSheet";
import TrainingsSheet from "./TrainingsSheet";

import useBottomSheet from "hooks/use-bottom-sheet";
//import useStyles from "hooks/use-styles";
import useType from "hooks/use-type";

import {
  groupCircleIcon,
  groupDottedCircleIcon,
  groupChildIcon,
  groupParentIcon,
  groupPeerIcon,
  groupTypeIcon,
  swimmingPoolIcon,
} from "constants/icons";

import { FieldNames, TypeConstants } from "constants";

//import { localStyles } from "./ConnectionField.styles";

const ConnectionField = ({ editing, field, value, onChange }) => {

  //const { styles, globalStyles } = useStyles(localStyles);
  const { expand, snapPoints } = useBottomSheet();
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
          index: snapPoints.length-1,
          renderContent: () => 
            <PeopleGroupsSheet
              title={field?.label || ''}
              values={values}
              onChange={onChange}
            />
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
            index: snapPoints.length-1,
            renderContent: () => 
              <ConnectionSheet
                id={route?.params?.id}
                fieldName={field?.name}
                title={field?.label || ''}
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
            index: snapPoints.length-1,
            renderContent: () => 
              <UsersContactsSheet
                id={route?.params?.id}
                title={field?.label || ''}
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
            index: snapPoints.length-1,
            renderContent: () => 
              <GroupsSheet
                id={route?.params?.id}
                title={field?.label || ''}
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
            index: snapPoints.length-1,
            renderContent: () => 
              <TrainingsSheet
                id={route?.params?.id}
                title={field?.label || ''}
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

  const PeopleGroupView = () => (
    <Select
      items={values}
      renderItem={renderItemView}
    />
  );

  const GroupView = () => {
    return(
      <Select
        items={values}
        renderItem={renderItemView}
      />
    );
    /*
    const navigation = useNavigation();
    let iconSource = groupParentIcon;
    const groupFieldLabel = String(field.label);
    if (groupFieldLabel.toLowerCase().includes("peer"))
      iconSource = groupPeerIcon;
    if (groupFieldLabel.toLowerCase().includes("child"))
      iconSource = groupChildIcon;
    return (
      <Grid>
        <Row style={styles.formRow}>
          <Col style={styles.formIconLabel}>
            <View style={styles.formIconLabelView}>
              <Image source={iconSource} style={styles.groupIcons} />
            </View>
          </Col>
          <Col style={styles.formIconLabel}>
            <Text style={styles.formLabel}>{field.label}</Text>
          </Col>
          <Col />
        </Row>
        <Row
          style={[
            styles.groupCircleParentContainer,
            { overflowX: "auto", marginBottom: 10 },
          ]}
        >
          <ScrollView horizontal>
            {selectedItems.map((group, index) => {
              const id = group?.value;
              const title = group?.name;
              // TODO: constant?
              const type = "groups";
              return (
                <Col
                  key={index.toString()}
                  style={styles.groupCircleContainer}
                  onPress={() => {
                    navigation.push("Details", {
                      id,
                      name: title,
                      type,
                      //onGoBack: () => onRefresh(),
                    });
                  }}
                >
                  {Object.prototype.hasOwnProperty.call(group, "is_church") &&
                  group.is_church ? (
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
                    source={swimmingPoolIcon}
                    style={styles.groupCenterIcon}
                  />
                  <Row style={styles.groupCircleName}>
                    <Text style={styles.groupCircleNameText}>{group.name}</Text>
                  </Row>
                  <Row style={styles.groupCircleCounter}>
                    <Text>{group.baptized_member_count}</Text>
                  </Row>
                  <Row style={[styles.groupCircleCounter, { marginTop: "5%" }]}>
                    <Text>{group.member_count}</Text>
                  </Row>
                </Col>
              );
            })}
          </ScrollView>
        </Row>
        <View style={styles.formDivider} />
      </Grid>
    );
    */
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
    field?.name === FieldNames.GROUPS
  );

  const isContactField = () => (
    field?.name === FieldNames.COACHES
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
    if (isPost) return <PostView />;
    return null; 
  };

  if (editing) return <ConnectionFieldEdit />;
  return <ConnectionFieldView />;
};
export default ConnectionField;
