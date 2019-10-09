import React, { useMemo, useCallback, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  parsePhoneNumberFromString,
  parseDigits,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
} from "libphonenumber-js";
import { FixedSizeList as List } from "react-window";
import TextInput from "@crave/farmblocks-input-text";
import { fontSizes, colors } from "@crave/farmblocks-theme";
import Popover from "@crave/farmblocks-popover";
import { FormWrapperHeader } from "@crave/farmblocks-form-wrapper";

import CountrySelectorTrigger from "./CountrySelectorTrigger";
import countries from "./countries.json";
import CountryRow from "./CountryRow";
import { useCountrySearch } from "./PhoneInput.hooks";

/**
 * This component uses the [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js) library to convert phone numbers typed in their national standard to the [RFC3966](https://www.ietf.org/rfc/rfc3966.txt) notation.
 */
const PhoneInput = ({
  value,
  defaultCountry,
  onChange,
  textSelectCountryTitle,
  textSelectCountryCancel,
  textSelectCountrySearch,
  disabled,
  ...props
}) => {
  const listRef = useRef();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");

  const phone = useMemo(() => parsePhoneNumberFromString(value), [value]);

  const country = phone?.country || defaultCountry;
  const filteredCountries = useCountrySearch(countries, countryQuery);

  const handleNumberChange = useCallback(
    ({ target }) => {
      const newValue = parseDigits(target?.value);
      onChange(parsePhoneNumberFromString(newValue, country).getURI());
    },
    [defaultCountry],
  );

  const handleSearchChange = useCallback(event => {
    setCountryQuery(event.target.value);
    listRef.current?.scrollTo(0);
  }, []);

  return (
    <TextInput
      prefix={
        <Popover
          onOpen={() => setPopoverOpen(true)}
          onClose={() => setPopoverOpen(false)}
          tooltipProps={{
            padding: "0",
          }}
          disabled={disabled}
          trigger={
            <CountrySelectorTrigger
              disabled={disabled}
              countryCode={getCountryCallingCode(country)}
            />
          }
          content={dismiss => (
            // We stop propagation to avoid giving focus to the main input
            // This happens because the popover is inside the input wrapper
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div onClick={event => event.stopPropagation()}>
              <FormWrapperHeader
                title={textSelectCountryTitle}
                cancelLabel={textSelectCountryCancel}
                onCancel={dismiss}
              />
              <TextInput
                placeholder={textSelectCountrySearch}
                type="search"
                fontSize={fontSizes.SMALL}
                margin="8px"
                value={countryQuery}
                onChange={handleSearchChange}
              />
              <ul
                css={`
                  padding: 0;
                  margin: 0;
                  border-top: solid 1px ${colors.GREY_16};
                `}
              >
                <List
                  height={250}
                  itemCount={filteredCountries.length}
                  itemData={filteredCountries}
                  itemKey={(index, data) => data[index].code}
                  itemSize={54}
                  width={300}
                  ref={listRef}
                >
                  {CountryRow}
                </List>
              </ul>
            </div>
          )}
        />
      }
      active={popoverOpen}
      value={formatIncompletePhoneNumber(phone?.nationalNumber, country)}
      onChange={handleNumberChange}
      inputMode="tel"
      css="
          .input {
            overflow: unset;
          }
          .prefix {
            padding: 0;
            align-items: stretch;

            .popover__trigger {
              height: 100%;
              outline: none;
            }
          }
        "
      disabled={disabled}
      {...props}
    />
  );
};

PhoneInput.defaultProps = {
  value: "",
  defaultCountry: "US",
  textSelectCountryTitle: "Select Country",
  textSelectCountryCancel: "Cancel",
  textSelectCountrySearch: "Search",
  disabled: false,
};

PhoneInput.propTypes = {
  /**
   * The phone number to show in the input. Should follow the RFC3966 notation.
   * E.g. "tel:+12133734253"
   */
  value: PropTypes.string,

  /**
   * Code for the Country selected by default, when `value` is empty
   */
  defaultCountry: PropTypes.string,

  /**
   * Countries to show at the top of the list, like the ones with your
   * biggest user base, so most users can easily select their country
   * without the need to search in the full list.
   * Use a string of country codes separated by colons `,`.
   */
  priorityCountries: PropTypes.string,

  /**
   * Function called with the new value after a user interaction.
   * Will return the phone number formated in the RFC3966 notation.
   */
  onChange: PropTypes.func,

  /**
   * Text for the title of the country selection popover
   */
  textSelectCountryTitle: PropTypes.string,

  /**
   * Text for the cancel button of the country selection popover
   */
  textSelectCountryCancel: PropTypes.string,

  /**
   * Text for the search field of the country selection popover
   */
  textSelectCountrySearch: PropTypes.string,

  /**
   * Displays the input greyed out and prevents edition
   */
  disabled: PropTypes.bool,
};

export default PhoneInput;
