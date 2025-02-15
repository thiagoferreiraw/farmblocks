import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";

import protectedValue from "./protectedValue";

describe("TextInput > protectedValue", () => {
  configure({ adapter: new Adapter() });

  const Input = () => <input />;
  const EnhancedInput = protectedValue(Input);

  test("click on the pencil should uncover protected field", () => {
    const originalValue = "Foo";
    const component = mount(<EnhancedInput value={originalValue} protected />);
    const editButton = component.find("a");
    const isCovered = () => component.find("InputCover").length === 1;
    expect(isCovered()).toBe(true);
    editButton.simulate("click");
    expect(isCovered()).toBe(false);
    expect(component.state("isEditing")).toBe(true);
  });

  test("click on the pencil should call function onUncover if provided", () => {
    const originalValue = "Foo";
    const onUncoverSpy = jest.fn();
    const component = mount(
      <EnhancedInput
        onUncover={onUncoverSpy}
        value={originalValue}
        protected
      />,
    );
    const editButton = component.find("a");
    editButton.simulate("click");

    expect(onUncoverSpy).toBeCalled();
  });

  test("the passed onKeyDown handler should be called after executing the internal component's onKeyDown", () => {
    const onKeyDownMock = jest.fn();
    const component = mount(
      <EnhancedInput protected onKeyDown={onKeyDownMock} />,
    );
    const keyDownEvent = { keyCode: 64 };
    component.instance().onKeyDown(keyDownEvent);
    expect(onKeyDownMock).toBeCalledWith(keyDownEvent);
  });

  test("pressing Esc key when editing should return the original value, call the handler and cover the field with a protection again", () => {
    const originalValue = "Foo";
    const newValue = "Bar";
    const onCancelMock = jest.fn();
    const component = mount(
      <EnhancedInput value={originalValue} protected onCancel={onCancelMock} />,
    );
    const editButton = component.find("a");
    const isCovered = () => component.find("InputCover").length === 1;
    editButton.simulate("click");
    const keyDownEvent = {
      key: "Escape",
      target: { value: newValue },
    };
    component.instance().onKeyDown(keyDownEvent);
    component.update();
    const expectedState = {
      value: originalValue,
      isEditing: false,
      editedValue: "",
    };
    expect(component.state()).toEqual(expectedState);
    expect(onCancelMock).toBeCalled();
    expect(isCovered()).toBe(true);
  });

  test("pressing Enter key when editing should replace the original value, call the handler and cover the field with a protection again", () => {
    const originalValue = "Foo";
    const newValue = "Bar";
    const onReplaceMock = jest.fn();
    const component = mount(
      <EnhancedInput
        value={originalValue}
        protected
        onReplace={onReplaceMock}
      />,
    );
    const editButton = component.find("a");
    const isCovered = () => component.find("InputCover").length === 1;
    editButton.simulate("click");
    const keyDownEvent = {
      key: "Enter",
      target: { value: newValue },
    };
    component.instance().onKeyDown(keyDownEvent);
    component.update();
    const expectedState = {
      value: newValue,
      isEditing: false,
      editedValue: "",
    };
    expect(component.state()).toEqual(expectedState);
    expect(onReplaceMock).toBeCalledWith(newValue);
    expect(isCovered()).toBe(true);
  });

  test("replacing the value by changing the property after mount should change state value without triggering the onReplace handler", () => {
    const originalValue = "Foo";
    const newValue = "Bar";
    const onReplaceMock = jest.fn();
    const component = mount(
      <EnhancedInput
        value={originalValue}
        protected
        onReplace={onReplaceMock}
      />,
    );
    component.setProps({ value: newValue });
    const expectedState = {
      value: newValue,
      isEditing: false,
      editedValue: "",
    };
    expect(component.state()).toEqual(expectedState);
    expect(onReplaceMock).not.toBeCalled();
  });

  describe("onBlur", () => {
    test("input onBlur should call onCancel when user is editing", () => {
      const onCancelMock = jest.fn();
      const onBlurMock = jest.fn();

      const component = mount(
        <EnhancedInput
          value=""
          protected
          onCancel={onCancelMock}
          onBlur={onBlurMock}
        />,
      );

      // set editing state
      component.instance().onUncover();
      component.update();

      const mockedEvent = {};

      component
        .find(Input)
        .props()
        .onBlur(mockedEvent);

      expect(onCancelMock).toBeCalled();
      expect(onBlurMock).toBeCalledWith(mockedEvent);
    });

    test("input onBlur should not call onCancel when user is not editing", () => {
      const onCancelMock = jest.fn();

      const component = mount(
        <EnhancedInput value="" protected onCancel={onCancelMock} />,
      );

      component
        .find(Input)
        .props()
        .onBlur();

      expect(onCancelMock).not.toBeCalled();
    });
  });

  test("input onChange should update state with the edited value", () => {
    const onChangeMock = jest.fn();
    const component = mount(
      <EnhancedInput value="" protected onChange={onChangeMock} />,
    );

    // set editing state
    component.instance().onUncover();

    const editedValue = "New value";
    const mockedEvent = { target: { value: editedValue } };

    component
      .find(Input)
      .props()
      .onChange(mockedEvent);

    const expectedState = {
      value: "",
      isEditing: true,
      editedValue,
    };
    expect(component.state()).toEqual(expectedState);
    expect(onChangeMock).toBeCalledWith(mockedEvent);
  });

  test("click on Cancel button should call onCancel when user is editing", () => {
    const onCancelMock = jest.fn();

    const component = mount(
      <EnhancedInput value="" protected onCancel={onCancelMock} />,
    );

    // set editing state
    component.instance().onUncover();

    // force re-render
    component.update();

    const cancelButton = component.find("#cancel-button");
    cancelButton.find("button").simulate("click");

    expect(onCancelMock).toBeCalled();
  });

  describe("Save button", () => {
    test("click should call onReplace when user is editing", () => {
      const onReplaceMock = jest.fn();

      const component = mount(
        <EnhancedInput value="" protected onReplace={onReplaceMock} />,
      );

      // set editing state
      component.instance().onUncover();

      // force re-render
      component.update();

      const saveButton = component.find("#save-button");
      saveButton.find("button").simulate("click");

      expect(onReplaceMock).toBeCalledWith("");
    });

    test("mouse down should prevent default", () => {
      const preventDefaultMock = jest.fn();

      const component = mount(<EnhancedInput value="" protected />);

      // set editing state
      component.instance().onUncover();

      // force re-render
      component.update();

      const saveButton = component.find("#save-button");
      saveButton
        .find("button")
        .simulate("mousedown", { preventDefault: preventDefaultMock });

      expect(preventDefaultMock).toBeCalled();
    });
  });
});
