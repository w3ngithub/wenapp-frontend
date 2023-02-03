import {useEffect, useState} from 'react'
import {useMutation, useQuery} from '@tanstack/react-query'
import {Button, DatePicker, Form, Popconfirm} from 'antd'
import Select from 'components/Elements/Select'
import {PLACE_HOLDER_CLASS} from 'constants/Common'
import {ADMINISTRATOR} from 'constants/UserNames'
import {filterSpecificUser, getIsAdmin, handleResponse} from 'helpers/utils'
import React from 'react'
import {getAllUsers, resetAllocatedLeaves} from 'services/users/userDetails'
import CommonQuarters from './Common'
import AccessWrapper from 'components/Modules/AccessWrapper'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {socket} from 'pages/Main'
import {notification} from 'helpers/notification'
import {getQuarters} from 'services/leaves'
import moment from 'moment'
import {getUserLeavesSummary} from 'services/reports'
import {getLeaveQuarter} from 'services/settings/leaveQuarter'
import CircularProgress from 'components/Elements/CircularProgress'
import SummaryTable from './SummaryTable'

function SummaryReport() {
  const {
    role: {key, permission},
  } = useSelector(selectAuthUser)
  const [form] = Form.useForm()
  const FormItem = Form.Item

  const usersQuery = useQuery(['users'], () => getAllUsers({sort: 'name'}))
  const [user, setUser] = useState(undefined)
  const [quarter, setQuarter] = useState(undefined)
  const [yearSelected, setYearSelected] = useState(
    new Date().getFullYear().toString()
  )
  const coWorkersPermissions = permission?.['Co-Workers']

  const handleUserChange = (user) => {
    setUser(user)
  }

  const handleQuarterChange = (quarter) => {
    setQuarter(quarter)
  }

  // const quarterQuery = useQuery(['quarters'], getQuarters, {
  //   select: (res) => {
  //     const ongoingQuarter = Object.entries(res.data?.data?.data[0]).find(
  //       (quarter) =>
  //         new Date(quarter[1].fromDate) <=
  //           new Date(moment.utc(moment(new Date()).startOf('day')).format()) &&
  //         new Date(moment.utc(moment(new Date()).startOf('day')).format()) <=
  //           new Date(quarter[1].toDate)
  //     )

  //     return {
  //       name: ongoingQuarter[0],
  //       ...ongoingQuarter[1],
  //     }
  //   },
  // })

  const resetLeavesMutation = useMutation(
    (payload) => resetAllocatedLeaves(payload),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Allocated leaves reset of all user Successfully',
          'Could not reset allocated leaves',
          [
            // () => refetch(),
            () => {
              socket.emit('CUD')
            },
          ]
        ),
      onError: (error) => {
        notification({
          message: 'Could not reset allocated leaves',
          type: 'error',
        })
      },
    }
  )
  const {
    data: leaveQuarters,
    isLoading: leaveQuarterLoading,
    refetch,
  } = useQuery(
    ['leaveQuarter', yearSelected],
    () => getLeaveQuarter(yearSelected),
    {
      enabled: !!yearSelected,
    }
  )

  const leavesSummaryQuery = useQuery(
    ['leavesSummary', yearSelected, user, quarter],
    () =>
      getUserLeavesSummary({
        userId: user ? user : '',
        fiscalYear: `${
          yearSelected ? yearSelected + '-01-01T00:00:00.000Z' : ''
        }`,
        quarterId: quarter ? quarter : '',
      }),
    {
      enabled: !!yearSelected,
    }
  )

  const handleResetAllocatedLeaves = () => {
    // resetLeavesMutation.mutate({currentQuarter: quarterQuery?.data?.name})
  }

  const yearChangeHandler = (value) => {
    setQuarter(undefined)
    if (value) {
      setYearSelected(value?.format()?.split('-')?.[0])
    } else {
      setYearSelected(undefined)
      setUser(undefined)
      form.setFieldsValue({quarters: undefined, coWorkers: undefined})
    }
  }

  useEffect(() => {
    form.setFieldValue('selectedYear', moment().year(Number))
  }, [])

  useEffect(() => {
    if (leaveQuarters?.status) {
      setQuarter(leaveQuarters?.data?.data?.data?.[0]?.quarters?.[0]?._id)
      form.setFieldValue(
        'quarters',
        leaveQuarters?.data?.data?.data?.[0]?.quarters?.[0]?._id
      )
    }
  }, [leaveQuarters])

  return (
    <>
      <div className="gx-d-flex gx-justify-content-between gx-flex-row ">
        <Form layout="inline" form={form}>
          <FormItem className="direct-form-search margin-1r" name="quarters">
            <Select
              placeholderClass={PLACE_HOLDER_CLASS}
              placeholder="Select Quarter"
              onChange={handleQuarterChange}
              value={quarter}
              options={leaveQuarters?.data?.data?.data?.[0]?.quarters?.map(
                (quarter) => ({
                  id: quarter?._id,
                  value: quarter?.quarterName,
                })
              )}
            />
          </FormItem>
          <FormItem className="direct-form-search" name="coWorkers">
            <Select
              placeholderClass={PLACE_HOLDER_CLASS}
              placeholder="Select Co-Worker"
              value={user}
              options={filterSpecificUser(
                usersQuery?.data?.data?.data?.data,
                ADMINISTRATOR
              )?.map((x) => ({
                id: x._id,
                value: x.name,
              }))}
              onChange={handleUserChange}
            />
          </FormItem>
          <FormItem className="direct-form-search" name="selectedYear">
            <DatePicker
              className=" gx-w-100"
              picker="year"
              onChange={yearChangeHandler}
            />
          </FormItem>
        </Form>
        {!getIsAdmin() && (
          <AccessWrapper role={coWorkersPermissions?.resetAllocatedLeaves}>
            <Popconfirm
              title={`Are you sure to reset allocated leaves?`}
              onConfirm={handleResetAllocatedLeaves}
              okText="Yes"
              cancelText="No"
            >
              <Button className="gx-btn gx-btn-primary gx-text-white gx-mb-4">
                Reset Allocated Leaves
              </Button>
            </Popconfirm>
          </AccessWrapper>
        )}
      </div>
      {/* {leaveQuarterLoading ? (
        <CircularProgress className="" />
      ) : (
        <CommonQuarters />
      )} */}
      <SummaryTable data={leavesSummaryQuery?.data?.data?.data} />
    </>
  )
}

export default SummaryReport
