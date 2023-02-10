import {useEffect, useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Button, DatePicker, Form, Popconfirm} from 'antd'
import Select from 'components/Elements/Select'
import {PLACE_HOLDER_CLASS} from 'constants/Common'
import {ADMINISTRATOR} from 'constants/UserNames'
import {filterSpecificUser, getIsAdmin, handleResponse} from 'helpers/utils'
import React from 'react'
import {getAllUsers, resetAllocatedLeaves} from 'services/users/userDetails'
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

  const currentYear = new Date().getFullYear().toString()
  const queryClient = useQueryClient()

  const usersQuery = useQuery(['users'], () => getAllUsers({sort: 'name'}))
  const [user, setUser] = useState(undefined)
  const [quarter, setQuarter] = useState(undefined)
  const [yearSelected, setYearSelected] = useState(currentYear)
  const coWorkersPermissions = permission?.['Co-Workers']

  const handleUserChange = (user) => {
    setUser(user)
  }

  const handleQuarterChange = (quarter) => {
    setQuarter(quarter)
  }

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

  const resetLeavesMutation = useMutation(
    (payload) => resetAllocatedLeaves(payload),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Allocated leaves reset of all user Successfully',
          'Could not reset allocated leaves',
          [
            () => queryClient.invalidateQueries(['leavesSummary']),
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

  const handleResetAllocatedLeaves = () => {
    resetLeavesMutation.mutate()
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

  const handleResetFilter = () => {
    setYearSelected(currentYear)
    setUser(undefined)
    form.setFieldsValue({selectedYear: moment().year(Number), coWorkers: ''})
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
              allowClear={false}
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
              allowClear={false}
              className=" gx-w-100"
              picker="year"
              onChange={yearChangeHandler}
            />
          </FormItem>
          <FormItem style={{marginBottom: '3px'}}>
            <Button
              className="gx-btn-primary gx-text-white"
              onClick={handleResetFilter}
            >
              Reset
            </Button>
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
              <Button
                className={
                  resetLeavesMutation?.isLoading
                    ? ''
                    : `gx-btn-primary gx-text-white gx-mb-4`
                }
                disabled={resetLeavesMutation?.isLoading}
              >
                Reset Allocated Leaves
              </Button>
            </Popconfirm>
          </AccessWrapper>
        )}
      </div>

      {leavesSummaryQuery?.isLoading || resetLeavesMutation?.isLoading ? (
        <CircularProgress className="" />
      ) : (
        <SummaryTable
          data={leavesSummaryQuery?.data?.data?.data}
          quarterId={quarter}
        />
      )}
    </>
  )
}

export default SummaryReport
