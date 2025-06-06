import { OrderInfo } from '@components';
import { ProtectedRoute } from '../routing/ProtectedRoute';

export const PrivateOrderPage = () => (
  <ProtectedRoute>
    <div style={{ padding: '120px 0' }}>
      <OrderInfo isPrivate />
    </div>
  </ProtectedRoute>
);
