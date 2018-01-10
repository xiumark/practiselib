import React from 'react';
import PropTypes from 'prop-types';

const Select = (props, context) => {
    let { id, className = '', disabled = false, hidden = false, options, onChange, } = props;
    return (
        <select className={`form-control select ${className}`} disabled={disabled} id={id} onChange={onChange} >
            {options.map((item, index) => {
                return <option key={index} hidden={item.hidden} value={item.name}>{item.name}</option>
            })}
        </select>
    )
}

Select.propTypes = {
    id: PropTypes.string,
    className:PropTypes.string,
    disabled: PropTypes.bool,
    hidden:PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,

}

export default Select;