import {Col, Row} from 'antd'
import IconAndInfoCard from 'components/Modules/Metrics/IconAndInfoCard'
import React from 'react'

function AnnualLeavesRemainingAndAppliedCards(props) {
  return (
    <Row>
      <Col xl={12} sm={12} xs={24} className="gx-col-full">
        <IconAndInfoCard
          cardColor="cyan"
          icon="product-list"
          title={props.firstTitle}
          firstTypeCount={props.sickDayRemaining}
          secondTypeCount={props.casualDayRemaining}
          {...props}
        />
      </Col>
      <Col xl={12} sm={12} xs={24} className="gx-col-full">
        <IconAndInfoCard
          cardColor="orange"
          icon="tasks"
          title={props.secondTitle}
          firstTypeCount={props.sickDayApplied}
          secondTypeCount={props.casualDayApplied}
          {...props}
        />
      </Col>
    </Row>
  )
}

export default AnnualLeavesRemainingAndAppliedCards
