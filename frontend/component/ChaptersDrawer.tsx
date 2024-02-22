'use client';

import { courseApis } from '@api';
import { OnlineCourseVideoView, SortableList } from '@component';
import type {
  Category,
  Chapter,
  ChapterVideo,
  Course,
  EditChaptersCourse,
} from '@types';
import { Button, Drawer, Flex, Form, Input, message, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

const NO_CHAPTER = 0;

const ChaptersDrawer = ({
  drawerOpen,
  onDrawerClose,
  categories,
  course,
}: {
  drawerOpen: boolean;
  onDrawerClose: () => void;
  categories: Category[];
  course: EditChaptersCourse | undefined;
}) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const chapter = useRef<number>(NO_CHAPTER);
  const [chaptersDrawerForm] = Form.useForm();
  const [chapterVideos, setChapterVideos] = useState<Set<ChapterVideo>[]>([]);

  const handleClose = () => {
    onDrawerClose();
  };

  const handleEditChapters = () => {
    chaptersDrawerForm.validateFields().then(values => {
      const { chapters: chapterNames } = values;

      let cs: Chapter[];
      const csCourse: Course = {
        id: course?.id,
      };
      if (course?.hasChapters) {
        cs = chapterVideos.map((value, index) => {
          return {
            name: chapterNames[index],
            order: index,
            chapterVideos: Array.from(value).map((cv, idx) => ({
              video: cv.video,
              order: idx,
            })),
            course: csCourse,
          };
        });
      } else {
        cs = [
          {
            name: '_',
            order: 0,
            chapterVideos: Array.from(chapterVideos[0]).map((cv, idx) => ({
              video: cv.video,
              order: idx,
            })),
            course: csCourse,
          },
        ];
      }

      courseApis
        .editChapters({
          chapters: cs,
        })
        .then(() => {
          message.success('更新课时成功');
          handleClose();
        })
        .catch(() => {
          message.error('更新课时失败');
        });
    });
  };

  const getSelectedVideos = () => {
    return chapterVideos
      .map(set => Array.from(set))
      .flatMap(value => value)
      .map(e => e.video!);
  };

  const handleVideoSortableListChange = (
    list: ChapterVideo[],
    name: number
  ) => {
    setChapterVideos(pre => {
      pre[name] = new Set(list);
      return [...pre];
    });
  };

  useEffect(() => {
    if (course && drawerOpen) {
      courseApis.findChaptersById(course.id).then(({ data: chapters }) => {
        setChapterVideos(pre => {
          chapters.forEach((value, index) => {
            pre[index] = new Set(value.chapterVideos);
          });
          return [...pre];
        });

        chaptersDrawerForm.setFieldValue(
          'chapters',
          chapters.map(c => c.name)
        );
      });
    }
  }, [course, drawerOpen]);

  return (
    <Drawer
      title="课时管理"
      size="large"
      placement="right"
      open={drawerOpen}
      maskClosable={false}
      onClose={handleClose}
      afterOpenChange={open => {
        if (!open) {
          chaptersDrawerForm.resetFields();
          setChapterVideos([]);
        }
      }}
      footer={
        <Space size="large" style={{ justifyContent: 'end', width: '100%' }}>
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" onClick={handleEditChapters}>
            确认
          </Button>
        </Space>
      }
    >
      <Form
        form={chaptersDrawerForm}
        labelCol={{ style: { width: '12rem' } }}
        wrapperCol={{ style: { width: 'calc(100%-12rem)' } }}
      >
        {course?.hasChapters ? (
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
                        rules={[{ required: true, message: '章节名不能为空' }]}
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
                              setChapterVideos(pre => {
                                pre.forEach((_value, index, cur) => {
                                  if (index >= name && index < cur.length - 1) {
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
                        list={[...Array.from(chapterVideos[name] || new Set())]}
                        nameColumnRender={record => record.video?.name}
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
                      setChapterVideos(pre => {
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
                    ...Array.from(chapterVideos[chapter.current] || new Set()),
                  ]}
                  onChange={list =>
                    handleVideoSortableListChange(list, NO_CHAPTER)
                  }
                  nameColumnRender={record => record.video?.name}
                  emptyText="请点击上方按钮添加课时"
                />
              </div>
            </Form.Item>
          </>
        )}
      </Form>
      <OnlineCourseVideoView
        title="课时视频素材"
        width={1000}
        centered
        open={videoModalOpen}
        onCancel={() => setVideoModalOpen(false)}
        categories={categories}
        onConfirm={rows => {
          setVideoModalOpen(false);
          const added = rows.filter(
            r => getSelectedVideos().findIndex(obj => obj.id === r.id) === -1
          );
          setChapterVideos(pre => {
            const chapterVideo =
              pre[chapter.current] || new Set<ChapterVideo>();
            const chapterVideoArr = Array.from(chapterVideo);
            added.forEach((e, index) => {
              if (chapterVideoArr.findIndex(c => c.video!.id === e.id) === -1) {
                chapterVideoArr.push({ id: index, video: e });
              }
            });
            pre[chapter.current] = new Set<ChapterVideo>(chapterVideoArr);
            return [...pre];
          });
        }}
        selectedVideos={getSelectedVideos()}
      />
    </Drawer>
  );
};

export default ChaptersDrawer;
