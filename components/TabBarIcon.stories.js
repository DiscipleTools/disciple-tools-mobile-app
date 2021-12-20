import React from "react";
import { Platform } from "react-native";

import { storiesOf } from "@storybook/react-native";

import CenterView from "../storybook/stories/CenterView";
import TabBarIcon from "./TabBarIcon";

storiesOf("Tab Bar Icon", module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .add("Basic", () => (
    <TabBarIcon
      name={Platform.OS === "ios" ? "ios-home" : "md-home"}
      focused={false}
    />
  ))
  .add("with Focus", () => (
    <TabBarIcon name={Platform.OS === "ios" ? "ios-home" : "md-home"} focused />
  ));
