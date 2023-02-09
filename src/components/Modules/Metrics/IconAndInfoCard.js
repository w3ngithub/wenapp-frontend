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
    style,
    showIcon = true,
    bodyStyle = {},
  } = props
  let {iconColor} = props
  // if (props.themeType === THEME_TYPE_DARK) {
  iconColor = 'white'
  // }
  const {innerWidth} = useWindowsSize()

  const styleObject =
    !title && innerWidth > 1600
      ? {
          row: {
            marginTop: '17px',
          },
          icon: {
            marginBottom: '10px',
          },
        }
      : {}

  return (
    <Widget
      styleName={`gx-bg-${cardColor}`}
      style={style}
      bodyStyle={bodyStyle}
    >
      <div style={{marginLeft: '1rem'}}>
        {title && (
          <Row>
            <p className={`gx-text-${iconColor}`}>{title}</p>
          </Row>
        )}

        <Row style={styleObject?.row}>
          {showIcon && (
            <Col>
              <div className="gx-mr-lg-4 gx-mr-3">
                <i
                  className={`icon icon-${icon} gx-fs-xlxl gx-text-${iconColor} gx-d-flex`}
                  style={{fontSize: 45, marginBottom: '5px'}}
                />
              </div>
            </Col>
          )}

          <Col>
            <div
              className="gx-d-flex gx-justify-content-between"
              style={{gap: '2rem', marginBottom: '0.2rem'}}
            >
              <p className={`gx-mb-0 gx-text-${iconColor}`} style={{flex: 1}}>
                {firstType}
              </p>
              <p className={`gx-mb-0 gx-text-${iconColor}`}>{firstTypeCount}</p>
            </div>
            {(secondTypeCount > 0 || title) && (
              <div className="gx-d-flex gx-justify-content-between">
                <p className={`gx-mb-0 gx-text-${iconColor}`}>{secondType}</p>
                <p className={`gx-mb-0 gx-text-${iconColor}`}>
                  {secondTypeCount}
                </p>
              </div>
            )}
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
