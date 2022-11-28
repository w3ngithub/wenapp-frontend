import '@ant-design/compatible/assets/index.css'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Button, Card, Form, Input, Popconfirm, Radio, Table} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import UserDetailForm from 'components/Modules/UserDetailModal'
import {CO_WORKERCOLUMNS} from 'constants/CoWorkers'
import {notification} from 'helpers/notification'
import {changeDate, getLocalStorageData, handleResponse} from 'helpers/utils'
import moment from 'moment'
import {useEffect, useState} from 'react'
import {CSVLink} from 'react-csv'
import {
  disableUser,
  getAllUsers,
  getMyProfile,
  getUserPosition,
  getUserPositionTypes,
  getUserRoles,
  resetAllocatedLeaves,
  updateUser,
} from 'services/users/userDetails'
import ImportUsers from './ImportUsers'
import Select from 'components/Elements/Select'
import {getQuarters} from 'services/leaves'
import {LOCALSTORAGE_USER} from 'constants/Settings'
import AccessWrapper from 'components/Modules/AccessWrapper'
import {
  CO_WORKERS_RESET_ALLOCATEDLEAVES_NO_ACCESS,
  CO_WORKERS_SEARCH_IMPORT_NO_ACCESS,
} from 'constants/RoleAccess'
import {PLACE_HOLDER_CLASS} from 'constants/Common'
import {emptyText} from 'constants/EmptySearchAntd'
import {useDispatch, useSelector} from 'react-redux'
import {ON_HIDE_LOADER, ON_SHOW_LOADER} from 'constants/ActionTypes'
import {
  hideAuthLoader,
  showAuthLoader,
  switchedUser,
  switchUser,
} from 'appRedux/actions'

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
  const [page, setPage] = useState({page: 1, limit: 20})
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
  const [openImport, setOpenImport] = useState(false)
  const [files, setFiles] = useState([])
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  // get user detail from storage
  const {user} = useSelector((state) => state.auth?.authUser)
  const [form] = Form.useForm()

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
  const quarterQuery = useQuery(['quarters'], getQuarters, {
    select: (res) => {
      const ongoingQuarter = Object.entries(res.data?.data?.data[0]).find(
        (quarter) =>
          new Date(quarter[1].fromDate) <=
            new Date(moment.utc(moment(new Date()).startOf('day')).format()) &&
          new Date(moment.utc(moment(new Date()).startOf('day')).format()) <=
            new Date(quarter[1].toDate)
      )

      return {
        name: ongoingQuarter[0],
        ...ongoingQuarter[1],
      }
    },
  })
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
            () => setOpenUserDetailModal(false),
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
        ]
      ),
    onError: (error) => {
      notification({message: 'Could not disable User', type: 'error'})
    },
  })

  const resetLeavesMutation = useMutation(
    (payload) => resetAllocatedLeaves(payload),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Allocated leaves reset of all user Successfully',
          'Could not reset allocated leaves',
          [() => refetch()]
        ),
      onError: (error) => {
        notification({
          message: 'Could not reset allocated leaves',
          type: 'error',
        })
      },
    }
  )

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
          joinDate: user.joinDate ? userTofind.joinDate : undefined,
          lastReviewDate: user.lastReviewDate
            ? moment.utc(user.lastReviewDate).format()
            : undefined,
          exitDate: user.exitDate
            ? moment.utc(user.exitDate).format()
            : undefined,
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
    setRole(roleId)
  }

  const handlePositionChange = (positionId) => {
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

  const handleResetAllocatedLeaves = () => {
    resetLeavesMutation.mutate({currentQuarter: quarterQuery?.data?.name})
  }
  const handleRowSelect = (rows) => {
    setSelectedRows(rows)
  }

  const handleSwitchToUser = async (user) => {
    dispatch(switchUser())
    const response = await getMyProfile(user?._id)
    const admin = getLocalStorageData('user_id')
    localStorage.setItem('admin', JSON.stringify({user: admin}))
    localStorage.setItem(
      'user_id',
      JSON.stringify({user: response?.data?.data?.data[0]})
    )
    dispatch(switchedUser())
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
        currentQuarter={quarterQuery}
      />
      <Card title="Co-workers">
        <AccessWrapper noAccessRoles={CO_WORKERS_SEARCH_IMPORT_NO_ACCESS}>
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
              <AccessWrapper
                noAccessRoles={CO_WORKERS_RESET_ALLOCATEDLEAVES_NO_ACCESS}
              >
                <Popconfirm
                  title={`Are you sure to reset allocated leaves?`}
                  onConfirm={handleResetAllocatedLeaves}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button className="gx-btn gx-btn-primary gx-text-white gx-mb-1">
                    Reset Allocated Leaves
                  </Button>
                </Popconfirm>
              </AccessWrapper>
            </div>
            <div className="gx-d-flex gx-justify-content-between gx-flex-row ">
              <Form layout="inline" form={form}>
                <FormItem className="direct-form-search margin-1r">
                  <Select
                    placeholderClass={PLACE_HOLDER_CLASS}
                    placeholder="Select Role"
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
                noAccessRoles={CO_WORKERS_RESET_ALLOCATEDLEAVES_NO_ACCESS}
              >
                <div className="gx-btn-form">
                  <Button
                    className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                    onClick={() => setOpenImport(true)}
                  >
                    Import
                  </Button>
                  {data?.status && (
                    <CSVLink
                      filename={'co-workers'}
                      data={[
                        [
                          'Name',
                          'Email',
                          'Role',
                          'RoleId',
                          'Position',
                          'PositionId',
                          'DOB',
                          'Join Date',
                        ],
                        ...data?.data?.data?.data
                          ?.filter((x) => selectedRows.includes(x?._id))
                          ?.map((d) => [
                            d?.name,
                            d?.email,
                            d?.role?.value,
                            d?.role?._id,
                            d?.position?.name,
                            d?.position?._id,
                            changeDate(d?.dob),
                            changeDate(d?.joinDate),
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
        </AccessWrapper>
        <Table
          locale={{emptyText}}
          className="gx-table-responsive"
          columns={CO_WORKERCOLUMNS(
            sort,
            handleToggleModal,
            handleSwitchToUser,
            mutation,
            disableUserMmutation,
            user.role.key
          )}
          dataSource={formattedUsers(
            data?.data?.data?.data,
            user?.role?.key === 'admin'
          )}
          onChange={handleTableChange}
          rowSelection={{
            onChange: handleRowSelect,
            selectedRowKeys: selectedRows,
          }}
          pagination={{
            current: page.page,
            pageSize: page.limit,
            pageSizeOptions: ['20', '50', '80'],
            showSizeChanger: true,
            total: data?.data?.data?.count || 1,
            onShowSizeChange,
            hideOnSinglePage: data?.data?.data?.count ? false : true,
            onChange: handlePageChange,
          }}
          loading={
            mutation.isLoading ||
            isFetching ||
            resetLeavesMutation.isLoading ||
            disableUserMmutation.isLoading
          }
        />
      </Card>
    </div>
  )
}

export default CoworkersPage
