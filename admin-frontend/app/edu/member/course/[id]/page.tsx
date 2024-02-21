'use client';

import { PlayCircleTwoTone } from '@ant-design/icons';
import { courseApis, storageApis } from '@api';
import {
  CourseCompletedPrompt,
  LoadingOutlinedSpin,
  VideoPlayer,
} from '@component';
import { Chapter, ChapterVideo, Course } from '@types';
import { Collapse, List, Modal, Progress, Tabs, Tag } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';

const listItemClassNames = 'cursor-pointer px-[1.2rem] h-[8rem]';
const itemElementWrapperClassNames =
  'flex justify-between items-center text-2xl transition-shadow hover:shadow-md w-full h-full rounded-xl px-[2.4rem] hover:bg-[#fff7e6] ease-in-out';

const Chapters: FC<{
  chapters: Chapter[];
  course: Course | undefined;
  onVideoModalClose?: () => void;
}> = ({ chapters, course, onVideoModalClose = () => {} }) => {
  const [videoPlayerModalOpen, setVideoPlayerModalOpen] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const currentChapterVideo = useRef<ChapterVideo>();

  const ListItem: FC<{ item: ChapterVideo }> = ({ item }) => (
    <List.Item
      className={listItemClassNames}
      onClick={() => {
        storageApis.getPreviewUrl(item.video!.id!).then(({ data }) => {
          setVideoPreviewUrl(data);
          setVideoPlayerModalOpen(true);
          currentChapterVideo.current = item;
        });
      }}
    >
      <div className={itemElementWrapperClassNames}>
        <div>
          <PlayCircleTwoTone />
          <span className="ml-[1rem]">{item.video!.name}</span>
        </div>
        {item.completed && <span>已学完</span>}
      </div>
    </List.Item>
  );

  return (
    <div>
      {course?.hasChapters ? (
        <Collapse
          items={chapters.map(chapter => {
            return {
              key: chapter.id,
              label: chapter.name,
              children: (
                <List
                  dataSource={chapter.chapterVideos}
                  renderItem={item => <ListItem item={item} />}
                />
              ),
            };
          })}
          defaultActiveKey={chapters.map(c => c.id!)}
        />
      ) : (
        <List
          bordered
          dataSource={chapters[0].chapterVideos}
          renderItem={item => <ListItem item={item} />}
        />
      )}

      <Modal
        getContainer={false}
        open={videoPlayerModalOpen}
        destroyOnClose
        footer={null}
        maskClosable={false}
        onCancel={() => {
          setVideoPlayerModalOpen(false);
          setVideoPreviewUrl('');
          currentChapterVideo.current = undefined;
          onVideoModalClose();
        }}
        width="800px"
        styles={{
          body: { width: '800px' },
        }}
        wrapClassName="video-modal-wrapper"
      >
        <VideoPlayer
          url={videoPreviewUrl}
          onEnded={state => {
            if (currentChapterVideo.current) {
              courseApis.study({
                chapterId: currentChapterVideo.current.chapterId!,
                videoId: currentChapterVideo.current.video!.id!,
                completed: true,
                duration: state.playedSeconds,
              });
            }
          }}
        />
      </Modal>
    </div>
  );
};

const Course: FC<{ params: { id: number } }> = ({ params: { id } }) => {
  const [course, setCourse] = useState<Course>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const refresh = () => {
    setShouldRefresh(prevState => !prevState);
  };

  useEffect(() => {
    courseApis.findById(id).then(resp => {
      setCourse(resp.data);
      setCourseLoading(false);

      courseApis.findChaptersById(id).then(resp => {
        setChapters([...resp.data]);
        setChaptersLoading(false);
      });
    });
  }, [shouldRefresh]);

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
                {course?.completedVideoCount === course?.videoCount && (
                  <CourseCompletedPrompt />
                )}
              </div>
            </div>
            <Progress
              type="circle"
              percent={
                course && course.videoCount && course.videoCount > 0
                  ? (course.completedVideoCount! * 100) / course.videoCount!
                  : 0
              }
              size="small"
            />
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
                    <Chapters
                      chapters={chapters}
                      course={course}
                      onVideoModalClose={refresh}
                    />
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
