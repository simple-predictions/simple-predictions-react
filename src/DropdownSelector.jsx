import React from 'react';
import './DropdownSelector.css';
import PropTypes from 'prop-types';

const DropdownSelector = ({
  minileagueArr, enabled, style, startingValue, onValueUpdate, length,
}) => (
  <div className="dropdown-container">
    <img alt="dropdown arrow" className="dropdown-arrow" height={20} src="/icons/arrow.png" />
    <select disabled={enabled} style={style} value={startingValue} onChange={onValueUpdate}>
      {[...Array(length)].map((x, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <option key={i + 1} value={i + 1}>{minileagueArr.length > 0 ? minileagueArr[i].name : `Gameweek ${i + 1}`}</option>
      ))}
    </select>
  </div>
);

DropdownSelector.propTypes = {
  minileagueArr: PropTypes.arrayOf(PropTypes.object),
  enabled: PropTypes.bool,
  style: PropTypes.shape({
    border: PropTypes.string,
  }),
  startingValue: PropTypes.number,
  onValueUpdate: PropTypes.func.isRequired,
  length: PropTypes.number.isRequired,
};
DropdownSelector.defaultProps = {
  minileagueArr: [],
  enabled: false,
  style: {},
  startingValue: 0,
};

export default DropdownSelector;
