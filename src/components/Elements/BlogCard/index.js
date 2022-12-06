import React, {useEffect, useState} from 'react'
import {Popconfirm, Tag} from 'antd'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import moment from 'moment'
import parse from 'html-react-parser'

import {Link, useNavigate} from 'react-router-dom'
import {getIsAdmin} from 'helpers/utils'

const BlogItem = ({blog, grid, removeBlog, access}) => {
  const {title, content, createdBy, createdAt, blogCategories, _id, slug} = blog

  const navigate = useNavigate()
  // var regexp = /<img([\w\W]+?)>/g
  // const text = content.match(regexp)

  // const imgageBlog = text?.filter((img) =>
  //   img?.includes(`alt=\"undefined\"`)
  // )[0]
  // const imgSrc = imgageBlog?.split('src=')[1]?.split(' ')[0]?.replace(`"`, '')

  const [parsedContent, setParsedContent] = useState(
    parse(content.substring(0, 400))
  )
  const [filteredContent, setFilteredContent] = useState('')
  const [parserResetter, setParserResetter] = useState(true)
  const parser = () => {
    if (parsedContent?.length && typeof parsedContent === 'object') {
      const contents = parsedContent
        .filter((item) => item?.type !== 'img')
        .filter((item) => item !== '\n')
        .filter((item) => item?.props?.children !== null)

      const contents1 = contents.filter((item) => {
        if (typeof item?.props?.children === 'string') {
          if (item.props.children.trim() !== '') {
            return item
          } else {
            return null
          }
        } else {
          return item
        }
      })

      setFilteredContent(contents1)
      if (contents1.length === 0 && parserResetter) {
        setParserResetter(false)
        setParsedContent(
          parse(content.substring(400, content.length)).slice(1, 3)
        )
      }
    } else {
      setFilteredContent(parsedContent)
    }
  }
  useEffect(() => {
    parser()
  }, [parsedContent])

  return (
    <div
      className={`gx-product-item  ${
        grid ? 'gx-product-vertical ' : 'gx-product-horizontal '
      } ${
        moment() < moment(createdAt).add(1, 'days')
          ? 'latest-events'
          : 'old-events'
      }
      `}
    >
      {/* {imgSrc && (
        <div className="gx-product-image" >
          <div className="gx-grid-thumb-equal">
            <span className="gx-link gx-grid-thumb-cover">
              <img alt="blogPicture" src={imgSrc} width={300} height={200} onClick={() => navigate(`${_id}-${slug}`)}/>
            </span>
          </div>
        </div>
      )} */}
      <div className="gx-product-body">
        <h3
          className="gx-product-title clickable-title"
          onClick={() => navigate(`${_id}-${slug}`)}
        >
          {title}
        </h3>
        <div className="ant-row-flex">
          <small className="gx-text-grey">
            <EditOutlined />
            {' ' + createdBy.name} - {moment(createdAt).format('LL')}
          </small>
          <h6 className="gx-text-success gx-mb-1 gx-mt-1">
            {blogCategories?.map((x) => (
              <Tag color="cyan" key={x._id}>
                {x.name}
              </Tag>
            ))}
          </h6>
        </div>

        <p>
          {filteredContent}...<Link to={`${_id}-${slug}`}> Read More</Link>
        </p>
      </div>
      <div className="gx-footer gx-d-flex gx-justify-content-end ">
        {access && !getIsAdmin() && (
          <Popconfirm
            title="Are you sure to delete this Blog?"
            onConfirm={() => removeBlog(_id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              style={{
                color: 'red',
                marginRight: '0.5rem',
                marginBottom: '0.5rem',
              }}
            />
          </Popconfirm>
        )}
      </div>
    </div>
  )
}

export default BlogItem
