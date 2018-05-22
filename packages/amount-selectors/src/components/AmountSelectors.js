import * as React from "react";
import PropTypes from "prop-types";
import Button, { buttonTypes } from "@crave/farmblocks-button";
import InputText from "@crave/farmblocks-input-text";
import { fontSizes } from "@crave/farmblocks-theme";
import values from "object.values";

import selectorSizes from "../constants/selectorSizes";
import Wrapper from "../styledComponents/AmountSelector";

class AmountSelectors extends React.Component {
  state = {
    value: this.props.value,
    displayValue: this.props.value,
    validationMessages: this.props.validationMessages
  };

  onChange = (event, cb) => {
    const value = typeof event === "number" ? event : event.target.value;
    const parsedValue = parseFloat(value) || 0;

    if (parsedValue >= this.props.min && parsedValue <= this.props.max) {
      this.setState(
        {
          value: parsedValue,
          validationMessages: []
        },
        cb
      );

      return this.props.onChange(parsedValue);
    }

    this.setState({
      validationMessages: ["Invalid value"]
    });
  };

  updateDisplayValue = () => {
    this.setState({
      displayValue: this.state.value.toFixed(2)
    });
  };

  decrement = () => {
    const value = this.state.value - this.props.step;

    this.onChange(Math.max(value, this.props.min), this.updateDisplayValue);
  };

  increment = () => {
    const value = this.state.value + this.props.step;

    this.onChange(Math.min(value, this.props.max), this.updateDisplayValue);
  };

  render() {
    return (
      <Wrapper size={this.props.size}>
        <Button
          className="decreaseButton"
          type={buttonTypes.SECONDARY}
          size={this.props.size}
          icon="wg-minus"
          disabled={this.state.value === this.props.min}
          onClick={this.decrement}
          noTooltip
        />
        <div className="inputContainer">
          <InputText
            type="number"
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            value={this.state.displayValue}
            readOnly={this.props.disableTyping}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            onBlur={this.updateDisplayValue}
            size={4}
            validationMessages={this.state.validationMessages}
            fontSize={fontSizes[this.props.size]}
          />
        </div>
        <Button
          className="increaseButton"
          type={buttonTypes.SECONDARY}
          size={this.props.size}
          icon="wg-add"
          disabled={this.state.value === this.props.max}
          onClick={this.increment}
          tooltipText="There is no more available amount."
        />
      </Wrapper>
    );
  }

  static propTypes = {
    value: PropTypes.number,
    step: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    disableTyping: PropTypes.bool,
    validationMessages: PropTypes.arrayOf(PropTypes.string),
    size: PropTypes.oneOf(values(selectorSizes))
  };

  static defaultProps = {
    value: 0,
    step: 1,
    min: 0,
    max: Number.MAX_VALUE,
    onChange: () => false,
    disableTyping: false,
    size: selectorSizes.MEDIUM
  };
}

export default AmountSelectors;
