import React from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useQuery} from '@tanstack/react-query'
import {Button, Card} from 'antd'
import HTMLReactParser from 'html-react-parser'
import {EditOutlined} from '@ant-design/icons'
import {getBlog} from 'services/blog'
import BlogsBreadCumb from './BlogsBreadCumb'
import CircularProgress from 'components/Elements/CircularProgress'
import moment from 'moment'
import {LOCALSTORAGE_USER} from 'constants/Settings'

function Detail() {
  // init hooks
  const {blog} = useParams()
  const navigate = useNavigate()

  const [blogId] = blog.split('-')

  const userData = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER) || {})

  const {data, isLoading} = useQuery(['singleBlog', blogId], () =>
    getBlog(blogId)
  )

  const BLOG = data?.data?.data?.data?.[0]
  const access = userData?.user?._id === BLOG?.createdBy._id

  const handleEdit = () => {
    navigate(`/blog/edit-blog/${blog}`)
  }

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <div>
      <BlogsBreadCumb slug={BLOG?.title} />
      <div style={{marginTop: 20}}></div>
      <Card
        title={
          <>
            <div className="gx-d-flex gx-justify-content-between gx-flex-row">
              <div>
                <div>
                  <h2>{BLOG?.title}</h2>
                </div>
                <small className="gx-text-grey gx-mr-3">
                  <EditOutlined />
                  {' ' + BLOG?.createdBy?.name} -{' '}
                  {moment(BLOG?.createdAt).format('LL')}
                </small>
              </div>
              {access && (
                <Button
                  type="primary"
                  onClick={handleEdit}
                  className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                >
                  Edit
                </Button>
              )}
            </div>
          </>
        }
      >
        <div>
          <div>{HTMLReactParser(BLOG?.content || '')}</div>
        </div>
      </Card>
    </div>
  )
}

export default Detail
