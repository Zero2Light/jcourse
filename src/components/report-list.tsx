import { Pagination, Report } from '@/models';
import { Alert, List } from 'antd';

const ReportList = ({
  loading,
  count,
  reports,
  onPageChange,
  pagination,
}: {
  loading: boolean;
  count: number | undefined;
  reports: Report[] | undefined;
  onPageChange?: Function;
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
          actions={[<div>{item.created}</div>, <>{'#' + item.id}</>]}
          className="comment"
        >
          <p>{item.comment}</p>
          {item.reply && <Alert message={item.reply} type="info" />}
        </List.Item>
      )}
    />
  );
};
export default ReportList;
