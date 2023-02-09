import {Col, Row} from 'antd'
import IconAndNumber from 'components/Modules/Metrics/IconAndNumber'
import IconAndInfoCard from 'components/Modules/Metrics/IconAndInfoCard'
import React from 'react'
import useWindowsSize from 'hooks/useWindowsSize'

function QuarterlyLeavesRemainingAndAppliedCards({
  firstType,
  secondType,
  firstNumber,
  secondNumber,
  approvedLeaves,
}) {
  const {innerWidth} = useWindowsSize()
  return (
    <Row>
      <Col xl={12} sm={12} xs={24} className="gx-col-full">
        <IconAndInfoCard
          cardColor="cyan"
          icon="product-list"
          firstType="Days Remaining"
          secondType="Leave adjustment"
          firstTypeCount={firstNumber}
          secondTypeCount={secondNumber}
          style={{minHeight: '125px'}}
        />
      </Col>
      <Col xl={12} sm={12} xs={24} className="gx-col-full">
        <IconAndInfoCard
          cardColor="orange"
          icon="tasks"
          firstType="Sick"
          secondType="Casual"
          title={secondType}
          firstTypeCount={approvedLeaves.sickLeaves}
          secondTypeCount={approvedLeaves.casualLeaves}
          style={innerWidth < 1600 ? {minHeight: '135px'} : {}}
        />
      </Col>
    </Row>
  )
}

export default QuarterlyLeavesRemainingAndAppliedCards
