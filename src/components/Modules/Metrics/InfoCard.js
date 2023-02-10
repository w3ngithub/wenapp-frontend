import React from 'react'
import Widget from 'components/Elements/Widget/index'
import {connect} from 'react-redux'
import {Col, Row} from 'antd'
import useWindowsSize from 'hooks/useWindowsSize'

const InfoCard = (props) => {
  const {icon, title, cardColor, YearlyLeaveExceptCasualandSick, style} = props
  let {iconColor} = props
  // if (props.themeType === THEME_TYPE_DARK) {
  iconColor = 'white'

  const {innerWidth} = useWindowsSize()
  return (
    <Widget
      styleName={`gx-bg-${cardColor} no-margin non-casual-sick-leave-card`}
      style={{height: '100%'}}
    >
      <div
        style={{marginLeft: '2rem', height: '100%', justifyContent: 'center'}}
        className="gx-flex-column"
      >
        <Row>
          <p className={`gx-text-${iconColor}`} style={{marginLeft: '1rem'}}>
            {title}
          </p>
        </Row>
        <Row>
          <Col lg={24} sm={24} xs={24} md={24} className="gx-p-0">
            {YearlyLeaveExceptCasualandSick?.map((data, index) => (
              <div key={index} className="gx-media-body">
                <div
                  key={index}
                  className="gx-d-flex gx-align-content-between"
                  style={{
                    marginBottom: '0.2rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <p
                    className={`gx-mb-0 gx-text-${iconColor}`}
                    style={{flex: 0.8}}
                  >
                    {data[0]?.replace('Leave', '')}
                  </p>
                  <p className={`gx-mb-0 gx-text-${iconColor}`}>{data[1]}</p>
                </div>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </Widget>
  )
}

const mapStateToProps = ({settings}) => {
  const {themeType} = settings
  return {themeType}
}
export default connect(mapStateToProps, null)(InfoCard)
