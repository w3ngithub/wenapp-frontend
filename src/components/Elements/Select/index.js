import React, {useState} from 'react'
import {Select as Dropdown} from 'antd'
import {filterOptions} from 'helpers/utils'
import './selectLabel.less'
import {SearchOutlined} from '@ant-design/icons'

const Option = Dropdown.Option

const Select = ({
  disabled = false,
  onChange,
  value,
  options,
  placeholder,
  style,
  mode,
  inputSelect = false,
  defaultValue='',
  width = 200,
  placeholderClass = false,
  handleSearch,
  showSearchIcon = false,
}) => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div>
      <Dropdown
        
        suffixIcon={showSearchIcon ? <SearchOutlined /> : undefined}
        disabled={disabled}
        className={placeholderClass}
        allowClear
        showSearch
        placeholder={placeholderClass ? null : placeholder}
        style={style}
        onChange={onChange}
        defaultValue={defaultValue ? defaultValue : undefined}
        // defaultValue={null}

        onSearch={(e) => {
          inputSelect && setSearchValue(e)
          handleSearch(e)
        }}
        value={value}
        filterOption={filterOptions}
        mode={mode}
        open={!inputSelect ? undefined : searchValue.length ? true : false}
        onSelect={() => {
          inputSelect && setSearchValue('')
        }}
      >
        {options &&
          options?.map((opt) => (
            <Option value={opt?.id} key={opt?.id}>
              {opt?.value}
            </Option>
          ))}
      </Dropdown>
      {placeholderClass ? (
        <span className={value ? 'floating-label-fixed' : 'floating-label'}>
          {placeholder}
        </span>
      ) : null}
    </div>
  )
}

export default Select

Select.defaultProps = {
  onChange: () => {},
  handleSearch :()=>{},
  value: undefined,
  options: [],
  placeholder: 'Select Option',
  style: {},
  mode: '',
}
