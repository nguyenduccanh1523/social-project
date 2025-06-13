import React from 'react'
import { Row, Col, Container, Dropdown, Button } from 'react-bootstrap'
import Card from '../../../components/Card'
import { apiGetNotificationUser } from '../../../services/notification'
import { useSelector } from 'react-redux'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import Loader from '../../dashboard/icons/uiverse/Loading';

// Import hình ảnh người dùng
import Noti from '../component/Notification/notifi'

const Notification = () => {
   const { user } = useSelector((state) => state.root.auth || {});
   const { token } = useSelector((state) => state.root.auth || {});
   const userId = user?.documentId;

   // Sử dụng `useInfiniteQuery` để quản lý phân trang
   const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
      queryKey: ['notifications', userId, token],
      queryFn: ({ pageParam = 1 }) => apiGetNotificationUser({ userId, page: pageParam, token }),
      enabled: !!userId && !!token,
      getNextPageParam: (lastPage, allPages) => {
         const totalPages = lastPage?.data?.meta?.pagination?.pageCount || 1;
         const nextPage = allPages.length + 1;
         return nextPage <= totalPages ? nextPage : undefined;
      },
      staleTime: 600000, // 10 phút
      refetchOnWindowFocus: false,
   });

   // Gộp tất cả các trang dữ liệu vào một danh sách duy nhất
   const notifications = data?.pages?.flatMap(page => page?.data?.data) || [];

   return (
      <div id='content-page' className='content-page'>
         <Container>
            <Row>
               <Col sm="12">
                  <h4 className="card-title mb-3">Notification</h4>
               </Col>
               <Col sm="12">
                  {notifications.map((notification, index) => (
                     <Card key={index}>
                        <Card.Body>
                           <ul className="notification-list m-0 p-0">
                              <li  className="d-flex align-items-center justify-content-between">
                                 <Noti notification={notification} />
                              </li>
                           </ul>
                        </Card.Body>
                     </Card>
                  ))}
                  {hasNextPage && (
                     <div className="text-center mt-3">
                        <Button
                           variant="primary"
                           onClick={() => fetchNextPage()}
                           disabled={isFetchingNextPage}
                        >
                           {isFetchingNextPage ? <Loader /> : "Load More"}
                        </Button>
                     </div>
                  )}
                  {!hasNextPage && notifications.length > 0 && (
                     <div className="text-center mt-3">
                        <p>No more notifications.</p>
                     </div>
                  )}
               </Col>
            </Row>
         </Container>
      </div>
   )
}

export default Notification;
