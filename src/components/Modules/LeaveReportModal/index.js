import React from 'react'
import {Button, Form, Modal, Tabs} from 'antd'
import UpdateForm from 'pages/Reports/LeaveReport/UpdateForm'
import {notification} from 'helpers/notification'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {updateUser} from 'services/users/userDetails'
import {handleResponse} from 'helpers/utils'
import {socket} from 'pages/Main'
import {updatUserAllocatedLeaves} from 'services/reports'

function LeaveReportModal({toggle, closeModal, userDetails, quarterId}) {
  const queryClient = useQueryClient()

  const TabPane = Tabs.TabPane

  const userMutation = useMutation(
    (updatedUser) => updateUser(updatedUser.userId, updatedUser.updatedData),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          "User's Leave Adjustment Balance Updated Successfully",
          "Could not update User's Leave Adjustment Balance",
          [
            () => queryClient.invalidateQueries(['leavesSummary']),
            () => closeModal(),
            () => {
              socket.emit('CUD')
            },
          ]
        ),
      onError: (error) => {
        notification({
          message: "Could not update User's Leave Adjustment Balance",
          type: 'error',
        })
      },
    }
  )

  const allocatedLeavesMutation = useMutation(
    ({id, fiscalYear, allocatedLeaves, quarterId}) =>
      updatUserAllocatedLeaves({id, fiscalYear, allocatedLeaves, quarterId}),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          "User's Allocated Leaves Updated Successfully",
          "Could not update User's Allocated Leaves",
          [
            () => queryClient.invalidateQueries(['leavesSummary']),
            () => closeModal(),
            () => {
              socket.emit('CUD')
            },
          ]
        ),
      onError: (error) => {
        notification({
          message: "Could not update User's Allocated Leaves",
          type: 'error',
        })
      },
    }
  )

  const handleLeaveAdjustmentBalance = (adjustmentBalance) => {
    try {
      userMutation.mutate({
        userId: userDetails?.user._id,
        updatedData: {
          ...userDetails?.user,
          leaveadjustmentBalance: adjustmentBalance.input,
        },
      })
    } catch (error) {
      notification({
        message: "Could not update User's Leave Adjustment Balance!",
        type: 'error',
      })
    }
  }

  const handleAllocatedLeaveUpdate = (value) => {
    try {
      allocatedLeavesMutation.mutate({
        id: userDetails?._id,
        quarterId,
        allocatedLeaves: +value?.input,
      })
    } catch (err) {
      notification({
        message: "Could not update User's allocated leaves",
        type: 'error',
      })
    }
  }

  return (
    <Modal
      visible={toggle}
      closable={false}
      mask={false}
      width={500}
      onCancel={closeModal}
      footer={[
        <Button key="back" onClick={closeModal}>
          Cancel
        </Button>,
      ]}
    >
      <Tabs type="card">
        <TabPane tab="Update Allocated Leaves" key="1">
          <UpdateForm
            title="Allocated Leaves"
            initialValue={userDetails?.allocatedLeaves}
            handleSubmit={handleAllocatedLeaveUpdate}
            name={userDetails?.user?.name}
            loading={allocatedLeavesMutation?.isLoading}
          />
        </TabPane>

        <TabPane tab="Update Leave Adjustment Balance" key="2">
          <UpdateForm
            title="Leave Adjustment Balance"
            initialValue={userDetails?.user?.leaveadjustmentBalance}
            handleSubmit={handleLeaveAdjustmentBalance}
            name={userDetails?.user?.name}
            loading={userMutation?.isLoading}
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default LeaveReportModal
