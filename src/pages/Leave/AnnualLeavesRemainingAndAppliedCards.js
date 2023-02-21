import {Col, Row} from 'antd'
import IconAndInfoCard from 'components/Modules/Metrics/IconAndInfoCard'
import InfoCard from 'components/Modules/Metrics/InfoCard'
import React from 'react'

function AnnualLeavesRemainingAndAppliedCards(props) {
  const {YearlyLeaveExceptCasualandSick} = props
  const hasMoreLeaves = YearlyLeaveExceptCasualandSick?.length > 0
  return (
    <Row gutter={[20, 20]}>
      <Col
        xxl={hasMoreLeaves ? 8 : 12}
        lg={hasMoreLeaves ? 8 : 12}
        xl={8}
        md={12}
        sm={12}
        xs={24}
        className="gx-col-full"
      >
        <IconAndInfoCard
          cardColor="cyan"
          icon="product-list"
          title={props.firstTitle}
          firstTypeCount={props.sickDayRemaining}
          secondTypeCount={props.casualDayRemaining}
          {...props}
        />
      </Col>
      <Col
        xxl={hasMoreLeaves ? 8 : 12}
        lg={hasMoreLeaves ? 8 : 12}
        xl={8}
        sm={12}
        xs={24}
        md={12}
        className="gx-col-full"
      >
        <IconAndInfoCard
          cardColor="orange"
          icon="tasks"
          title={props.secondTitle}
          firstTypeCount={props.sickDayApplied}
          secondTypeCount={props.casualDayApplied}
          {...props}
        />
      </Col>
      {hasMoreLeaves && (
        <Col lg={8} xl={8} sm={12} xs={24} md={8} className="gx-col-full">
          <InfoCard
            cardColor="orange"
            icon="tasks"
            title={props.secondTitle}
            firstTypeCount={props.sickDayApplied}
            secondTypeCount={props.casualDayApplied}
            {...props}
          />
        </Col>
      )}
    </Row>
  )
}

export default AnnualLeavesRemainingAndAppliedCards
