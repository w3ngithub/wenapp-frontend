import React from "react";
import { Select as Dropdown } from "antd";

import { filterOptions } from "helpers/utils";

const Option = Dropdown.Option;

const Select = ({ onChange, value, options, placeholder, style, mode }) => {
	return (
		<Dropdown
			showSearch
			placeholder={placeholder}
			style={{ width: 200, ...style }}
			onChange={onChange}
			value={value}
			filterOption={filterOptions}
			mode={mode}
		>
			{options &&
				options?.map(opt => (
					<Option value={opt?.id} key={opt?.id}>
						{opt?.value}
					</Option>
				))}
		</Dropdown>
	);
};

export default Select;

Select.defaultProps = {
	onChange: () => {},
	value: undefined,
	options: [],
	placeholder: "Select Option",
	style: {},
	mode: ""
};
