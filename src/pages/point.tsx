import { UserPoint } from '@/models';
import { getUserPoint } from '@/services/user';
import { useRequest } from 'ahooks';
import {
  Card,
  Descriptions,
  PageHeader,
  Skeleton,
  Table,
  Typography,
} from 'antd';

const { Title, Paragraph } = Typography;

const PointPage = () => {
  const { data: points, loading } = useRequest<UserPoint, []>(getUserPoint);

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '变动值',
      dataIndex: 'value',
      key: 'value',
    },
    { title: '描述', dataIndex: 'description', key: 'description' },
  ];
  return (
    <PageHeader title="社区积分">
      <Card>
        <Typography>
          <Title level={5}>概览</Title>
          <Skeleton loading={loading}>
            {points && (
              <Descriptions bordered>
                <Descriptions.Item label="点评数">
                  {points.reviews}
                </Descriptions.Item>
                <Descriptions.Item label="获赞数">
                  {points.approves}
                </Descriptions.Item>
                <Descriptions.Item label="首评数">
                  {points.first_reviews}
                </Descriptions.Item>
                <Descriptions.Item label="首评获赞">
                  {points.first_reviews_approves}
                </Descriptions.Item>
                <Descriptions.Item label="额外积分">
                  {points.addition}
                </Descriptions.Item>
                <Descriptions.Item label="总积分" className="total-point">
                  {points.points}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Skeleton>

          <Title level={5}>说明</Title>
          <Paragraph>
            总积分 = 点评数 + 获赞数 + 额外积分。
            其中课程的首次点评为双倍积分，获踩数大于 2 倍获赞数的点评视作无效。
          </Paragraph>
          <Paragraph>
            您可以前往
            <a href="https://share.dyweb.sjtu.cn/" target="_blank">
              传承·交大
            </a>
            将选课社区积分兑换为传承积分。
          </Paragraph>
          <Title level={5}>额外积分详情</Title>
          <Skeleton loading={loading}>
            {points && (
              <Table
                tableLayout="fixed"
                dataSource={points.details}
                columns={columns}
                pagination={false}
              ></Table>
            )}
          </Skeleton>
        </Typography>
      </Card>
    </PageHeader>
  );
};
export default PointPage;
