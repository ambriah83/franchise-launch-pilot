import { useState, useEffect } from 'react';
import { InventoryAlert } from '../types';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Generate mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Low Stock Alert',
        message: 'POS Terminal inventory is below reorder level',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionUrl: '/inventory/alerts'
      },
      {
        id: '2',
        title: 'Purchase Order Approved',
        message: 'PO-1004 has been approved and is ready for ordering',
        type: 'success',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
        actionUrl: '/purchase-orders'
      },
      {
        id: '3',
        title: 'Shipment Delayed',
        message: 'Furniture delivery for Queen Creek has been delayed by 3 days',
        type: 'warning',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        actionUrl: '/receiving'
      },
      {
        id: '4',
        title: 'Budget Alert',
        message: 'San Tan Valley project is approaching budget limit',
        type: 'warning',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        read: true,
        actionUrl: '/projects'
      },
      {
        id: '5',
        title: 'New Project Created',
        message: 'Mesa location project has been added to your portfolio',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        actionUrl: '/projects'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  // Update unread count when notifications change
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    setUnreadCount(unreadNotifications.length);
  }, [notifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getRecentNotifications = (limit: number = 5) => {
    return notifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    getRecentNotifications
  };
};

export default useNotifications;