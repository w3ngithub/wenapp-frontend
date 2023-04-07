import '@ant-design/compatible/assets/index.css'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Button, Card, Form, Input, Popconfirm, Radio, Table} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import UserDetailForm from 'components/Modules/UserDetailModal'
import {CO_WORKERCOLUMNS} from 'constants/CoWorkers'
import {notification} from 'helpers/notification'
import {
  changeDate,
  getIsAdmin,
  getLocalStorageData,
  handleResponse,
} from 'helpers/utils'
import moment from 'moment'
import {useEffect, useState} from 'react'
import {CSVLink} from 'react-csv'
import {
  disableUser,
  getAllUsers,
  getUserPosition,
  getUserPositionTypes,
  getUserRoles,
  resetAllocatedLeaves,
  updateUser,
} from 'services/users/userDetails'
import ImportUsers from './ImportUsers'
import Select from 'components/Elements/Select'
import AccessWrapper from 'components/Modules/AccessWrapper'
import RoleAccess from 'constants/RoleAccess'
import {PAGE50, PLACE_HOLDER_CLASS} from 'constants/Common'
import {emptyText} from 'constants/EmptySearchAntd'
import {useDispatch, useSelector} from 'react-redux'
import {switchedUser, switchUser, updateJoinDate} from 'appRedux/actions'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {socket} from 'pages/Main'

const Search = Input.Search
const FormItem = Form.Item

const formattedUsers = (users, isAdmin) => {
  return users?.map((user) => ({
    ...user,
    key: user._id,
    dob: changeDate(user.dob),
    joinDate: changeDate(user.joinDate),
    isAdmin,
  }))
}

