import React from 'react'
import Widget from 'components/Elements/Widget/index'
import {connect} from 'react-redux'
import {Col, Row} from 'antd'

const IconAndInfoCard = props => {
  const {
    icon,
    title,
    cardColor,
    firstType,
    firstTypeCount,
    secondType,
    secondTypeCount,
  } = props
  let {iconColor} = props
  // if (props.themeType === THEME_TYPE_DARK) {
  iconColor = 'white'
  // }

  return (
    <Widget styleName={`gx-bg-${cardColor}`}>
      <div style={{marginTop: 0, marginLeft: '1rem'}}>
        <Row>
          <p
            className={`gx-text-${iconColor}`}
          >
            {title}
          </p>
        </Row>
        <Row>
          <Col>
            <div className="gx-mr-lg-4 gx-mr-3">
              <i
                className={`icon icon-${icon} gx-fs-xlxl gx-text-${iconColor} gx-d-flex`}
                style={{fontSize: 45}}
              />
            </div>
          </Col>

          <Col>
            <div className="gx-media-body">
              <div
                style={{display: 'flex', gap: '2rem', marginBottom: '0.2rem'}}
              >
                <p className={`gx-mb-0 gx-text-${iconColor}`}>{firstType}</p>
                <p className={`gx-mb-0 gx-text-${iconColor}`}>
                  {firstTypeCount}
                </p>
              </div>
              <div style={{display: 'flex', gap: '0.9rem'}}>
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
