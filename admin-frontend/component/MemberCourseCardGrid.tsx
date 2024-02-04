'use client';
import { LoadingOutlinedSpin } from '@component';
import { Course } from '@types';
import { Card, Col, Progress, Row, Tag } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MedalIcon from 'public/icon-medal.png';
import { FC } from 'react';

const percent: number = 100;

const MemberCourseCardGrid: FC<{ courses: Course[]; loading?: boolean }> = ({
  courses,
  loading = false,
}) => {
  const router = useRouter();
  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          height: '24rem',
        }}
      >
        <LoadingOutlinedSpin />
      </div>
    );
  }

  return (
    <Row gutter={[48, 24]}>
      {courses.map((course, index) => (
        <Col key={`col-${index}`} span={8}>
          <Card
            onClick={() => router.push(`/edu/member/course/${course.id}`)}
            hoverable
            title={course.name}
            extra={
              course.mandatory ? (
                <Tag color="red">必修课</Tag>
              ) : (
                <Tag color="orange">选修课</Tag>
              )
            }
            style={{
              width: '100%',
            }}
            bodyStyle={{
              display: 'flex',
              justifyContent: 'center',
              height: '20rem',
            }}
          >
            {percent === 100 ? (
              <div className="flex items-center">
                <Image
                  src={MedalIcon}
                  alt="medal-icon"
                  width={24}
                  height={24}
                />
                <span
                  style={{
                    color: 'red',
                    marginLeft: '1rem',
                  }}
                >
                  恭喜你学完此课程!
                </span>
              </div>
            ) : (
              <Progress className="mx-auto" type="circle" percent={percent} />
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MemberCourseCardGrid;
