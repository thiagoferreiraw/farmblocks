import * as React from "react";
import PropTypes from "prop-types";
import Button from "@crave/farmblocks-button";
import Popover from "@crave/farmblocks-popover";
import { colors } from "@crave/farmblocks-theme";
import FormWrapper from "@crave/farmblocks-form-wrapper";

const FilterPopover = props => {
  return (
    <Popover
      className={props.className}
      tooltipProps={{
        padding: "0px",
        ...props.tooltipProps,
      }}
      trigger={
        <Button
          className="trigger"
          rightIcon="wg-small-arrow-bottom"
          boxShadow="none"
          paddingX="8px"
          activated={props.hasValue}
          textColor={props.triggerTextColor}
          fontSize={props.triggerFontSize}
          fontWeight={props.triggerFontWeight}
        >
          {props.triggerLabel}

          {props.hasValue && (
            <div className="icon" style={{ marginLeft: 8 }}>
              <i className="wg-check-box" />
            </div>
          )}
        </Button>
      }
      content={dismiss => (
        <FormWrapper
          className="formWrapper"
          onCancel={e => {
            dismiss();
            props.onFormCancelClick?.(e);
          }}
          onSave={e => {
            if (props.dismissOnSave) {
              dismiss();
            }
            props.onFormSaveClick(e, dismiss);
          }}
          saveLabel={props.formSaveLabel}
          cancelLabel={props.formCancelLabel}
          title={props.formTitle}
          loading={props.formLoading}
        >
          {typeof props.formContent === "function"
            ? props.formContent(dismiss)
            : props.formContent}
        </FormWrapper>
      )}
    />
  );
};

FilterPopover.defaultProps = {
  formSaveLabel: "Filter",
  triggerFontSize: "14px",
  triggerTextColor: colors.CARBON,
  triggerFontWeight: "normal",
};

FilterPopover.propTypes = {
  triggerLabel: PropTypes.string.isRequired,
  triggerFontSize: PropTypes.string,
  triggerTextColor: PropTypes.string,
  triggerFontWeight: PropTypes.string,
  formTitle: PropTypes.string,
  formContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  formLoading: PropTypes.bool,
  formSaveLabel: PropTypes.string,
  formCancelLabel: PropTypes.string,
  onFormSaveClick: PropTypes.func,
  onFormCancelClick: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  tooltipProps: PropTypes.object,
  dismissOnSave: PropTypes.bool,
  hasValue: PropTypes.bool,
  className: PropTypes.string,
};

export default FilterPopover;
