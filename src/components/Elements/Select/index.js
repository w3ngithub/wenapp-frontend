import React, { useState } from "react";
import { Select as Dropdown } from "antd";

import { filterOptions } from "helpers/utils";

const Option = Dropdown.Option;

const Select = ({
	onChange,
	value,
	options,
	placeholder,
	style,
	mode,
	inputSelect = false,
	width=200
}) => {
	const [searchValue, setSearchValue] = useState("");
	return (
		<Dropdown
			showSearch
			allowClear
			placeholder={placeholder}
			style={{ width, ...style }}
			onChange={onChange}
			onSearch={e => {
				inputSelect && setSearchValue(e);
			}}
			value={value}
			filterOption={filterOptions}
			mode={mode}
			showArrow={false}
			open={!inputSelect ? undefined : searchValue.length ? true : false}
			onSelect={() => {
				inputSelect && setSearchValue("");
			}}
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
