import * as React from "react";
import PropTypes from "prop-types";
import { fontSizes } from "@crave/farmblocks-theme";

import linkTypes from "../constants/linkTypes";
import StyledLink from "../styledComponents/Link";

const Link = props => {
  const {
    size,
    lineHeight,
    type,
    disabled,
    leftIcon,
    rightIcon,
    external,
    children,
    className,
    onClick,
    ...linkProps
  } = props;

  const containerProps = {
    size,
    lineHeight,
    type,
    disabled,
    className,
  };

  const LinkComponent = linkProps.href && !disabled ? "a" : "span";

  return (
    <StyledLink {...containerProps}>
      <LinkComponent onClick={disabled ? undefined : onClick} {...linkProps}>
        {leftIcon && <i className={`${leftIcon} margin-right }`} />}
        {children}
        {rightIcon && <i className={`${rightIcon} margin-left }`} />}
        {external && <i className="wg-external-link margin-left" />}
      </LinkComponent>
    </StyledLink>
  );
};

Link.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  external: PropTypes.bool,
  size: PropTypes.number,
  lineHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  // ... and all properties of html <a>
};

Link.defaultProps = {
  type: linkTypes.FEATURED,
  size: fontSizes.MEDIUM,
  lineHeight: 1,
  disabled: false,
  external: false,
};

export default Link;
