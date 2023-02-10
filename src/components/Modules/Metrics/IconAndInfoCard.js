import React from 'react'
import Widget from 'components/Elements/Widget/index'
import {connect} from 'react-redux'
import {Col, Row} from 'antd'
import useWindowsSize from 'hooks/useWindowsSize'

const IconAndInfoCard = (props) => {
  const {
    icon,
    title,
    cardColor,
    firstType,
    firstTypeCount,
    secondType,
    secondTypeCount,
    nonCasualSickLeaveCardHeight,
  } = props
  let {iconColor} = props
  // if (props.themeType === THEME_TYPE_DARK) {
  iconColor = 'white'
  // }
  const {innerWidth} = useWindowsSize()
  return (
    <Widget
      styleName={`gx-bg-${cardColor} no-margin`}
      style={{height: nonCasualSickLeaveCardHeight}}
    >
      <div
        style={{marginLeft: '2rem', height: '100%', justifyContent: 'center'}}
        className="gx-flex-column"
      >
        <Row>
          <p className={`gx-text-${iconColor}`}>{title}</p>
        </Row>
        <Row>
          <Col>
            <div className="gx-mr-lg-4 gx-mr-3">
              <i
                className={`icon icon-${icon} gx-fs-xlxl gx-text-${iconColor} gx-d-flex`}
                style={{
                  fontSize: 45,
                  marginLeft: icon === 'tasks' ? '-7px' : '',
                }}
              />
            </div>
          </Col>

          <Col>
            <div className="gx-media-body">
              <div
                className="gx-d-flex"
                style={{gap: '2rem', marginBottom: '0.2rem'}}
              >
                <p className={`gx-mb-0 gx-text-${iconColor}`} style={{flex: 1}}>
                  {firstType}
                </p>
                <p className={`gx-mb-0 gx-text-${iconColor}`}>
                  {firstTypeCount}
                </p>
              </div>
              <div className="gx-d-flex" style={{gap: '0.9rem'}}>
                <p className={`gx-mb-0 gx-text-${iconColor}`}>{secondType}</p>
                <p className={`gx-mb-0 gx-text-${iconColor}`}>
                  {secondTypeCount}
                </p>
              </div>
            </div>
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
export default connect(mapStateToProps, null)(IconAndInfoCard)
