import React from "react";
import { Pressable, View } from "react-native";

import { CaretIcon } from "components/Icon";
import SelectSheet from "components/Sheets/SelectSheet";
import SheetHeader from "components/Sheets/SheetHeader";
import PostLink from "components/Post/PostLink";

import useBottomSheet from "hooks/useBottomSheet";
import useStyles from "hooks/useStyles";
import useType from "hooks/useType";
import useUsers from "hooks/useUsers";

import { localStyles } from "./UserSelectField.styles";

const UserSelectField = ({ editing, field, value, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);
  const { expand, snapPoints } = useBottomSheet();
  const { postType } = useType();

  // ITEMS
  const { data: users } = useUsers();
  if (!users) return null;

  // SELECTED 
  const selectedLabel = value?.label ?? ''; 

  // EDIT MODE
  const UserSelectFieldEdit = () => {

    // MAP TO API
    const mapToAPI = (item) => {
      return item?.key;
    };

    // ON CHANGE
    const _onChange = (newValue) => {
      const mappedValue = mapToAPI(newValue);
      if (mappedValue !== value) {
        onChange(mappedValue, {
          autosave: true,
          automutate: true
        });
      };
    };

    // MAP ITEMS
    const mapItems = (users) => {
      if (!users) return [];
      return users.map(user => {
        return {
          key: user?.ID,
          label: `${ user?.name } (#${ user?.ID })`,
          selected: selectedLabel === user?.ID,
        };
      });
    };

    // SECTIONS 
    const sections = [{ data: mapItems(users) }];

    const title = field?.label;

    const userSelectContent = () => (
      <>
        <SheetHeader
          expandable
          dismissable
          title={title}
        />
        <SelectSheet
          required
          sections={sections}
          onChange={_onChange}
        />
      </>
    );

    const showSheet = () => expand({
      index: snapPoints.length-1,
      snapPoints,
      renderContent: () => userSelectContent,
    });

    return(
      <Pressable onPress={() => showSheet()}>
        <View style={[
            globalStyles.rowContainer,
            styles.container
        ]}>
          <PostLink id={value?.key ?? 0} title={selectedLabel} type={postType} />
          <CaretIcon />
        </View>
      </Pressable>
    );
  };

  // VIEW MODE
  const UserSelectFieldView = () => {
    const user = users?.find(existingUser => value?.key && (existingUser?.ID === value.key || existingUser?.contact_id === value.key));
    const id = !user ? null : user?.contact_id ?? null;
    const title = !user ? value.label : user?.name ?? null;
    return <PostLink id={id} title={title} type={"contacts"} />;
  };

  if (editing) return <UserSelectFieldEdit />;
  return <UserSelectFieldView />;
};
export default UserSelectField;