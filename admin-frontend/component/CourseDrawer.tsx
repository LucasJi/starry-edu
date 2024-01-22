'use client';
import { courseApis } from '@api';
import {
  CoursewareView,
  OnlineCourseVideoView,
  SortableList,
} from '@component';
import type {
  Category,
  Chapter,
  Course,
  Department,
  FindCourseResp,
  StorageObj,
} from '@types';
import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  Radio,
  Space,
  Switch,
  TreeSelect,
  message,
} from 'antd';
import { RadioChangeEvent } from 'antd/lib';
import { useEffect, useRef, useState } from 'react';

const NO_CHAPTER = 0;

interface FieldType {
  name: string;
  categoryId: number;
  departmentIds: number[];
  description: string;
  assignToAllDepartments: boolean;
  mandatory: boolean;
  chapters: string[];
  hasChapters: boolean;
}

const CourseDrawer = ({
  drawerOpen,
  onDrawerClose,
  departments,
  categories,
  editedCourse,
  afterClose,
}: {
  drawerOpen: boolean;
  onDrawerClose: () => void;
  departments: Department[];
  categories: Category[];
  editedCourse: FindCourseResp | undefined;
  afterClose: () => void;
}) => {
  const [mandatory, setMandatory] = useState(true);
  const [assignToAllDepartments, setAssignToAllDepartments] = useState(true);
  const [hasChapters, setHasChapters] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [coursewareModalOpen, setCoursewareModalOpen] = useState(false);
  const sortedVideos = useRef(new Map<number, StorageObj[]>());
  const chapter = useRef<number>(NO_CHAPTER);
  const [courseForm] = Form.useForm<FieldType>();
  const [chapters, setChapters] = useState<Set<StorageObj>[]>([new Set()]);
  const [selectedCoursewares, setSelectedCoursewares] = useState<StorageObj[]>(
    []
  );

  const handleDrawerClose = () => {
    onDrawerClose();
    setHasChapters(false);
    cleanChapterCache();
    setSelectedCoursewares([]);
  };

  const cleanChapterCache = () => {
    setChapters([]);
    sortedVideos.current.clear();
  };

  const handleVideoSortableListChange = (list: StorageObj[], name: number) => {
    setChapters(pre => {
      pre[name] = new Set(list);
      return [...pre];
    });
  };

  const handleCoursewareSortableListChange = (list: StorageObj[]) => {
    setSelectedCoursewares([...list]);
  };

  const handleCreateCourse = () => {
    courseForm.validateFields().then((values: FieldType) => {
      const {
        name,
        departmentIds = [],
        mandatory,
        assignToAllDepartments,
        categoryId,
        description,
        chapters: chapterNames,
        hasChapters,
      } = values;

      let cs: Chapter[];

      if (hasChapters) {
        cs = chapters.map((value, index) => {
          return {
            name: chapterNames[index],
            order: index,
            chapterVideos: Array.from(value).map((video, idx) => ({
              video,
              order: idx,
            })),
          };
        });
      } else {
        cs = [
          {
            name: '_',
            order: 0,
            chapterVideos: Array.from(chapters[0]).map((video, idx) => ({
              video,
              order: idx,
            })),
          },
        ];
      }
      const course: Course = {
        name,
        mandatory,
        category: {
          id: categoryId,
        },
        assignToAllDepartments,
        hasChapters,
        description,
      };

      courseApis
        .add({
          course,
          chapters: cs,
          departmentIds,
          coursewareIds: selectedCoursewares.map(c => c.id!),
        })
        .then(() => {
          message.success('新增课程成功');
          handleDrawerClose();
        });
    });
  };

  const handleEditCourse = () => {
    courseForm.validateFields().then((values: FieldType) => {
      const {
        name,
        departmentIds = [],
        mandatory,
        assignToAllDepartments,
        categoryId,
        description,
      } = values;
      const course = {
        id: editedCourse!.course.id!,
        name,
        mandatory,
        category: {
          id: categoryId,
        },
        assignToAllDepartments,
        description,
      };

      courseApis
        .editCourse({
          ...course,
          departmentIds,
        })
        .then(() => {
          message.success('编辑课程成功');
          handleDrawerClose();
        });
    });
  };

  const getSelectedVideos = () => {
    return chapters.map(set => Array.from(set)).flatMap(value => value);
  };

  useEffect(() => {
    if (editedCourse) {
      const {
        course: {
          description,
          category,
          name,
          mandatory,
          assignToAllDepartments,
        },
        departments,
      } = editedCourse;
      if (description) {
        setShowMoreOptions(true);
      }

      if (description) {
        courseForm.setFieldValue('description', description);
      }

      if (departments) {
        courseForm.setFieldValue(
          'departmentIds',
          departments.map(d => d.id)
        );
      }

      setAssignToAllDepartments(!!assignToAllDepartments);

      courseForm.setFieldsValue({
        categoryId: category?.id,
        name,
        mandatory,
        assignToAllDepartments,
      });
    }
  }, [editedCourse]);

  return (
    <Drawer
      title={editedCourse ? '编辑课程' : '新建课程'}
      placement="right"
      onClose={handleDrawerClose}
      open={drawerOpen}
      maskClosable={false}
      afterOpenChange={open => {
        if (!open) {
          setShowMoreOptions(false);
          courseForm.resetFields();
          afterClose();
        }
      }}
      size="large"
      footer={
        <Space size="large" style={{ justifyContent: 'end', width: '100%' }}>
          <Button onClick={handleDrawerClose}>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              if (editedCourse) {
                handleEditCourse();
              } else {
                handleCreateCourse();
              }
            }}
          >
            确认
          </Button>
        </Space>
      }
    >
      <Form
        form={courseForm}
        labelCol={{ style: { width: '12rem' } }}
        wrapperCol={{ style: { width: 'calc(100%-12rem)' } }}
      >
        <Form.Item<FieldType>
          label="课程分类"
          name="categoryId"
          rules={[{ required: true, message: '请选择课程分类' }]}
        >
          <TreeSelect
            allowClear
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            fieldNames={{
              value: 'id',
              label: 'name',
            }}
            placeholder="请选择分类 "
            treeData={[...categories]}
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="课程名称"
          name="name"
          rules={[
            { required: true, message: '请输入课程名称' },
            {
              validator: (_, value) => {
                const reg = /(^\s+)|(\s+$)/;
                if (reg.test(value)) {
                  return Promise.reject(new Error('名称前后不能有空格'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入课程名称" />
        </Form.Item>
        <Form.Item<FieldType>
          label="课程属性"
          name="mandatory"
          required
          initialValue={true}
        >
          <Radio.Group
            onChange={(e: RadioChangeEvent) => {
              setMandatory(e.target.value);
            }}
            value={mandatory}
          >
            <Radio value={true}>必修课</Radio>
            <Radio value={false}>选修课</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<FieldType>
          label="指派部门"
          required
          initialValue={true}
          name="assignToAllDepartments"
        >
          <Radio.Group
            onChange={(e: RadioChangeEvent) => {
              setAssignToAllDepartments(e.target.value);
            }}
          >
            <Radio value={true}>全部部门</Radio>
            <Radio value={false}>选择部门</Radio>
          </Radio.Group>
        </Form.Item>
        {!assignToAllDepartments && (
          <Form.Item<FieldType> label="选择部门" name="departmentIds" required>
            <TreeSelect
              multiple
              onClear={() =>
                courseForm.setFieldValue('departmentId', undefined)
              }
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              fieldNames={{
                value: 'id',
                label: 'name',
              }}
              placeholder="请选择部门"
              treeData={departments}
              treeDefaultExpandAll
            />
          </Form.Item>
        )}
        {!editedCourse && (
          <Form.Item
            label="课时列表"
            name="hasChapters"
            required
            initialValue={false}
          >
            <>
              <Radio.Group
                onChange={(e: RadioChangeEvent) => {
                  setHasChapters(e.target.value);
                  if (!e.target.value) {
                    chapter.current = NO_CHAPTER;
                  }
                  cleanChapterCache();
                }}
                value={hasChapters}
              >
                <Radio value={false}>无章节</Radio>
                <Radio value={true}>有章节</Radio>
              </Radio.Group>
            </>
          </Form.Item>
        )}
        {!editedCourse &&
          (hasChapters ? (
            <>
              <Form.List name="chapters">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Flex
                        gap="small"
                        vertical
                        key={key}
                        style={{
                          marginBottom: '2.4rem',
                        }}
                      >
                        <Space size="large">
                          <Form.Item
                            name={name}
                            label={`章节${name + 1}`}
                            {...restField}
                            rules={[
                              { required: true, message: '章节名不能为空' },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item>
                            <Space size="large">
                              <Button
                                type="primary"
                                onClick={() => {
                                  chapter.current = name;
                                  setVideoModalOpen(true);
                                }}
                              >
                                添加课时
                              </Button>
                              <Button
                                onClick={() => {
                                  remove(name);
                                  setChapters(pre => {
                                    pre.forEach((_value, index, cur) => {
                                      if (
                                        index >= name &&
                                        index < cur.length - 1
                                      ) {
                                        cur[index] = cur[index + 1];
                                      }
                                    });
                                    pre.pop();
                                    return [...pre];
                                  });
                                }}
                              >
                                删除章节
                              </Button>
                            </Space>
                          </Form.Item>
                        </Space>
                        <div
                          style={{
                            marginLeft: '12rem',
                          }}
                        >
                          <SortableList
                            list={[...Array.from(chapters[name] || new Set())]}
                            emptyText="请点击上方按钮添加课时"
                            onChange={list =>
                              handleVideoSortableListChange(list, name)
                            }
                          />
                        </div>
                      </Flex>
                    ))}
                    <Form.Item>
                      <Button
                        style={{
                          marginLeft: '12rem',
                        }}
                        type="primary"
                        onClick={() => {
                          add();
                          setChapters(pre => {
                            pre.push(new Set());
                            return [...pre];
                          });
                        }}
                      >
                        添加章节
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </>
          ) : (
            <>
              <Form.Item>
                <Button
                  type="primary"
                  style={{
                    marginLeft: '12rem',
                  }}
                  onClick={() => {
                    chapter.current = NO_CHAPTER;
                    setVideoModalOpen(true);
                  }}
                >
                  添加课时
                </Button>
              </Form.Item>
              <Form.Item>
                <div
                  style={{
                    marginLeft: '12rem',
                  }}
                >
                  <SortableList
                    list={[
                      ...Array.from(chapters[chapter.current] || new Set()),
                    ]}
                    onChange={list =>
                      handleVideoSortableListChange(list, NO_CHAPTER)
                    }
                    emptyText="请点击上方按钮添加课时"
                  />
                </div>
              </Form.Item>
            </>
          ))}
        <Form.Item label="更多选项">
          <Switch
            size="small"
            onChange={setShowMoreOptions}
            value={showMoreOptions}
          />
        </Form.Item>
        {showMoreOptions && (
          <>
            <Form.Item<FieldType> label="课程简介" name="description">
              <Input.TextArea
                rows={4}
                placeholder="课程简介(最大字数为200)"
                maxLength={200}
              />
            </Form.Item>
            {!editedCourse && (
              <>
                <Form.Item label="课程附件">
                  <Button
                    type="primary"
                    onClick={() => setCoursewareModalOpen(true)}
                  >
                    添加课件
                  </Button>
                </Form.Item>
                <Form.Item>
                  <div
                    style={{
                      marginLeft: '12rem',
                    }}
                  >
                    <SortableList
                      list={selectedCoursewares}
                      onChange={handleCoursewareSortableListChange}
                      emptyText="请点击上方按钮添加课件"
                    />
                  </div>
                </Form.Item>
              </>
            )}
          </>
        )}
      </Form>

      <OnlineCourseVideoView
        title="课时视频素材"
        open={videoModalOpen}
        onCancel={() => setVideoModalOpen(false)}
        centered
        width={1000}
        categories={categories}
        selectedVideos={getSelectedVideos()}
        onConfirm={rows => {
          setVideoModalOpen(false);
          const added = rows.filter(
            r => getSelectedVideos().findIndex(obj => obj.id === r.id) === -1
          );
          setChapters(pre => {
            const chapterVideos = pre[chapter.current] || new Set<StorageObj>();
            added.forEach(e => chapterVideos.add(e));
            pre[chapter.current] = chapterVideos;
            return [...pre];
          });
        }}
      />

      <CoursewareView
        title="课件素材"
        open={coursewareModalOpen}
        onCancel={() => {
          setCoursewareModalOpen(false);
        }}
        centered
        width={1000}
        categories={categories}
        selectedObjs={selectedCoursewares}
        onConfirm={rows => {
          setCoursewareModalOpen(false);
          setSelectedCoursewares([...rows]);
        }}
      />
    </Drawer>
  );
};

export default CourseDrawer;
