'use client';
import { overviewApis } from '@api';
import { LoadingOutlinedSpin } from '@component';
import { AdminOverview } from '@types';
import { Button, Card, Col, Row } from 'antd';
import ReactEcharts from 'echarts-for-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import IconAddDept from 'public/icon-adddept.svg';
import IconAddUser from 'public/icon-adduser.svg';
import IconN1 from 'public/icon-n1.png';
import IconN2 from 'public/icon-n2.png';
import IconN3 from 'public/icon-n3.png';
import IconOnlineLesson from 'public/icon-onlinelesson.svg';
import IconUploadVideo from 'public/icon-upvideo.svg';
import { FC, useEffect, useState } from 'react';

const { Meta } = Card;

const Home: FC = () => {
  const [adminOverview, setAdminOverview] = useState<AdminOverview>({
    todayMemberCount: 0,
    tmcCompareToYesterday: 0,
    memberCount: 0,
    mcCompareToYesterday: 0,
    courseCount: 0,
    departmentCount: 0,
    categoryCount: 0,
    adminCount: 0,
    videoCount: 0,
    coursewareCount: 0,
    rank: [],
  });
  const [overviewLoading, setOverviewLoading] = useState(true);
  const router = useRouter();
  const quickOperation = (href: string) => () => router.push(href);

  useEffect(() => {
    setOverviewLoading(true);
    overviewApis
      .getAdminOverview()
      .then(({ data }) => setAdminOverview(data))
      .finally(() => setOverviewLoading(false));
  }, []);

  return (
    <div className="h-full">
      {overviewLoading ? (
        <div className="h-full w-full flex">
          <LoadingOutlinedSpin />
        </div>
      ) : (
        <Row gutter={[16, 24]}>
          <Col span={12}>
            <Card bordered={false}>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="text-base">今日学习学员</span>
                  <div className="flex items-center mt-6">
                    <div className="text-4xl">
                      {adminOverview.todayMemberCount}
                    </div>
                    <div className="text-base ml-4">
                      <span>较昨日</span>
                      <span className="text-red-500">
                        <i>▲</i>
                        {adminOverview.tmcCompareToYesterday}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-base">总学员数</span>
                  <div className="flex items-center mt-6">
                    <div className="text-4xl">{adminOverview.memberCount}</div>
                    <div className="text-base ml-4">
                      <span>较昨日</span>
                      <span className="text-red-500">
                        <i>▲</i>
                        {adminOverview.mcCompareToYesterday}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-base">线上课数</span>
                  <span className="text-4xl mt-6">
                    {adminOverview.courseCount}
                  </span>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="text-base">部门数</span>
                  <span className="text-4xl mt-6">
                    {adminOverview.departmentCount}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base">分类数</span>
                  <span className="text-4xl mt-6">
                    {adminOverview.categoryCount}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base">管理员</span>
                  <span className="text-4xl mt-6">
                    {adminOverview.adminCount}
                  </span>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={24}>
            <Card bordered={false}>
              <Meta title="快捷操作" />
              <div className="mt-6 flex">
                <Button
                  type="text"
                  onClick={quickOperation(
                    '/edu/admin/member-management/members'
                  )}
                >
                  <div className="flex items-center">
                    <Image
                      src={IconAddUser}
                      alt="starry-logo"
                      height={24}
                      width={24}
                    />
                    <span className="ml-4 text-base">添加学员</span>
                  </div>
                </Button>
                <Button type="text">
                  <div
                    className="flex items-center"
                    onClick={quickOperation('/edu/admin/resources/videos')}
                  >
                    <Image
                      src={IconUploadVideo}
                      alt="starry-logo"
                      height={24}
                      width={24}
                    />
                    <span className="ml-4 text-base">上传视频</span>
                  </div>
                </Button>
                <Button
                  type="text"
                  onClick={quickOperation('/edu/admin/courses/online')}
                >
                  <div className="flex items-center">
                    <Image
                      src={IconOnlineLesson}
                      alt="starry-logo"
                      height={24}
                      width={24}
                    />
                    <span className="ml-4 text-base">线上课</span>
                  </div>
                </Button>
                <Button
                  type="text"
                  onClick={quickOperation(
                    '/edu/admin/member-management/departments'
                  )}
                >
                  <div className="flex items-center">
                    <Image
                      src={IconAddDept}
                      alt="starry-logo"
                      height={24}
                      width={24}
                    />
                    <span className="ml-4 text-base">新建部门</span>
                  </div>
                </Button>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              bordered={false}
              bodyStyle={{
                height: '350px',
              }}
            >
              <Meta title="今日学习排行" />
              <div className="flex">
                <div className="flex flex-col w-1/2 justify-center items-start">
                  <div className="mt-10">
                    <Image
                      src={IconN1}
                      alt="starry-logo"
                      height={20}
                      width={20}
                    />
                  </div>
                  <div className="mt-10">
                    <Image
                      src={IconN2}
                      alt="starry-logo"
                      height={20}
                      width={20}
                    />
                  </div>
                  <div className="mt-10">
                    <Image
                      src={IconN3}
                      alt="starry-logo"
                      height={20}
                      width={20}
                    />
                  </div>
                  <div className="mt-10 text-gray-500">4</div>
                  <div className="mt-10 text-gray-500">5</div>
                </div>
                <div className="flex flex-col w-1/2 justify-center items-start">
                  <div className="mt-10 text-gray-500">6</div>
                  <div className="mt-10 text-gray-500">7</div>
                  <div className="mt-10 text-gray-500">8</div>
                  <div className="mt-10 text-gray-500">9</div>
                  <div className="mt-10 text-gray-500">10</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              bordered={false}
              bodyStyle={{
                height: '350px',
              }}
            >
              <Meta title="资源统计" />
              <ReactEcharts
                option={{
                  tooltip: {
                    trigger: 'item',
                  },
                  legend: {
                    top: '5%',
                    left: 'center',
                  },
                  series: [
                    {
                      // name: 'Access From',
                      type: 'pie',
                      radius: ['40%', '70%'],
                      avoidLabelOverlap: false,
                      itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2,
                      },
                      label: {
                        show: false,
                        position: 'center',
                      },
                      emphasis: {
                        label: {
                          show: true,
                          fontSize: 24,
                          fontWeight: 'bold',
                        },
                      },
                      labelLine: {
                        show: false,
                      },
                      data: [
                        { value: adminOverview.videoCount, name: '视频数量' },
                        {
                          value: adminOverview.coursewareCount,
                          name: '课件数量',
                        },
                      ],
                    },
                  ],
                }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Home;
