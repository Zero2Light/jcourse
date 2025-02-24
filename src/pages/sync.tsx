import CourseList from '@/components/course-list';
import { CourseListItem } from '@/models';
import { authSync, getLessons, loginSync, syncLessons } from '@/services/sync';
import useUrlState from '@ahooksjs/use-url-state';
import { useRequest } from 'ahooks';
import { Button, Card, Modal, PageHeader, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SyncPage = () => {
  const {
    data: courses,
    loading: courseLoading,
    run,
  } = useRequest<CourseListItem[], []>(getLessons);
  const [urlState, setUrlState] = useUrlState({ code: null });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const [semester, setSemester] = useState<string>('');
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  useEffect(() => {
    if (urlState.code) {
      authSync(urlState.code)
        .then(() => {
          message.info('已刷新 jAccount 登录状态，请继续同步！');
          setUrlState({ code: undefined });
        })
        .catch(() => {
          message.error('参数错误！');
          setUrlState({ code: undefined });
        });
    }
  }, [urlState]);

  const handleClick = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (semester == '') {
      message.error('请选择需要同步的学期！');
      return;
    }
    setConfirmLoading(true);

    syncLessons(semester)
      .then(() => {
        run();
        setIsModalVisible(false);
        setConfirmLoading(false);
      })
      .catch((err) => {
        if (err.response?.status == 401) {
          message.warning(
            '即将重新登录jAccount，请在本页面刷新后继续同步',
            () => {
              loginSync();
            },
          );
        }
      });
  };

  return (
    <PageHeader title="学过的课" backIcon={false}>
      <Card
        title={`共有${courses ? courses.length : 0}门课`}
        extra={
          <Button type="primary" onClick={() => handleClick()}>
            同步
          </Button>
        }
      >
        <CourseList
          loading={courseLoading}
          count={courses?.length}
          courses={courses}
          showEnroll={false}
        />
      </Card>
      <Modal
        title="同步说明"
        visible={isModalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setIsModalVisible(false)}
      >
        选择需要同步的学期
        <Select
          placeholder="学期"
          className="sync-select"
          onSelect={(key: string) => setSemester(key)}
        >
          {initialState!.semesters.map((semester) => (
            <Select.Option
              key={semester.name}
              value={semester.name}
              label={semester.name}
            >
              {semester.name}
            </Select.Option>
          ))}
        </Select>
        <p>
          2020-2021 代表 2020-2021 学年度（2020.9-2021.8）。
          <br />
          1代表秋季学期，2代表春季学期，3代表夏季学期/小学期。
        </p>
        <p>
          同步课表时可能需要重新登录jAccount。点击确定即代表您授权本网站通过jAccount接口查询并存储您的选课记录。
        </p>
        <p>
          部分课程不在选课社区数据库中，包括培养计划更改后取消的课程或者被替代的同名课程。这些课程将被忽略。
        </p>
      </Modal>
    </PageHeader>
  );
};

export default SyncPage;
