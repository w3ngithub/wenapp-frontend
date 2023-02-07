import {Col, Row} from 'antd'
import IconAndNumber from 'components/Modules/Metrics/IconAndNumber'
import IconAndInfoCard from 'components/Modules/Metrics/IconAndInfoCard'
import React from 'react'

function QuarterlyLeavesRemainingAndAppliedCards({
  firstType,
  secondType,
  firstNumber,
  secondNumber,
  approvedLeaves,
}) {
  return (
    <Row>
      <Col xl={12} sm={12} xs={24} className="gx-col-full">
        <IconAndNumber
          cardColor="cyan"
          icon="product-list"
          number={firstNumber}
          text={firstType}
        />
      </Col>
      <Col xl={12} sm={12} xs={24} className="gx-col-full">
        <IconAndInfoCard
          cardColor="orange"
          icon="tasks"
          firstType="Sick"
          secondType="Casual"
          number={secondNumber}
          title={secondType}
          firstTypeCount={approvedLeaves.sickLeaves}
          secondTypeCount={approvedLeaves.casualLeaves}
        />
      </Col>
    </Row>
  )
}

export default QuarterlyLeavesRemainingAndAppliedCards
