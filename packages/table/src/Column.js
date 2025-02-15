import PropTypes from "prop-types";
import values from "object.values";
import { fontTypes } from "@crave/farmblocks-text";

const Column = () => null;

Column.propTypes = {
  title: PropTypes.string,
  text: PropTypes.func,
  customTitle: PropTypes.func,
  customCell: PropTypes.func,
  clickable: PropTypes.bool,
  width: PropTypes.string,
  align: PropTypes.string,
  fontType: PropTypes.oneOf(values(fontTypes)),
  whiteSpace: PropTypes.string,
};

Column.defaultProps = {
  align: "left",
  whiteSpace: "normal",
};

export default Column;
