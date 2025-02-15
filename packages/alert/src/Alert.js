import * as React from "react";
import PropTypes from "prop-types";
import Button, { buttonTypes, buttonSizes } from "@crave/farmblocks-button";

import StyledAlert from "./styledComponents/Alert";
import AlertTypes from "./constants/alertTypes";
import BrieflyDisplay from "./BrieflyDisplay";

const DEFAULT_Z_INDEX = 2500;

class Alert extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.keys(AlertTypes)),
    dismissable: PropTypes.bool,
    autoRemove: PropTypes.bool,
    onDismiss: PropTypes.func,
    visibleTime: PropTypes.number,
    zIndex: PropTypes.number,
    bottomAligned: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    type: AlertTypes.NEWS,
    dismissable: true,
    autoRemove: true,
    zIndex: DEFAULT_Z_INDEX,
    onDismiss: () => null,
    bottomAligned: false,
  };

  state = {
    isVisible: true,
  };

  dismissHandler = () => {
    this.setState({ isVisible: false });
    this.props.onDismiss();
  };

  render() {
    if (!this.state.isVisible && this.props.autoRemove) {
      return null;
    }
    const {
      visibleTime,
      autoRemove,
      onDismiss,
      zIndex,
      bottomAligned,
      className,
    } = this.props;
    const alert = (
      <StyledAlert
        className={className}
        type={this.props.type}
        zIndex={zIndex}
        bottomAligned={bottomAligned}
      >
        <p>{this.props.text}</p>

        {this.props.dismissable && (
          <div className="dismiss-button">
            <Button
              icon="wg-close"
              size={buttonSizes.SMALL}
              type={buttonTypes.OFF_NEUTRAL}
              onClick={this.dismissHandler}
            />
          </div>
        )}
      </StyledAlert>
    );
    if (!visibleTime) {
      return alert;
    }
    return (
      <BrieflyDisplay
        time={visibleTime}
        autoRemove={autoRemove}
        onTimeout={onDismiss}
      >
        {alert}
      </BrieflyDisplay>
    );
  }
}

export default Alert;
