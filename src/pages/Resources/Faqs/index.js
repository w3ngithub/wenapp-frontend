import React, {useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {Card} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import {getAllFaqs} from 'services/resources'
import {notification} from 'helpers/notification'
import Collapse from 'components/Elements/Collapse'

function Faqs() {
  const {data, isLoading, isError} = useQuery(['faqs'], getAllFaqs)

  useEffect(() => {
    if (isError) {
      notification({message: 'Could not load Users!', type: 'error'})
    }
  }, [isError])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <Card title="FAQS">
      <Collapse data={data?.data?.data?.data} />
    </Card>
  )
}

export default Faqs
