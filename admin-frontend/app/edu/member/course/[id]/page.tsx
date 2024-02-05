'use client';

import { PlayCircleTwoTone } from '@ant-design/icons';
import { courseApis } from '@api';
import { CourseCompletedPrompt, LoadingOutlinedSpin } from '@component';
import { Chapter, Course } from '@types';
import { Collapse, List, Progress, Tabs, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

const listItemClassNames = 'cursor-pointer px-[1.2rem] h-[8rem]';
const itemElementWrapperClassNames =
  'flex items-center text-2xl transition-shadow hover:shadow-md w-full h-full rounded-xl px-[2.4rem] hover:bg-orange-100 ease-in-out';

const Chapters: FC<{
  chapters: Chapter[];
  course: Course | undefined;
}> = ({ chapters, course }) => {
  if (course?.hasChapters) {
    return (
      <Collapse
        items={chapters.map(chapter => {
          return {
            key: chapter.id,
            label: chapter.name,
            children: (
              <List
                dataSource={chapter.chapterVideos}
                renderItem={item => (
                  <List.Item className={listItemClassNames}>
                    <div className={itemElementWrapperClassNames}>
                      <PlayCircleTwoTone />
                      <span className="ml-[1rem]">{item.video!.name}</span>
                    </div>
                  </List.Item>
                )}
              />
            ),
          };
        })}
        defaultActiveKey={chapters.map(c => c.id!)}
      />
    );
  }

  return (
    <List
      bordered
      dataSource={chapters[0].chapterVideos}
      renderItem={item => (
        <List.Item className={listItemClassNames}>
          <div className={itemElementWrapperClassNames}>
            <PlayCircleTwoTone />
            <span className="ml-[1rem]">{item.video!.name}</span>
          </div>
        </List.Item>
      )}
    />
  );
};

const Course: FC<{ params: { id: number } }> = ({ params: { id } }) => {
  const [course, setCourse] = useState<Course>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(true);

  useEffect(() => {
    courseApis.findById(id).then(resp => {
      setCourse(resp.data);
      setCourseLoading(false);

      courseApis.findChaptersById(id).then(resp => {
        setChapters([...resp.data]);
        setChaptersLoading(false);
      });
    });
  }, []);

  return (
    <div className="w-3/5 mx-auto h-full pt-16">
      {courseLoading ? (
        <div className="h-full flex">
          <LoadingOutlinedSpin />
        </div>
      ) : (
        <>
          <div className="flex justify-between w-full rounded-lg shadow-lg border-2 h-40 p-[1.6rem]">
            <div className="flex flex-col justify-between h-full">
              <span className="font-semibold text-4xl">{course?.name}</span>
              <div className="flex">
                {course?.mandatory ? (
                  <Tag color="red">必修课</Tag>
                ) : (
                  <Tag color="orange">选修课</Tag>
                )}
                <CourseCompletedPrompt />
              </div>
            </div>
            <Progress type="circle" percent={100} size="small" />
          </div>

          <Tabs
            size="large"
            style={{
              marginTop: '4rem',
              marginBottom: '4rem',
            }}
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: '课程目录',
                children: chaptersLoading ? (
                  <div className="h-40 flex">
                    <LoadingOutlinedSpin />
                  </div>
                ) : (
                  <div className="mt-[1.6rem]">
                    <Chapters chapters={chapters} course={course} />
                  </div>
                ),
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default Course;
