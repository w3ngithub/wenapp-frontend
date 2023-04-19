import React, {useEffect, useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import '@ant-design/compatible/assets/index.css'
import {Card, Table, Input, Button, Form} from 'antd'
import CircularProgress from 'components/Elements/CircularProgress'
import {
  changeDate,
  getIsAdmin,
  handleResponse,
  MuiFormatDate,
} from 'helpers/utils'
import {
  addProject,
  deleteProject,
  getAllProjects,
  getProjectClients,
  getProjectStatus,
  getProjectTypes,
  updateProject,
} from 'services/projects'
import {POSITION_TYPES, PROJECT_COLUMNS} from 'constants/Projects'
import ProjectModal from 'components/Modules/ProjectModal'
import {useNavigate, useSearchParams} from 'react-router-dom'
import moment from 'moment'
import {notification} from 'helpers/notification'
import {getAllUsers, getUserPositionTypes} from 'services/users/userDetails'
import useWindowsSize from 'hooks/useWindowsSize'
import AccessWrapper from 'components/Modules/AccessWrapper'
import Select from 'components/Elements/Select'
import {PLACE_HOLDER_CLASS} from 'constants/Common'
import {emptyText} from 'constants/EmptySearchAntd'
import {useSelector} from 'react-redux'
import {selectAuthUser} from 'appRedux/reducers/Auth'
import {socket} from 'pages/Main'
import {getProjectTags} from 'services/projects'

const Search = Input.Search
const FormItem = Form.Item

const formattedProjects = (projects) => {
  return projects?.map((project) => ({
    ...project,
    key: project._id,
    projectStatus: project.projectStatus?.name,
    projectTypes: project.projectTypes?.map((x) => (
      <p style={{margin: 0}}>{x?.name}</p>
    )),
    startDate: project?.startDate ? changeDate(project?.startDate) : '',
    endDate: project?.endDate ? changeDate(project?.endDate) : '',
  }))
}

function ProjectsPage() {
  // init hooks
  let [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState({})
  const {innerWidth} = useWindowsSize()
  const [form] = Form.useForm()
  const [project, setProject] = useState(searchParams?.get('search') || '')
  const [page, setPage] = useState({page: 1, limit: 25})
  const [projectStatus, setProjectStatus] = useState(
    searchParams.get('statusId') || undefined
  )
  const [projectTags, setProjectTags] = useState(
    searchParams?.get('tagId') || undefined
  )
  const [projectType, setProjectType] = useState(
    searchParams?.get('typeId') || undefined
  )
  const [projectClient, setprojectClient] = useState(
    searchParams?.get('clientId') || undefined
  )
  const [developer, setDeveloper] = useState(
    searchParams?.get('developerId') || undefined
  )
  const [designer, setDesigner] = useState(
    searchParams?.get('designerId') || undefined
  )
  const [qa, setQa] = useState(searchParams?.get('qaId') || undefined)
  const [openUserDetailModal, setOpenUserDetailModal] = useState(false)
  const [userRecord, setUserRecord] = useState({})
  const [readOnly, setReadOnly] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [projectName, setProjectName] = useState(
    searchParams?.get('search') || ''
  )
  const [positionTypeData, setPositionTypeData] = useState({})
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    role: {key, permission},
  } = useSelector(selectAuthUser)

  const {data: projectTypesData} = useQuery(['projectTypes'], getProjectTypes)
  const {data: projectStatusData} = useQuery(
    ['projectStatus'],
    getProjectStatus
  )
  const {data: projectClientsData} = useQuery(
    ['projectClients'],
    getProjectClients
  )
  const {data: positionTypes} = useQuery(
    ['userPositionTypes'],
    getUserPositionTypes
  )
  const {data: developers} = useQuery(['developers', positionTypeData], () =>
    getAllUsers({positionType: positionTypeData?.developer, sort: 'name'})
  )
  const {data: designers} = useQuery(['designers', positionTypeData], () =>
    getAllUsers({positionType: positionTypeData?.designer, sort: 'name'})
  )
  const {data: QAs} = useQuery(['QA', positionTypeData], () =>
    getAllUsers({positionType: positionTypeData?.qa, sort: 'name'})
  )
  const {data: devops} = useQuery(['DevOps', positionTypeData], () =>
    getAllUsers({positionType: positionTypeData?.devops, sort: 'name'})
  )

  const {data: projectTagsData} = useQuery(['tags'], getProjectTags)

  const {data, isLoading, isError, isFetching} = useQuery(
    [
      'projects',
      page,
      sort,
      projectType,
      projectStatus,
      projectTags,
      projectClient,
      project,
      developer,
      designer,
      qa,
    ],
    () =>
      getAllProjects({
        ...page,
        projectType,
        projectStatus,
        projectTags,
        projectClient,
        project,
        developer,
        designer,
        qa,
        sort:
          sort.order === undefined || sort.column === undefined
            ? ''
            : sort.order === 'ascend'
            ? sort.field
            : `-${sort.field}`,
      }),
    {keepPreviousData: true}
  )

  const addProjectMutation = useMutation((project) => addProject(project), {
    onSuccess: (response) =>
      handleResponse(
        response,
        'Project Added Successfully',
        'Project addition failed',
        [
          () => queryClient.invalidateQueries(['projects']),
          () => handleCloseModal(),
          () => {
            socket.emit('CUD')
          },
        ]
      ),
    onError: (error) => {
      notification({message: 'Project addition failed!', type: 'error'})
    },
  })
  const updateProjectMutation = useMutation(
    (project) => updateProject(project?.id, project?.details),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Project Updated Successfully',
          'Project update failed',
          [
            () => queryClient.invalidateQueries(['projects']),
            () => handleCloseModal(),
            () => {
              socket.emit('CUD')
            },
          ]
        ),
      onError: (error) => {
        notification({message: 'Project update failed', type: 'error'})
      },
    }
  )

  const deleteProjectMutation = useMutation(
    (projectId) => deleteProject(projectId),
    {
      onSuccess: (response) =>
        handleResponse(
          response,
          'Project removed Successfully',
          'Project deletion failed',
          [
            () => queryClient.invalidateQueries(['projects']),
            () => {
              socket.emit('CUD')
            },
          ]
        ),
      onError: (error) => {
        notification({message: 'Project deletion failed', type: 'error'})
      },
    }
  )

  useEffect(() => {
    const types = positionTypes?.data?.data?.data

    if (types?.length > 0) {
      setPositionTypeData({
        developer: types?.find(
          (type) => type.name.toLowerCase() === POSITION_TYPES?.developer
        )?._id,
        designer: types?.find(
          (type) => type.name.toLowerCase() === POSITION_TYPES?.designer
        )?._id,
        qa: types?.find(
          (type) => type.name.toLowerCase() === POSITION_TYPES?.qa
        )?._id,
        devops: types?.find(
          (type) => type.name.toLowerCase() === POSITION_TYPES?.devops
        )?._id,
      })
    }
  }, [positionTypes])

  useEffect(() => {
    if (isError) {
      notification({message: 'Could not load Projects!', type: 'error'})
    }
  }, [isError])

  const handleUserDetailSubmit = (project) => {
    try {
      const updatedProject = {
        ...project,
        estimatedHours: project?.estimatedHours
          ? +project?.estimatedHours
          : undefined,
        startDate: project?.startDate
          ? MuiFormatDate(new Date(moment.utc(project?.startDate)?.format()))
          : undefined,
        endDate: project.endDate
          ? MuiFormatDate(new Date(moment.utc(project?.endDate)?.format()))
          : undefined,
      }
      if (isEditMode)
        updateProjectMutation.mutate({
          id: userRecord.id,
          details: updatedProject,
        })
      else addProjectMutation.mutate(updatedProject)
    } catch (error) {
      notification({message: 'Project Addition Failed', type: 'error'})
    }
  }

  const handleOpenEditModal = (projectToUpdate, mode) => {
    const originalProject = data?.data?.data?.data?.find(
      (project) => project?.id === projectToUpdate?.id
    )
    setOpenUserDetailModal((prev) => !prev)
    setUserRecord({
      id: projectToUpdate.id,
      project: {
        ...projectToUpdate,
        projectStatus: originalProject?.projectStatus,
        projectTypes: originalProject?.projectTypes,
        startDate: originalProject.startDate ?? null,
        endDate: originalProject?.endDate ?? null,
      },
    })
    setReadOnly(mode)
    setIsEditMode(true)
  }

  const handleOpenAddModal = () => {
    setOpenUserDetailModal((prev) => !prev)
    setReadOnly(false)
  }

  const handleCloseModal = () => {
    setOpenUserDetailModal((prev) => !prev)
    setUserRecord({})
    setIsEditMode(false)
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setSort(sorter)
  }

  const handlePageChange = (pageNumber) => {
    setPage((prev) => ({...prev, page: pageNumber}))
  }

  const onShowSizeChange = (_, pageSize) => {
    setPage((prev) => ({...page, limit: pageSize}))
  }

  const settingQuery = (values) => {
    let queryString = {}
    if (!values.toString()) {
      return setSearchParams({})
    }
    values.forEach((value, key) => {
      queryString = {
        ...queryString,
        [key]: value,
      }
    })
    setSearchParams(queryString)
  }

  const handleProjectTypeChange = (typeId) => {
    if (!typeId) {
      searchParams.delete('typeId')
      settingQuery(searchParams)
    } else {
      searchParams.set('typeId', typeId)
      settingQuery(searchParams)
    }
    setProjectType(typeId)
  }

  const handleProjectStatusChange = (statusId) => {
    if (!statusId) {
      searchParams.delete('statusId')
      settingQuery(searchParams)
    } else {
      searchParams.set('statusId', statusId)
      settingQuery(searchParams)
    }
    setProjectStatus(statusId)
  }

  const handleClientChange = (clientId) => {
    if (!clientId) {
      searchParams.delete('clientId')
      settingQuery(searchParams)
    } else {
      searchParams.set('clientId', clientId)
      settingQuery(searchParams)
    }
    setprojectClient(clientId)
  }

  const handleProjectTagsChange = (tagId) => {
    if (!tagId) {
      searchParams.delete('tagId')
      settingQuery(searchParams)
    } else {
      searchParams.set('tagId', tagId)
      settingQuery(searchParams)
    }
    setProjectTags(tagId)
  }
  const handleDeveloperChange = (developerId) => {
    if (!developerId) {
      searchParams.delete('developerId')
      settingQuery(searchParams)
    } else {
      searchParams.set('developerId', developerId)
      settingQuery(searchParams)
    }
    setDeveloper(developerId)
  }
  const handleDesignerChange = (designerId) => {
    if (!designerId) {
      searchParams.delete('designerId')
      settingQuery(searchParams)
    } else {
      searchParams.set('designerId', designerId)
      settingQuery(searchParams)
    }
    setDesigner(designerId)
  }
  const handleQaChange = (qaId) => {
    if (!qaId) {
      searchParams.delete('qaId')
      settingQuery(searchParams)
    } else {
      searchParams.set('qaId', qaId)
      settingQuery(searchParams)
    }
    setQa(qaId)
  }

  const handleResetFilter = () => {
    setProjectName('')
    setProject('')
    setProjectTags(undefined)
    setProjectType(undefined)
    setProjectStatus(undefined)
    setprojectClient(undefined)
    setDeveloper(undefined)
    setDesigner(undefined)
    setQa(undefined)
    setSearchParams({})
  }

  const confirmDeleteProject = (project) => {
    deleteProjectMutation.mutate(project._id)
  }

  const navigateToProjectLogs = (projectSlug) => {
    navigate(`${projectSlug}`)
  }

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <div>
      {openUserDetailModal && (
        <ProjectModal
          toggle={openUserDetailModal}
          onClose={handleCloseModal}
          onSubmit={handleUserDetailSubmit}
          loading={
            addProjectMutation?.isLoading || updateProjectMutation?.isLoading
          }
          types={projectTypesData}
          statuses={projectStatusData}
          client={projectClientsData}
          developers={developers}
          designers={designers}
          tags={projectTagsData}
          qas={QAs}
          devops={devops}
          initialValues={userRecord?.project}
          readOnly={readOnly}
          isEditMode={isEditMode}
        />
      )}

      <Card title="Projects">
        <div className="components-table-demo-control-bar">
          <div className="gx-d-flex gx-flex-row">
            {' '}
            <Search
              placeholder="Search Projects"
              onSearch={(value) => {
                if (!value) {
                  searchParams.delete('search')
                  settingQuery(searchParams)
                } else {
                  searchParams.set('search', value)
                  settingQuery(searchParams)
                }
                setPage((prev) => ({...prev, page: 1}))
                setProject(value)
              }}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              enterButton
              allowClear
              className="direct-form-item"
            />
            <AccessWrapper role={permission?.Projects?.createProjects}>
              <div
                style={{
                  marginBottom: '1rem',
                  marginLeft: innerWidth >= 720 ? '1rem' : 0,
                }}
              >
                <Button
                  className="gx-btn gx-btn-primary gx-text-white "
                  onClick={handleOpenAddModal}
                  disabled={getIsAdmin()}
                >
                  Add New Project
                </Button>
              </div>
            </AccessWrapper>
          </div>
          <Form layout="inline" className="gx-d-flex gx-flex-row" form={form}>
            <FormItem className="direct-form-search">
              <Select
                placeholderClass={PLACE_HOLDER_CLASS}
                placeholder="Select Project Type"
                onChange={handleProjectTypeChange}
                value={projectType}
                options={projectTypesData?.data?.data?.data?.map((x) => ({
                  id: x?._id,
                  value: x?.name,
                }))}
              />
            </FormItem>
            <FormItem className="direct-form-search">
              <Select
                placeholderClass={PLACE_HOLDER_CLASS}
                placeholder="Select Project Status"
                onChange={handleProjectStatusChange}
                value={projectStatus}
                options={projectStatusData?.data?.data?.data?.map((x) => ({
                  id: x?._id,
                  value: x?.name,
                }))}
              />
            </FormItem>
            <FormItem className="direct-form-search">
              <Select
                placeholderClass={PLACE_HOLDER_CLASS}
                placeholder="Select Project Tag"
                onChange={handleProjectTagsChange}
                value={projectTags}
                options={projectTagsData?.data?.data?.data?.map((x) => ({
                  id: x?._id,
                  value: x?.name,
                }))}
              />
            </FormItem>
            <FormItem className="direct-form-search">
              <Select
                placeholderClass={PLACE_HOLDER_CLASS}
                placeholder="Select Client"
                onChange={handleClientChange}
                value={projectClient}
                options={projectClientsData?.data?.data?.data?.map((x) => ({
                  id: x?._id,
                  value: x?.name,
                }))}
              />
            </FormItem>
            <FormItem className="direct-form-search">
              <Select
                placeholderClass={PLACE_HOLDER_CLASS}
                placeholder="Select Developer"
                onChange={handleDeveloperChange}
                value={developer}
                options={developers?.data?.data?.data?.map((x) => ({
                  id: x?._id,
                  value: x?.name,
                }))}
              />
            </FormItem>
            <FormItem className="direct-form-search">
              <Select
                placeholderClass={PLACE_HOLDER_CLASS}
                placeholder="Select Designer"
                onChange={handleDesignerChange}
                value={designer}
                options={designers?.data?.data?.data?.map((x) => ({
                  id: x?._id,
                  value: x?.name,
                }))}
              />
            </FormItem>
            <FormItem className="direct-form-search">
              <Select
                placeholderClass={PLACE_HOLDER_CLASS}
                placeholder="Select QA"
                onChange={handleQaChange}
                value={qa}
                options={QAs?.data?.data?.data?.map((x) => ({
                  id: x?._id,
                  value: x?.name,
                }))}
              />
            </FormItem>
            <FormItem>
              <Button
                className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
                onClick={handleResetFilter}
              >
                Reset
              </Button>
            </FormItem>
          </Form>
        </div>
        <Table
          locale={{emptyText}}
          className="gx-table-responsive"
          columns={PROJECT_COLUMNS(
            sort,
            handleOpenEditModal,
            confirmDeleteProject,
            navigateToProjectLogs,
            permission
          )}
          dataSource={formattedProjects(data?.data?.data?.data)}
          onChange={handleTableChange}
          pagination={{
            current: page.page,
            pageSize: page.limit,
            pageSizeOptions: ['25', '50', '100'],
            showSizeChanger: true,
            total: data?.data?.data?.count || 1,
            onShowSizeChange,
            hideOnSinglePage: data?.data?.data?.count ? false : true,
            onChange: handlePageChange,
          }}
          loading={isLoading || isFetching || deleteProjectMutation?.isLoading}
        />
      </Card>
    </div>
  )
}

export default ProjectsPage
