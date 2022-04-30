import React from "react";

import Select from "components/Select";
import PostChip from "components/Post/PostChip";
import SheetHeader from "components/Sheet/SheetHeader";
import UsersSheet from "./UsersSheet";

import useBottomSheet from "hooks/use-bottom-sheet";

import { TypeConstants } from "constants";

const UserSelectField = ({ editing, field, value, onChange }) => {

  const { delayedClose, expand } = useBottomSheet();

  // SELECTED 
  const selectedLabel = value?.label ?? ''; 

  const onRemove = () => onChange(null, { autosave: true });

  const renderItemEdit = (item) => <PostChip id={item?.key} title={item?.label} type={TypeConstants.CONTACT} onRemove={onRemove} />;

  // EDIT MODE
  const UserSelectFieldEdit = () => {

    // MAP TO API
    const mapToAPI = (newItem) => newItem?.key;

    // ON CHANGE
    const _onChange = (selectedItem) => {
      const mappedValue = mapToAPI(selectedItem);
      if (JSON.stringify(mappedValue) !== JSON.stringify(value?.key)) {
        onChange(mappedValue,
          { autosave: true }
        );
      };
      delayedClose();
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

    return(
      <Select
        onOpen={() => {
          expand({
            defaultIndex: 3,
            renderHeader: () => (
              <SheetHeader
                expandable
                dismissable
                title={field?.label || ''}
              />
            ),
            renderContent: () => 
              <UsersSheet
                id={value?.key}
                values={[value]}
                onChange={_onChange}
              />
          });
        }}
        items={value ? [value] : null}
        renderItem={renderItemEdit}
      />
    );
  };

  // VIEW MODE
  // TODO
  const UserSelectFieldView = () => null;

  if (editing) return <UserSelectFieldEdit />;
  return <UserSelectFieldView />;
};
export default UserSelectField;