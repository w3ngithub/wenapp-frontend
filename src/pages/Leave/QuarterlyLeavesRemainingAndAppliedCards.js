import {Col, Row} from 'antd'
import IconAndNumber from 'components/Modules/Metrics/IconAndNumber'
import React from 'react'

function QuarterlyLeavesRemainingAndAppliedCards({firstType, secondType, firstNumber, secondNumber}) {
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
        <IconAndNumber
          cardColor="orange"
          icon="tasks"
          number={secondNumber}
          text={secondType}
        />
      </Col>
    </Row>
  )
}

export default QuarterlyLeavesRemainingAndAppliedCards
