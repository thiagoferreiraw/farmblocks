import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { fontSizes } from "@crave/farmblocks-theme";

import formInput from ".";

const EnhancedInput = formInput(props => React.createElement("input", props));

storiesOf("HOC formInput", module)
  .add("html text input", withInfo()(() => <EnhancedInput type="text" />))
  .add(
    "html text input with label",
    withInfo()(() => (
      <EnhancedInput
        onChange={action("change event")}
        label="Input Label"
        type="text"
      />
    ))
  )
  .add(
    "html text input with input.onChange and input.value ",
    withInfo()(() => (
      <EnhancedInput
        input={{
          onChange: action("input.onChange"),
          value: "input.value"
        }}
        label="Input Label"
        type="text"
      />
    ))
  )
  .add(
    "two html inputs with label",
    withInfo()(() => (
      <div>
        <EnhancedInput label="Input Label" type="text" />
        <EnhancedInput label="Input Label" type="checkbox" />
      </div>
    ))
  )
  .add(
    "html text input with label and placeholder",
    withInfo()(() => (
      <EnhancedInput
        placeholder="a placeholder"
        label="Input Label"
        type="text"
      />
    ))
  )
  .add(
    "html text input with label and focused flag",
    withInfo()(() => <EnhancedInput focused label="Input Label" type="text" />)
  )
  .add(
    "invalid input",
    withInfo()(() => (
      <EnhancedInput label="Input Label" type="text" invalid="true" />
    ))
  )
  .add(
    "html disabled input with label",
    withInfo()(() => (
      <div>
        <EnhancedInput
          disabled
          label="Input Label"
          type="text"
          value="Disabled field"
        />
      </div>
    ))
  )
  .add(
    "input with fontSize property SMALL",
    withInfo()(() => <EnhancedInput fontSize={fontSizes.SMALL} />)
  )
  .add("html search input", withInfo()(() => <EnhancedInput type="search" />))
  .add(
    "html search input with value",
    withInfo()(() => <EnhancedInput type="search" value="broccoli" />)
  )
  .add(
    "html search input with custom clear icon",
    withInfo()(() => (
      <EnhancedInput type="search" value="broccoli" clearIcon="wg-close" />
    ))
  )
  .add(
    "html input with clear button",
    withInfo()(() => <EnhancedInput clearable />)
  )
  .add(
    "html text input with combobox role",
    withInfo()(() => (
      <div style={{ width: "300px" }}>
        <EnhancedInput role="combobox" placeholder="Select value" />
      </div>
    ))
  )
  .add(
    "html text input with combobox readonly role",
    withInfo()(() => (
      <div style={{ width: "300px" }}>
        <EnhancedInput role="combobox" placeholder="Select value" readOnly />
      </div>
    ))
  );