function CoworkersPage() {
  // init hooks
  const [sort, setSort] = useState({})
  const [page, setPage] = useState(PAGE50)
  const [openUserDetailModal, setOpenUserDetailModal] = useState(false)
  const [activeUser, setActiveUser] = useState(true)
  const [defaultUser, setDefaultUser] = useState('active')
  const [position, setPosition] = useState(undefined)
  const [role, setRole] = useState(undefined)
  const [name, setName] = useState('')
  const [typedName, setTypedName] = useState('')
  const [userRecord, setUserRecord] = useState({})
  const [readOnly, setReadOnly] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [openImport, setOpenImport] = useState(false)
  const [files, setFiles] = useState([])
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  // get user detail from storage

  const {
    role: {key, permission},
  } = useSelector(selectAuthUser)
  const [form] = Form.useForm()

  const coWorkersPermissions = permission?.['Co-Workers']

  const {data: roleData} = useQuery(['userRoles'], getUserRoles)
  const {data: positionData} = useQuery(['userPositions'], getUserPosition)
  const {data: positionTypes} = useQuery(
    ['userPositionTypes'],
    getUserPositionTypes
  )
  const {data, isLoading, isFetching, isError, refetch} = useQuery(
    ['users', page, activeUser, role, position, name, sort],
    () =>
      getAllUsers({
        ...page,
        active: activeUser,
        role,
        position,
        name,
        sort:
          sort.order === undefined || sort.column === undefined
            ? 'name'
            : sort.order === 'ascend'
            ? sort.field
            : `-${sort.field}`,
      }),
    {
      keepPreviousData: true,
    }
  )

  const mutation = useMutation(
    (updatedUser) => updateUser(updatedUser.userId, updatedUser.updatedData),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'User Updated Successfully',
          'Could not update User',
          [
            () => queryClient.invalidateQueries(['users']),
            () =>
              dispatch(updateJoinDate(response?.data?.data?.data?.joinDate)),
            () => setOpenUserDetailModal(false),
            () => {
              socket.emit('CUD')
            },
          ]
        ),
      onError: (error) => {
        notification({message: 'Could not update User', type: 'error'})
      },
    }
  )

  const disableUserMmutation = useMutation((userId) => disableUser(userId), {
    onSuccess: (response) =>
      handleResponse(
        response,
        'User Disabled Successfully',
        'Could not disable User',
        [
          () => queryClient.invalidateQueries(['users']),
          () => setOpenUserDetailModal(false),
          () => {
            socket.emit('CUD')
          },
          () => {
            socket.emit('disable-user', {
              showTo: [RoleAccess.Admin, RoleAccess.HumanResource],
              remarks: `${response?.data?.data?.data?.name} has been disabled.`,
              module: 'User',
            })
          },
        ]
      ),
    onError: (error) => {
      notification({message: 'Could not disable User', type: 'error'})
    },
  })

  useEffect(() => {
    if (isError) {
      notification({message: 'Could not load Users!', type: 'error'})
    }
  }, [isError])

  const handleToggleModal = (userRecordToUpdate, mode) => {
    setOpenUserDetailModal((prev) => !prev)
    setUserRecord(userRecordToUpdate)
    setReadOnly(mode)
  }

  const handleUserDetailSubmit = (user) => {
    try {
      const userTofind = data.data.data.data.find((x) => x._id === user._id)
      mutation.mutate({
        userId: user._id,
        updatedData: {
          ...user,
          dob: user.dob ? userTofind.dob : undefined,
          joinDate: user.joinDate
            ? moment.utc(user.joinDate).format()
            : undefined,
          lastReviewDate: user.lastReviewDate.map((d) =>
            moment(d).startOf('day').utc().format()
          ),
          exitDate: user?.exitDate ? moment.utc(user.exitDate).format() : null,
        },
      })
    } catch (error) {
      notification({message: 'Could not update User!', type: 'error'})
    }
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

  const setActiveInActiveUsers = (e) => {
    setDefaultUser(e.target.value)
    setActiveUser(e.target.value === 'active' ? true : false)
  }

  const handleRoleChange = (roleId) => {
    setPage(PAGE50)
    setRole(roleId)
  }

  const handlePositionChange = (positionId) => {
    setPage(PAGE50)
    setPosition(positionId)
  }

  const handleResetFilter = () => {
    setName('')
    setTypedName('')
    setRole(undefined)
    setPosition(undefined)
    setActiveUser('')
    setDefaultUser('')
    setSelectedRows([])
  }

  const handleRowSelect = (rows) => {
    setSelectedRows(rows)
  }

  const handleSelectRow = (record, selected, selectedRows) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, record?._id])
      setSelectedRows((prev) => [...prev, record])
    } else {
      setSelectedIds((prev) => prev.filter((d) => d !== record?._id))
      setSelectedRows((prev) => prev.filter((d) => d?._id !== record?._id))
    }
  }

  const handleSelectAll = (selected, selectedRows, changeRows) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, ...changeRows?.map((d) => d?._id)])
      setSelectedRows((prev) => [...prev, ...changeRows])
    } else {
      let changeRowsId = changeRows?.map((d) => d?._id)
      setSelectedIds((prev) => prev.filter((d) => !changeRowsId.includes(d)))
      setSelectedRows((prev) =>
        prev.filter((d) => !changeRowsId.includes(d?._id))
      )
    }
  }

  const handleSwitchToUser = async (user) => {
    dispatch(switchUser())
    const adminId = getLocalStorageData('user_id')
    localStorage.setItem('admin', JSON.stringify(adminId))
    localStorage.setItem('user_id', JSON.stringify(user?._id))
  }
  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <div>
      <ImportUsers
        toggle={openImport}
        onClose={() => setOpenImport(false)}
        files={files}
        setFiles={setFiles}
      />
      {openUserDetailModal && (
        <UserDetailForm
          toggle={openUserDetailModal}
          onToggleModal={handleToggleModal}
          onSubmit={handleUserDetailSubmit}
          loading={mutation.isLoading}
          roles={roleData}
          position={positionData}
          positionTypes={positionTypes}
          intialValues={userRecord}
          readOnly={readOnly}
        />
      )}
      <Card title="Co-workers">
        <div className="components-table-demo-control-bar">
          <div className="gx-d-flex gx-justify-content-between gx-flex-row ">
            <Search
              allowClear
              placeholder="Search Co-workers"
              onSearch={(value) => {
                setPage((prev) => ({...prev, page: 1}))
                setName(value)
              }}
              onChange={(e) => setTypedName(e.target.value)}
              value={typedName}
              enterButton
              className="direct-form-item"
            />
          </div>
          <div className="gx-d-flex gx-justify-content-between gx-flex-row ">
            <Form layout="inline" form={form}>
              <FormItem className="direct-form-search margin-1r">
                <Select
                  placeholderClass={PLACE_HOLDER_CLASS}
                  placeholder="Select Role"
                  sortAscend={true}
                  onChange={handleRoleChange}
                  value={role}
                  options={roleData?.data?.data?.data?.map((x) => ({
                    ...x,
                    id: x._id,
                  }))}
                />
              </FormItem>
              <FormItem className="direct-form-search">
                <Select
                  placeholderClass={PLACE_HOLDER_CLASS}
                  placeholder="Select Position"
                  sortAscend={true}
                  className="margin-1r"
                  onChange={handlePositionChange}
                  value={position}
                  options={positionData?.data?.data?.data?.map((x) => ({
                    id: x._id,
                    value: x.name,
                  }))}
                />
              </FormItem>
              <FormItem style={{marginBottom: '10px'}}>
                <Radio.Group
                  buttonStyle="solid"
                  value={defaultUser}
                  onChange={setActiveInActiveUsers}
                  id="radio"
                >
                  <Radio.Button value="active">Active</Radio.Button>
                  <Radio.Button value="inactive">Inactive</Radio.Button>
                </Radio.Group>
              </FormItem>
              <FormItem>
                <Button
                  className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                  onClick={handleResetFilter}
                >
                  Reset
                </Button>
              </FormItem>
            </Form>
            <AccessWrapper
              role={
                coWorkersPermissions?.importCoworkers ||
                coWorkersPermissions?.exportCoworkers
              }
            >
              <div className="gx-btn-form">
                <AccessWrapper role={coWorkersPermissions?.importCoworkers}>
                  <Button
                    className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                    onClick={() => setOpenImport(true)}
                    disabled={getIsAdmin()}
                  >
                    Import
                  </Button>
                </AccessWrapper>
                {data?.status && coWorkersPermissions?.exportCoworkers && (
                  <CSVLink
                    filename={'co-workers'}
                    data={[
                      [
                        'Name',
                        'Email',
                        'Primary Phone',
                        'Role',
                        'Position',
                        'DOB',
                        'Join Date',
                      ],
                      ...selectedRows?.map((d) => [
                        d?.name,
                        d?.email,
                        d?.primaryPhone,
                        d?.role?.value,
                        d?.position?.name,
                        d?.dob?.split('/')?.reverse()?.join('/'),
                        d?.joinDate?.split('/')?.reverse()?.join('/'),
                      ]),
                    ]}
                  >
                    <Button
                      className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                      disabled={selectedRows.length === 0}
                    >
                      Export
                    </Button>
                  </CSVLink>
                )}
              </div>
            </AccessWrapper>
          </div>
        </div>
        <Table
          locale={{emptyText}}
          className="gx-table-responsive"
          columns={CO_WORKERCOLUMNS(
            sort,
            handleToggleModal,
            handleSwitchToUser,
            mutation,
            disableUserMmutation,
            permission
          )}
          dataSource={formattedUsers(data?.data?.data?.data, key === 'admin')}
          onChange={handleTableChange}
          rowSelection={{
            onSelect: handleSelectRow,
            selectedRowKeys: selectedIds,
            onSelectAll: handleSelectAll,
          }}
          pagination={{
            current: page.page,
            pageSize: page.limit,
            pageSizeOptions: ['25', '50', '100'],
            showSizeChanger: true,
            total: data?.data?.data?.count || 1,
            onShowSizeChange,
            hideOnSinglePage: data?.data?.data?.count ? false : true,
            onChange: handlePageChange,
          }}
          loading={
            mutation.isLoading ||
            isFetching ||
            // resetLeavesMutation.isLoading ||
            disableUserMmutation.isLoading
          }
        />
      </Card>
    </div>
  )
}

export default CoworkersPage
