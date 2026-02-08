import axios, { AxiosError } from 'axios';
import {
  Member,
  Employee,
  Class,
  EquipmentAsset,
  InventoryItem,
  MemberActivityDoc,
  ClassBooking,
} from '../types';

const API_BASE_URL = 'https://gym-database-management.onrender.com';
// const API_BASE_URL = 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error: AxiosError) => {
  const message = (error.response?.data as any)?.detail || error.message;
  console.error('API Error:', message);
  throw new Error(message);
};

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token'); 
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
// // src/services/api.ts

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Explicitly set the key with a capital A
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  auth: {
    login: async (username: string, password: string) => {
      try {
        const response = await axiosInstance.post('/login', { username, password });
        return response.data;
      } catch (error) {
        handleError(error as AxiosError);
      }
    },
  },

  member: {
    getProfile: async (id: number): Promise<Member> => {
      try {
        const response = await axiosInstance.get(`/member/${id}/profile`);
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
    
    getActivityLogs: async (id: number): Promise<MemberActivityDoc[]> => {
      try {
        const response = await axiosInstance.get(`/member/${id}/calendar`);
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    updateProfile: async (
      id: number,
      data: { phone?: string; email?: string; address?: string }
    ): Promise<void> => {
      try {
        await axiosInstance.put(`/member/${id}/profile`, data);
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    getSubscriptions: async (id: number): Promise<any[]> => {
      try {
        const response = await axiosInstance.get(`/member/${id}/subscriptions`);
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    getPurchases: async (id: number) => {
      try {
        const response = await axiosInstance.get(`/member/${id}/purchases`);
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
    
  },

  class: {
    getAvailable: async (): Promise<any[]> => {
      try {
        const response = await axiosInstance.get('/classes/available');
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
    create: async (data: { class_name: string; trainer_id: number; start_time: string; capacity: number }) => {
         try {
           const response = await axiosInstance.post('/api/classes', data);
           return response.data;
         } catch (error) {
           return handleError(error as AxiosError);
         }
       },
    getAll: async (): Promise<Class[]> => {
      try {
        const response = await axiosInstance.get('/classes/all');
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    // UPDATED: Use the trainer-specific route you added to main.py
    getTrainerSchedule: async (trainerId: number): Promise<Class[]> => {
      try {
        const response = await axiosInstance.get(`/employee/${trainerId}/classes`);
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    getAttendees: async (scheduleId: number): Promise<any[]> => {
      try {
        const response = await axiosInstance.get(`/classes/${scheduleId}/attendees`);
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    // create: async (data: any) => {
    //   try {
    //     const response = await axiosInstance.post('/classes', data);
    //     return response.data;
    //   } catch (error) {
    //     return handleError(error as AxiosError);
    //   }
    // }
  },

  subscription: {
    getAllPlans: async (): Promise<any[]> => {
      try {
        const response = await axiosInstance.get('/plans');
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    }
  },

  booking: {
    getByMember: async (memberId: number): Promise<ClassBooking[]> => {
      try {
        const response = await axiosInstance.get(`/member/${memberId}/bookings`);
        return response.data;
      } catch (error) {
        return  handleError(error as AxiosError);
      }
    },

    create: async (memberId: number, scheduleId: number): Promise<void> => {
      try {
        await axiosInstance.post('/bookings', {
          member_id: memberId,
          schedule_id: scheduleId
        });
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    delete: async (bookingId: number): Promise<void> => {
      try {
        await axiosInstance.delete(`/bookings/${bookingId}`);
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    markAttendance: async (booking_id: number, attended: boolean): Promise<void> => {
      try {
        // Updated to pass boolean as a query parameter to match FastAPI
        await axiosInstance.patch(`/attendance/${booking_id}`, null, {
          params: { attended }
        });
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
  },

  employee: {
    getProfile: async (id: number): Promise<Employee> => {
      try {
        const response = await axiosInstance.get(`/employee/${id}/profile`);
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
    addMember: async (data: any) => {
      const response = await axiosInstance.post('/employee/add-member', data);
      return response.data;
    },
    // NEW: Get all members for the search dropdown
    getAllMembers: async (): Promise<Member[]> => {
      try {
        const response = await axiosInstance.get('/members/all');
        return response.data;
      } catch (error) {
        return  handleError(error as AxiosError);
      }
    },

    // NEW: Post a workout or health log
    logActivity: async (memberId: number, activityType: string, details: any): Promise<any> => {
      try {
        const response = await axiosInstance.post('/employee/log-activity', {
          member_id: memberId,
          activity_type: activityType,
          details: details
        });
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
    
    getColleagues: async (): Promise<Employee[]> => {
      try {
        const response = await axiosInstance.get('/employee/colleagues');
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
    getAll: async () => {
      const response = await axiosInstance.get('/api/employees');
      return response.data;
    },
    
    // Updates salary and position
    update: async (id: number, data: { salary: number; position: string }) => {
      const response = await axiosInstance.patch(`/api/employees/${id}`, data);
      return response.data;
    },
    getSuppliers: async () => {
    try {
      const response = await axiosInstance.get('/suppliers');
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  },

  equipment: {
    getStatus: async (): Promise<{ summary: any[]; details: EquipmentAsset[] }> => {
      try {
        const response = await axiosInstance.get('/equipment/status');
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
    addMaintenanceLog: async (data: any) => {
      const response = await axiosInstance.post('/maintenance/logs', data);
      return response.data;
    },

    getMaintenanceLogs: async (): Promise<any[]> => {
      try {
        const response = await axiosInstance.get('/maintenance/logs');
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },


    getAll: async (): Promise<EquipmentAsset[]> => {
      try {
        const response = await axiosInstance.get('/employee/equipment');
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    update: async (id: number, status: string): Promise<EquipmentAsset> => {
      try {
        const response = await axiosInstance.patch(`/equipment/${id}`, { status });
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    }
  },

  

  inventory: {
    getAll: async (): Promise<InventoryItem[]> => {
      try {
        const response = await axiosInstance.get('/inventory/all');
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    update: async (id: number, data: { current_stock?: number; unit_selling_price?: number }): Promise<InventoryItem> => {
      try {
        const response = await axiosInstance.patch(`/inventory/${id}`, data);
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    purchaseItem: async (memberId: number, itemId: number, quantity: number) => {
      try {
        const response = await axiosInstance.post('/member/purchase', {
          member_id: memberId,
          item_id: itemId,
          quantity: quantity
        });
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    }
  },

  manager: {
    getAnalytics: async () => {
      try {
        const response = await axiosInstance.get('/manager/analytics');
        return {
          totalRevenue: response.data.total_revenue,
          totalExpenses: response.data.total_expenses,
          netProfit: response.data.net_profit,
        };
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },

    getStaff: async (): Promise<Employee[]> => {
      try {
        const response = await axiosInstance.get('/manager/staff');
        return response.data;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
  },
  
  chat: {
  sendMessage: async (message: string, userId: number, role: string) => {
    try {
      // The backend now expects a JSON body, not query parameters
      const response = await axiosInstance.post('/api/chat', {
        message: message,
        user_id: userId,
        role: role,
        session_id: `session-${userId}` // Add this to match the new Python model
      });
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },
},

  
};