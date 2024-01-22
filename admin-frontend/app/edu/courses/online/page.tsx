'use client';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { categoryApis, courseApis, departmentApis } from '@api';
import {
  ChaptersDrawer,
  CourseDrawer,
  CoursewaresDrawer,
  VerticalDivider,
} from '@component';
import type {
  Category,
  Course,
  Department,
  EditChaptersCourse,
  FindCourseResp,
  Page,
  Pageable,
} from '@types';
import {
  Button,
  Dropdown,
  Input,
  Space,
  Table,
  Tabs,
  Tree,
  TreeProps,
  message,
} from 'antd';
import { SorterResult } from 'antd/es/table/interface.js';
import { FC, Key, useEffect, useState } from 'react';

const ALL_CATEGORY: Category = {
  id: -1,
  name: '全部分类',
  children: [],
};

const ALL_DEPARTMENT: Department = {
  id: -1,
  name: '全部部门',
  children: [],
};

const DEFAULT_PAGE_REQUEST = {
  pageNumber: 1,
  pageSize: 10,
  sort: [
    {
      direction: 'DESC',
      property: 'creationTimestamp',
    },
  ],
};

const Online: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentCategory, setCurrentCategory] =
    useState<Category>(ALL_CATEGORY);
  const [currentDepartment, setCurrentDepartment] =
    useState<Department>(ALL_DEPARTMENT);
  const [activeTabKey, setActiveTabKey] = useState<string>('1');
  const [pageRequest, setPageRequest] =
    useState<Pageable>(DEFAULT_PAGE_REQUEST);
  const [coursePage, setCoursePage] = useState<Page<FindCourseResp>>();
  const [addOrEditCourseDrawerOpen, setAddOrEditCourseDrawerOpen] =
    useState(false);
  const [chaptersDrawerOpen, setChaptersDrawerOpen] = useState(false);
  const [coursewareDrawerOpen, setCoursewareDrawerOpen] = useState(false);
  const [courseNameKeyWord, setCourseNameKeyWord] = useState('');
  const [editedCourse, setEditedCourse] = useState<FindCourseResp>();
  const [editChapterCourse, setEditChapterCourse] =
    useState<EditChaptersCourse>();
  const [editCoursewareCourseId, setEditCoursewareCourseId] = useState<
    number | undefined
  >();
  const [isTableLoading, setIsTableLoading] = useState(true);

  const refresh = () => {
    setPageRequest(pre => ({ ...pre }));
  };

  const onCategorySelect: TreeProps['onSelect'] = (_, { node }) => {
    setCurrentCategory(node);
  };

  const onDepartmentSelect: TreeProps['onSelect'] = (_, { node }) => {
    setCurrentDepartment(node);
  };

  const showAddOrEditCourseDrawer = () => {
    setAddOrEditCourseDrawerOpen(true);
  };

  const handleAddOrEditCourseDrawerClose = () => {
    setAddOrEditCourseDrawerOpen(false);
    refresh();
  };

  const handleChaptersDrawerClose = () => {
    setChaptersDrawerOpen(false);
  };

  const handleCoursewareDrawerClose = () => {
    setCoursewareDrawerOpen(false);
  };

  const handleAfterAddOrEditDrawerClose = () => {
    setEditedCourse(undefined);
  };

  useEffect(() => {
    categoryApis.tree().then(resp => {
      setCategories(resp.data);
    });
    departmentApis.tree().then(resp => {
      setDepartments(resp.data);
    });
  }, []);

  useEffect(() => {
    setIsTableLoading(true);
    courseApis
      .findPage(
        {
          name: courseNameKeyWord,
          categoryId:
            currentCategory.id === ALL_CATEGORY.id ? null : currentCategory.id!,
          departmentId:
            currentDepartment.id === ALL_DEPARTMENT.id
              ? null
              : currentDepartment.id!,
        },
        pageRequest
      )
      .then(resp => {
        setCoursePage({ ...resp.data });
      })
      .finally(() => setIsTableLoading(false));
  }, [pageRequest, currentCategory, currentDepartment]);

  return (
    <div className="flex h-full">
      <Tabs
        defaultActiveKey="1"
        className="w-1/6"
        size="large"
        items={[
          {
            key: '1',
            label: '分类',
            children: (
              <Tree
                blockNode
                defaultExpandAll
                defaultExpandParent
                fieldNames={{
                  title: 'name',
                  key: 'id',
                }}
                onSelect={onCategorySelect}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                treeData={[ALL_CATEGORY, ...categories]}
              />
            ),
          },
          {
            key: '2',
            label: '部门',
            children: (
              <Tree
                blockNode
                defaultExpandAll
                defaultExpandParent
                fieldNames={{
                  title: 'name',
                  key: 'id',
                }}
                onSelect={onDepartmentSelect}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                treeData={[ALL_DEPARTMENT, ...departments]}
              />
            ),
          },
        ]}
        onChange={key => setActiveTabKey(key)}
      />
      <VerticalDivider />
      <div className="ml-8 w-full">
        <div className="text-2xl mb-10">
          线上课 |{' '}
          {activeTabKey === '1' ? currentCategory.name : currentDepartment.name}
        </div>
        <div className="mb-10 flex justify-between">
          <Space wrap>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={showAddOrEditCourseDrawer}
            >
              新建课程
            </Button>
          </Space>

          <Space>
            <span>课程名称:</span>
            <Input
              placeholder="请输入名称关键字"
              onChange={e => {
                setCourseNameKeyWord(e.target.value);
              }}
              value={courseNameKeyWord}
            />
            <Button
              onClick={() => {
                setCourseNameKeyWord('');
                refresh();
              }}
            >
              重置
            </Button>
            <Button onClick={refresh} type={'primary'}>
              查询
            </Button>
          </Space>
        </div>
        <Table
          loading={isTableLoading}
          columns={[
            {
              title: '课程名称',
              render: (_, record) => record?.course.name,
            },
            {
              title: '课程分类',
              render: (_, record) => record?.course.category?.name,
            },
            {
              title: '指派部门',
              render: (_, record) => {
                if (record?.course.assignToAllDepartments) {
                  return '全体部门';
                }

                const { departments = [] } = record;
                return departments.map(d => d.name).join(',');
              },
            },
            {
              title: '必修/选修',
              render: (_, record) =>
                record.course.mandatory ? '必修' : '选修',
            },
            {
              title: '上架时间',
              render: (_, record) => record?.course.creationTimestamp,
              sorter: true,
              sortDirections: ['descend', 'ascend', 'descend'],
              defaultSortOrder: 'descend',
            },
            {
              title: '操作',
              render: (_, record) => (
                <Space size="middle">
                  <Button type="link">学员</Button>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: '1',
                          label: (
                            <Button
                              type="link"
                              onClick={() => {
                                setEditedCourse({ ...record });
                                showAddOrEditCourseDrawer();
                              }}
                            >
                              编辑
                            </Button>
                          ),
                        },
                        {
                          key: '2',
                          label: (
                            <Button
                              type="link"
                              onClick={() => {
                                setEditChapterCourse({
                                  id: record.course.id!,
                                  hasChapters: record.course.hasChapters!,
                                });
                                setChaptersDrawerOpen(true);
                              }}
                            >
                              课时
                            </Button>
                          ),
                        },
                        {
                          key: '3',
                          label: (
                            <Button
                              type="link"
                              onClick={() => {
                                setCoursewareDrawerOpen(true);
                                setEditCoursewareCourseId(record.course.id);
                              }}
                            >
                              课件
                            </Button>
                          ),
                        },
                        {
                          key: '4',
                          label: (
                            <Button
                              type="link"
                              onClick={() => {
                                courseApis
                                  .deleteCourse(record.course.id!)
                                  .then(() => {
                                    message.success(
                                      `删除课程 ${record.course.name} 成功`
                                    );
                                    refresh();
                                  });
                              }}
                            >
                              删除
                            </Button>
                          ),
                        },
                      ],
                    }}
                  >
                    <Button type="link">
                      <Space>
                        更多
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </Space>
              ),
            },
          ]}
          dataSource={coursePage?.content || []}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys: Key[]) => {},
          }}
          rowKey={record => record.course.id!.toString()}
          pagination={{
            total: coursePage?.totalElements,
            pageSize: pageRequest.pageSize,
            showSizeChanger: false,
          }}
          onChange={(pagination, _, sorter) => {
            const {
              current = DEFAULT_PAGE_REQUEST.pageNumber,
              pageSize = DEFAULT_PAGE_REQUEST.pageSize,
            } = pagination;
            setPageRequest({
              pageNumber: current,
              pageSize,
              sort: [
                {
                  direction:
                    (sorter as SorterResult<Course>).order! === 'descend'
                      ? 'DESC'
                      : 'ASC',
                  property: (sorter as SorterResult<Course>).field! as string,
                },
              ],
            });
          }}
        />
      </div>
      <CourseDrawer
        afterClose={handleAfterAddOrEditDrawerClose}
        editedCourse={editedCourse}
        drawerOpen={addOrEditCourseDrawerOpen}
        onDrawerClose={handleAddOrEditCourseDrawerClose}
        departments={departments}
        categories={categories}
      />
      <ChaptersDrawer
        course={editChapterCourse}
        drawerOpen={chaptersDrawerOpen}
        onDrawerClose={handleChaptersDrawerClose}
        categories={categories}
      />
      <CoursewaresDrawer
        drawerOpen={coursewareDrawerOpen}
        onDrawerClose={handleCoursewareDrawerClose}
        categories={categories}
        courseId={editCoursewareCourseId}
      />
    </div>
  );
};

export default Online;
