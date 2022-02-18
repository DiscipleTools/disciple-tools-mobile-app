import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
// TODO: remove
import { Col, Row, Grid } from "react-native-easy-grid";
import { useNavigation } from "@react-navigation/native";

import { CaretIcon } from "components/Icon";
import SelectSheet from "components/Sheets/SelectSheet";
import SheetHeader from "components/Sheets/SheetHeader";
import PostLink from "components/Post/PostLink";

import useBottomSheet from "hooks/useBottomSheet";
import useStyles from "hooks/useStyles";
import useType from "hooks/useType";
import useUsersContacts from "hooks/useUsersContacts";
import useList from "hooks/useList";
import usePeopleGroups from "hooks/usePeopleGroups";

import {
  groupCircleIcon,
  groupDottedCircleIcon,
  groupChildIcon,
  groupParentIcon,
  groupPeerIcon,
  groupTypeIcon,
  swimmingPoolIcon,
} from "constants/icons";

import { FieldNames } from "constants";

import { localStyles } from "./ConnectionField.styles";

const ConnectionField = ({ editing, field, value, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { expand, snapPoints } = useBottomSheet();
  const { isPost, isContact, isGroup, getPostTypeByFieldName } = useType();

  // VALUES
  const values = value?.values || [];

  const PeopleGroupEdit = () => {
    return null;
    // TODO: 
    const { peopleGroups } = usePeopleGroups();
    if (!peopleGroups) return null;
    return (
      <Select
        multiple
        items={peopleGroups ?? []}
        selectedItems={selectedItems}
        onChange={() => onChange}
        customAdd={() => addConnection}
        placeholder={""}
      />
    );
  };

  const PostEdit = () => {

    // TODO: implement support
    const [search, setSearch] = useState(null);

    // ITEMS
    const items = useUsersContacts({ search });
    if (!items) return null;

    // MAP TO API
    const mapToAPI = (sections) => {
      const values = [];
      sections.forEach((section) => {
        section?.data?.forEach(item => {
          if (item?.selected) {
            values.push({
              ID: item?.key,
              name: item?.label,
              value: item?.contactId //item?.key,
            });
          };
        });
      });
      return values;
    };

    // MAP FROM API
    const mapFromAPI = (items) => {
      return items?.map(item => {
        //const key = item?.contact_id || item?.ID || item?.value;
        return {
          key: item?.ID,
          label: item?.name,
          avatar: item?.avatar,
          contactId: item?.contact_id ? new String(item?.contact_id) : null,
          selected: values?.some(selectedItem => Number(selectedItem?.value) === item?.contact_id),
        };
      });
    };

    /*
     * NOTE: Since this is a multi-select, this method gets called when
     * the user clicks the "Done" button, and all 'sections' are passed
     * back (along with 'selected' property values).
     */
    const _onChange = async(newSections) => {
      const mappedValues = mapToAPI(newSections);
      if (JSON.stringify(mappedValues) !== JSON.stringify(values)) {
        onChange(
          { values: mappedValues },
          { autosave: true, force: true }
        );
      };
    };

    const _onRemove = (id) => {
      onChange(
        { values: [{ value: id, delete: true }]},
        { autosave: true }
      );
    };

    // SELECT OPTIONS
    const sections = useMemo(() => [{ data: mapFromAPI(items) }], [items, values]);
    const title = field?.label || '';

    const connectionContent = useMemo(() => (
      <>
        <SheetHeader
          expandable
          dismissable
          title={title}
        />
        <SelectSheet
          multiple
          sections={sections}
          onChange={_onChange}
        />
      </>
    ), [title, sections]);

    const showSheet = () => expand({
      index: snapPoints.length-1,
      snapPoints,
      renderContent: () => connectionContent,
    });

    return(
      <Pressable onPress={() => showSheet()}>
        <View style={[
          globalStyles.rowContainer,
          styles.container
        ]}>
          <View style={[
            globalStyles.rowContainer,
            styles.optionContainer
          ]}>
            {values?.map(value => (
              <PostLink id={value?.value} title={value?.name} type={getPostTypeByFieldName(field?.name)} onRemove={_onRemove} />
            ))}
          </View>
          <CaretIcon />
        </View>
      </Pressable>
    );
    return(
      <Pressable onPress={() => showSheet()}>
        <View style={[
          globalStyles.rowContainer,
          styles.container
        ]}>
          {values?.map(value => (
            <PostLink id={value?.value} title={value?.name} type={getPostTypeByFieldName(field?.name)} />
          ))}
          <CaretIcon />
        </View>
      </Pressable>
    );
  };

  const PeopleGroupView = () => {
    return null;
    // TODO
    return selectedItems.map((connection, idx) => (
        <PostLink
          key={connection?.ID ?? idx}
          id={connection?.ID}
          title={connection?.name}
          // TODO: useType inside of PostLink
          //type={"people_groups"}
        />
    ));
  };

  const GroupView = () => {
    return null;
    // TODO
    const navigation = useNavigation();
    //const { posts: contacts } = useList(null, 'contacts');
    //const { posts: groups } = useList(null, 'groups');
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
  };

  const PostView = () => {
    return values?.map(value => (
      <PostLink id={value?.value} title={value?.name} type={getPostTypeByFieldName(field?.name)} />
    ));
  };

  const ConnectionFieldEdit = () => {
    if (field?.name === FieldNames.PEOPLE_GROUPS) return <PeopleGroupEdit />;
    if (isPost) return <PostEdit />;
    return null; 
  };

  const ConnectionFieldView = () => {
    if (field?.name === FieldNames.PEOPLE_GROUPS) return <PeopleGroupView />;
    if (isGroup) return <GroupView />;
    if (isPost) return <PostView />;
    return null; 
  };

  if (editing) return <ConnectionFieldEdit />;
  return <ConnectionFieldView />;
};
export default ConnectionField;
