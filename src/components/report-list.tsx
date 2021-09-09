import { Pagination, Report } from '@/models';
import { Alert, List } from 'antd';

const ReportList = ({
  count,
  reports,
  onPageChange,
  loading,
  pagination,
}: {
  count: number;
  reports: Report[];
  onPageChange?: Function;
  loading: boolean;
  pagination?: Pagination;
}) => {
  return (
    <List
      loading={loading}
      itemLayout="vertical"
      pagination={
        pagination
          ? {
              hideOnSinglePage: true,
              onChange: (page, pageSize) => {
                onPageChange && onPageChange(page, pageSize);
              },
              total: count,
              current: pagination.page,
              defaultCurrent: pagination.page,
              pageSize: pagination.pageSize,
            }
          : false
      }
      dataSource={reports}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          actions={[<div>{item.created}</div>]}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          <p>{item.comment}</p>
          {item.reply && <Alert message={item.reply} type="info" />}
        </List.Item>
      )}
    />
  );
};
export default ReportList;
