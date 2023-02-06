import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
} from 'react'
import {useQuery} from '@tanstack/react-query'
import {Form, Input, Table} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import {notification} from 'helpers/notification'
import {LEAVE_REPORT_COLUMNS} from 'constants/LeaveReport'
import {getLeaveDaysOfAllUsers} from 'services/leaves'
import {emptyText} from 'constants/EmptySearchAntd'

const EditableContext = createContext(null)
const EditableRow = ({index, ...props}) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])
  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({
        ...record,
        ...values,
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }
  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}

function SummaryTable({data}) {
  // init states
  const [sort, setSort] = useState({})
  const [page, setPage] = useState({page: 1, limit: 10})

  const summaryLeaveReport = (leaveData) => {
    return leaveData?.map((leave) => ({
      ...leave,
      name: leave?.user?.name,
      allocatedLeaves: leave?.leaves?.[0]?.allocatedLeaves,
      remainingLeaves: leave?.leaves?.[0]?.remainingLeaves,
      carriedOverLeaves: leave?.leaves?.[0]?.carriedOverLeaves,
      leaveDeductionBalance: leave?.leaves?.[0]?.leaveDeductionBalance,
      sickLeaves: leave?.leaves?.[0]?.approvedLeaves?.sickLeaves,
      casualLeaves: leave?.leaves?.[0]?.approvedLeaves?.casualLeaves,
    }))
  }

  //   useEffect(() => {
  //     if (isError) {
  //       notification({message: 'Could not load Leave Report!', type: 'error'})
  //     }
  //   }, [isError, data])

  const handleSave = () => {
    console.log('saving')
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setSort(sorter)
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const columns = LEAVE_REPORT_COLUMNS(sort)?.map((item) => {
    if (!item.editable) {
      return item
    }
    return {
      ...item,
      onCell: (record) => ({
        record,
        editable: item.editable,
        dataIndex: item.dataIndex,
        title: item.title,
        handleSave,
      }),
    }
  })

  return (
    <>
      <div className="components-table-demo-control-bar">
        <div className="gx-d-flex gx-justify-content-between gx-flex-row"></div>
      </div>
      <Table
        locale={{emptyText}}
        className="gx-table-responsive"
        components={components}
        columns={columns}
        // rowClassName={() => 'editable-row'}
        dataSource={summaryLeaveReport(data)}
        // onChange={handleTableChange}
        // pagination={{
        //   current: page.page,
        //   pageSize: page.limit,
        //   pageSizeOptions: ['5', '10', '20', '50'],
        //   showSizeChanger: true,
        //   total: data?.data?.data?.data?.[quarter - 1]?.length || 1,
        //   onShowSizeChange,
        //   hideOnSinglePage: data?.data?.data?.data?.[quarter - 1]?.length
        //     ? false
        //     : true,
        //   onChange: handlePageChange,
        // }}
        // loading={isLoading || isFetching}
      />
    </>
  )
}

export default SummaryTable
