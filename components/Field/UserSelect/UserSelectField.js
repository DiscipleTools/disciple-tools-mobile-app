import React, { useRef, useState } from "react";

import Select from "components/Select";
import PostChip from "components/Post/PostChip";
import ModalSheet, { getDefaultIndex } from "components/Sheet/ModalSheet";
import UsersSheet from "./UsersSheet";

import useAPI from "hooks/use-api";
import useCache from "hooks/use-cache";
import useId from "hooks/use-id";

const mapToComponent = ({ newValue }) => {
  return {
    id: newValue?.ID,
    type: "user",
    display: newValue?.name
  };
};

const mapToCache = ({ newValue }) => {
  return {
    id: newValue?.ID,
    type: "user",
    display: newValue?.name
  };
};

const mapToAPI = ({ fieldKey, newValue }) => {
  const userIDValue = `user-${newValue?.ID}`; // eg, "user-3"
  return { [fieldKey]: userIDValue };
};

const renderItemView = (item) => (
  <PostChip key={item?.ID} id={item?.ID} title={item?.post_title} />
);

const UserSelectFieldView = ({ value }) => (
  <Select items={[value]} renderItem={renderItemView} />
);

const UserSelectFieldEdit = ({
  cacheKey,
  fieldKey,
  fieldLabel,
  onChange,
  value,
  setValue,
}) => {

  const postId = useId();
  const { cache, mutate } = useCache();
  const { updatePost } = useAPI();

  const _onChange = async(newValue) => {
    const componentData = mapToComponent({ newValue });
    if (value?.id !== componentData?.id) {
      // component state
      setValue(componentData);
      const data = mapToAPI({ fieldKey, newValue });
      // grouped/form state (if applicable)
      if (onChange) {
        onChange({ key: fieldKey, value: data?.[fieldKey] });
        return;
      };
      // in-memory cache (and persisted storage) state
      const cachedData = cache.get(cacheKey);
      const mappedCacheData = mapToCache({ newValue });
      cachedData[fieldKey] = mappedCacheData;
      mutate(cacheKey, () => (cachedData), { revalidate: false });
      // remote API state
      await updatePost({ data });
    };
  };

  const renderItemEdit = (item) => (
    <PostChip
      id={item?.id}
      title={item?.display}
      type={null} //item?.type}
    />
  );

  // MODAL SHEET
  const modalRef = useRef(null);
  const modalName = `${fieldKey}_modal`;
  const defaultIndex =  getDefaultIndex();

  return (
    <>
      <Select
        onOpen={() => modalRef.current?.present()} 
        items={value ? [value] : null}
        renderItem={renderItemEdit}
      />
      <ModalSheet
        ref={modalRef}
        name={modalName}
        title={fieldLabel}
        defaultIndex={defaultIndex}
      >
        <UsersSheet
          id={value?.key}
          values={[value]}
          onChange={_onChange}
          modalName={modalName}
        />
      </ModalSheet>
    </>
  );
};

const UserSelectField = ({
  editing,
  cacheKey,
  fieldKey,
  field,
  value,
  onChange
}) => {

  const [_value, _setValue] = useState(value);

  if (editing) return(
    <UserSelectFieldEdit
      cacheKey={cacheKey}
      fieldKey={fieldKey}
      fieldLabel={field?.name}
      value={_value}
      setValue={_setValue}
      onChange={onChange}
    />
  );
  return <UserSelectFieldView value={value} />;
};
export default UserSelectField;