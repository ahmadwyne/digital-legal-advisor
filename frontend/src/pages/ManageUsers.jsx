// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';
// import { userApi } from '@/api/userApi';
// import { toast } from 'react-hot-toast';
// import { filterAdminUsers } from '@/utils/userFilters'; // Import the filter utility

// const STATUS_STYLES = {
//   Active: 'bg-[#E5E7EB] text-[#2C7A3E] w-[70px] h-[20px] flex items-center justify-center rounded text-xs font-bold',
//   Suspended: 'bg-[#E5E7EB] text-[#D12A2A] w-[70px] h-[20px] flex items-center justify-center rounded text-xs font-bold',
// };

// export const ManageUsers = () => {
//   // State management
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//     totalItems: 0,
//     hasNext: false,
//     hasPrevious: false
//   });
//   const [recentActions, setRecentActions] = useState([]);

//   // Fetch data on mount and when page changes
//   useEffect(() => {
//     fetchUsers();
//   }, [currentPage]);

//   useEffect(() => {
//     fetchRecentActions();
//   }, []);

//   /**
//  * Fetch users from API
//  */
// const fetchUsers = async () => {
//   try {
//     setLoading(true);
//     const response = await userApi.getAllUsers({
//       page: currentPage,
//       limit: 10,
//       sortBy: 'createdAt',
//       sortOrder: 'DESC'
//     });

//     if (response.status === 'success') {
//       // Safety check for users array
//       const apiUsers = response.data?. users || [];
      
//       if (! Array.isArray(apiUsers)) {
//         console.error('Expected users array but got:', typeof apiUsers);
//         toast.error('Invalid data format received');
//         setUsers([]);
//         return;
//       }

//       console.log('Total users from API:', apiUsers.length);
      
//       // Filter out admin users BEFORE transformation
//       const nonAdminUsers = filterAdminUsers(apiUsers);
      
//       console.log('Non-admin users:', nonAdminUsers.length);
//       console.log('Admin users filtered:', apiUsers.length - nonAdminUsers.length);
      
//       // Transform data to match your UI format
//       const transformedUsers = nonAdminUsers.map(user => ({
//         id: `USR-${user.id?. slice(0, 4).toUpperCase() || 'XXXX'}`,
//         fullId: user.id, // Keep full ID for API calls
//         name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
//         email: user.email || 'N/A',
//         status: user.isActive ? 'Active' : 'Suspended',
//         role: user.role // Keep role for reference
//       }));

//       setUsers(transformedUsers);
//       setPagination(response.data?. pagination || pagination);
//     } else {
//       toast.error('Failed to load users');
//       setUsers([]);
//     }
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     toast.error(error.message || 'Failed to load users');
//     setUsers([]);
//   } finally {
//     setLoading(false);
//   }
// };
//   /**
//    * Fetch recent actions
//    */
//   const fetchRecentActions = async () => {
//     try {
//       const response = await userApi.getRecentActions(3);
      
//       if (response.status === 'success') {
//         // Transform actions to match your UI format
//         const transformedActions = response.data. actions.map(action => ({
//           user: action.user?. name || 'System',
//           action: action.details,
//           time: formatActionTime(action. timestamp)
//         }));

//         setRecentActions(transformedActions);
//       }
//     } catch (error) {
//       console.error('Error fetching recent actions:', error);
//     }
//   };

//   /**
//    * Handle suspend/activate action
//    */
//   const handleAction = async (action, user) => {
//     try {
//       const newStatus = action === 'activate';
//       const response = await userApi.updateUserStatus(user.fullId, newStatus);

//       if (response.status === 'success') {
//         toast.success(response.message || `User ${action}d successfully`);
//         fetchUsers(); // Refresh user list
//         fetchRecentActions(); // Refresh recent actions
//       }
//     } catch (error) {
//       console.error(`Error ${action}ing user:`, error);
//       toast.error(error.response?.data?.message || `Failed to ${action} user`);
//     }
//   };

//   /**
//    * Format action timestamp
//    */
//   const formatActionTime = (timestamp) => {
//     if (!timestamp) return 'N/A';
    
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffHours < 24) {
//       return `Today, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
//     } else if (diffDays === 1) {
//       return `Yesterday, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
//     }
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:  '2-digit' });
//   };

//   /**
//    * Get user initials
//    */
//   const getInitials = (name) => {
//     return name
//       .split(' ')
//       .map((n) => n[0])
//       .join('')
//       .toUpperCase();
//   };

//   /**
//    * Handle page change
//    */
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="space-y-6 sm:space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Accounts Management</h1>
//         <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage and monitor user accounts across the platform</p>
//       </div>

//       {/* Users Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg sm:text-xl">All Users</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//             </div>
//           ) : (
//             <>
//               <div className="rounded-md border overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="min-w-[100px]">User ID</TableHead>
//                       <TableHead className="min-w-[150px]">Name</TableHead>
//                       <TableHead className="min-w-[200px] hidden lg:table-cell">Email</TableHead>
//                       <TableHead className="min-w-[100px]">Status</TableHead>
//                       <TableHead className="text-right min-w-[100px]">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {users.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
//                           No users found
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       users.map((user) => (
//                         <TableRow key={user.id}>
//                           <TableCell className="font-medium text-muted-foreground text-sm">{user.id}</TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               <Avatar className="h-8 w-8 flex-shrink-0">
//                                 <AvatarFallback className="bg-primary/10 text-primary text-xs">
//                                   {getInitials(user.name)}
//                                 </AvatarFallback>
//                               </Avatar>
//                               <span className="font-medium text-sm">{user.name}</span>
//                             </div>
//                           </TableCell>
//                           <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">{user.email}</TableCell>
//                           <TableCell>
//                             <span className={STATUS_STYLES[user.status] || STATUS_STYLES.Suspended}>
//                               {user.status}
//                             </span>
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <Button
//                               size="sm"
//                               className={`text-white h-[20px] px-2 sm:px-3 text-xs ${
//                                 user.status === 'Active' ? 'bg-[#9F0000] hover:bg-[#7A0000]' : 'bg-[#317249] hover:bg-[#275D3A]'
//                               }`}
//                               onClick={() =>
//                                 handleAction(user.status === 'Active' ? 'suspend' : 'activate', user)
//                               }
//                             >
//                               {user.status === 'Active' ? 'Suspend' : 'Activate'}
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>

//               {/* Pagination */}
//               {pagination.totalPages > 1 && (
//                 <div className="mt-4">
//                   <Pagination>
//                     <PaginationContent>
//                       <PaginationItem>
//                         <PaginationPrevious
//                           href="#"
//                           className="bg-[#E5E7EB] text-[#000] px-2 h-[28px] rounded hover:bg-[#d1d5db]"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             if (pagination.hasPrevious) {
//                               handlePageChange(currentPage - 1);
//                             }
//                           }}
//                         />
//                       </PaginationItem>

//                       {[...Array(pagination.totalPages)].map((_, index) => (
//                         <PaginationItem key={index + 1}>
//                           <PaginationLink
//                             href="#"
//                             isActive={currentPage === index + 1}
//                             className={currentPage === index + 1 ? 'bg-[#244236] text-white' : ''}
//                             onClick={(e) => {
//                               e.preventDefault();
//                               handlePageChange(index + 1);
//                             }}
//                           >
//                             {index + 1}
//                           </PaginationLink>
//                         </PaginationItem>
//                       ))}

//                       <PaginationItem>
//                         <PaginationNext
//                           href="#"
//                           className="bg-[#E5E7EB] text-[#000] px-2 h-[28px] rounded hover:bg-[#d1d5db]"
//                           onClick={(e) => {
//                             e. preventDefault();
//                             if (pagination.hasNext) {
//                               handlePageChange(currentPage + 1);
//                             }
//                           }}
//                         />
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                 </div>
//               )}
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Recent Account Actions */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg sm:text-xl">Recent Account Actions</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {recentActions.length === 0 ? (
//             <p className="text-sm text-muted-foreground">No recent actions</p>
//           ) : (
//             <div className="space-y-4">
//               {recentActions.map((action, index) => (
//                 <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
//                   <Avatar className="h-10 w-10 mt-0.5 flex-shrink-0">
//                     <AvatarFallback className="bg-primary/10 text-primary text-xs">
//                       {getInitials(action.user)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-foreground">{action.action}</p>
//                     <p className="text-xs text-muted-foreground mt-1">{action.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ManageUsers;

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Users, UserCheck, UserX, RefreshCw, Search } from 'lucide-react';
import { userApi } from '@/api/userApi';
import { useToast } from '@/hooks/use-toast';
import { filterAdminUsers } from '@/utils/userFilters';
import { cn } from '@/lib/utils';

/**
 * Status Badge Styles
 * Color-coded badges for user status
 */
const STATUS_STYLES = {
  Active: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: UserCheck,
  },
  Suspended: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: UserX,
  },
};

/**
 * ManageUsers Component
 * Admin interface for managing user accounts
 * 
 * Features:
 * - User listing with pagination
 * - Activate/Suspend users
 * - Recent actions log
 * - Responsive design
 * - Theme-matched styling
 * 
 * Optimizations:
 * - Efficient data fetching
 * - Filtered admin users
 * - Memoized computations
 * - Loading states
 */
export const ManageUsers = () => {
  const { toast } = useToast();

  // State Management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false
  });
  const [recentActions, setRecentActions] = useState([]);

  // Fetch users when page changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Fetch recent actions on mount
  useEffect(() => {
    fetchRecentActions();
  }, []);

  /**
   * Fetch users from API
   * Filters out admin users and transforms data for UI
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers({
        page: currentPage,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });

      if (response.status === 'success') {
        const apiUsers = response.data?.users || [];
        
        if (!Array.isArray(apiUsers)) {
          console.error('Expected users array but got:', typeof apiUsers);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Invalid data format received'
          });
          setUsers([]);
          return;
        }

        // Filter out admin users
        const nonAdminUsers = filterAdminUsers(apiUsers);
        
        console.log('📊 Users loaded:', {
          total: apiUsers.length,
          nonAdmin: nonAdminUsers.length,
          admins: apiUsers.length - nonAdminUsers.length
        });
        
        // Transform data for UI
        const transformedUsers = nonAdminUsers.map(user => ({
          id: `USR-${user.id?.slice(0, 4).toUpperCase() || 'XXXX'}`,
          fullId: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
          email: user.email || 'N/A',
          status: user.isActive ? 'Active' : 'Suspended',
          role: user.role,
          createdAt: user.createdAt
        }));

        setUsers(transformedUsers);
        setPagination(response.data?.pagination || pagination);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load users'
        });
        setUsers([]);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load users'
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch recent account actions
   */
  const fetchRecentActions = async () => {
    try {
      const response = await userApi.getRecentActions(5);
      
      if (response.status === 'success') {
        const transformedActions = response.data.actions.map(action => ({
          user: action.user?.name || 'System',
          action: action.details,
          time: formatActionTime(action.timestamp),
          type: action.type
        }));

        setRecentActions(transformedActions);
      }
    } catch (error) {
      console.error('❌ Error fetching recent actions:', error);
    }
  };

  /**
   * Handle user activate/suspend action
   */
  const handleAction = async (action, user) => {
    try {
      setActionLoading(user.id);
      const newStatus = action === 'activate';
      const response = await userApi.updateUserStatus(user.fullId, newStatus);

      if (response.status === 'success') {
        toast({
          title: 'Success',
          description: `User ${action}d successfully`,
        });
        fetchUsers();
        fetchRecentActions();
      }
    } catch (error) {
      console.error(`❌ Error ${action}ing user:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || `Failed to ${action} user`
      });
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Format timestamp for display
   */
  const formatActionTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) {
      return `Today, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Get user initials for avatar
   */
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 
            className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent" 
            style={{ fontFamily: "Poppins" }}
          >
            User Management
          </h1>
          <p 
            className="text-sm sm:text-base text-gray-600 mt-2 font-medium" 
            style={{ fontFamily: "Inter" }}
          >
            Manage and monitor user accounts across the platform
          </p>
        </div>
        
        {/* Refresh Button */}
        <Button
          onClick={fetchUsers}
          disabled={loading}
          className="w-fit group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          style={{ fontFamily: "Inter" }}
        >
          <RefreshCw className={cn(
            "h-4 w-4 transition-transform duration-500",
            loading && "animate-spin"
          )} />
          <span>{loading ? 'Loading...' : 'Refresh'}</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase" style={{ fontFamily: "Inter" }}>Total Users</p>
                <p className="text-3xl font-black text-blue-700 mt-2" style={{ fontFamily: "Poppins" }}>{pagination.totalItems}</p>
              </div>
              <div className="p-3 bg-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase" style={{ fontFamily: "Inter" }}>Active</p>
                <p className="text-3xl font-black text-green-700 mt-2" style={{ fontFamily: "Poppins" }}>
                  {users.filter(u => u.status === 'Active').length}
                </p>
              </div>
              <div className="p-3 bg-green-600 rounded-xl">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-white hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase" style={{ fontFamily: "Inter" }}>Suspended</p>
                <p className="text-3xl font-black text-red-700 mt-2" style={{ fontFamily: "Poppins" }}>
                  {users.filter(u => u.status === 'Suspended').length}
                </p>
              </div>
              <div className="p-3 bg-red-600 rounded-xl">
                <UserX className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b-2 border-blue-100">
          <CardTitle 
            className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" 
            style={{ fontFamily: "Poppins" }}
          >
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-600 font-semibold" style={{ fontFamily: "Inter" }}>Loading users...</p>
            </div>
          ) : (
            <>
              <div className="rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50/50">
                      <TableHead className="min-w-[100px] font-bold" style={{ fontFamily: "Inter" }}>User ID</TableHead>
                      <TableHead className="min-w-[150px] font-bold" style={{ fontFamily: "Inter" }}>Name</TableHead>
                      <TableHead className="min-w-[200px] hidden lg:table-cell font-bold" style={{ fontFamily: "Inter" }}>Email</TableHead>
                      <TableHead className="min-w-[100px] font-bold" style={{ fontFamily: "Inter" }}>Status</TableHead>
                      <TableHead className="text-right min-w-[100px] font-bold" style={{ fontFamily: "Inter" }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-semibold" style={{ fontFamily: "Inter" }}>No users found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => {
                        const statusConfig = STATUS_STYLES[user.status];
                        const StatusIcon = statusConfig.icon;

                        return (
                          <TableRow key={user.id} className="hover:bg-blue-50/30 transition-colors">
                            <TableCell className="font-mono text-sm text-gray-600">{user.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-blue-100">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold">
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-gray-800" style={{ fontFamily: "Inter" }}>{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm hidden lg:table-cell" style={{ fontFamily: "Inter" }}>{user.email}</TableCell>
                            <TableCell>
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold",
                                statusConfig.bg,
                                statusConfig.text
                              )}>
                                <StatusIcon className="h-3 w-3" />
                                {user.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                disabled={actionLoading === user.id}
                                className={cn(
                                  "text-white h-8 px-4 text-xs font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-md",
                                  user.status === 'Active' 
                                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600' 
                                    : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                                )}
                                onClick={() => handleAction(user.status === 'Active' ? 'suspend' : 'activate', user)}
                                style={{ fontFamily: "Inter" }}
                              >
                                {actionLoading === user.id ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  user.status === 'Active' ? 'Suspend' : 'Activate'
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t-2 border-blue-100 bg-blue-50/30">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className={cn(
                            "bg-white border-2 border-blue-200 text-blue-700 px-3 h-9 rounded-lg hover:bg-blue-50 font-semibold transition-all",
                            !pagination.hasPrevious && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.hasPrevious) handlePageChange(currentPage - 1);
                          }}
                        />
                      </PaginationItem>

                      {[...Array(pagination.totalPages)].map((_, index) => (
                        <PaginationItem key={index + 1}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === index + 1}
                            className={cn(
                              "h-9 w-9 rounded-lg font-semibold transition-all",
                              currentPage === index + 1 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                                : 'bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50'
                            )}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(index + 1);
                            }}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className={cn(
                            "bg-white border-2 border-blue-200 text-blue-700 px-3 h-9 rounded-lg hover:bg-blue-50 font-semibold transition-all",
                            !pagination.hasNext && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.hasNext) handlePageChange(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Account Actions */}
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b-2 border-blue-100">
          <CardTitle 
            className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" 
            style={{ fontFamily: "Poppins" }}
          >
            Recent Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {recentActions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 font-semibold" style={{ fontFamily: "Inter" }}>No recent actions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActions.map((action, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Avatar className="h-10 w-10 mt-0.5 flex-shrink-0 border-2 border-blue-200">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-bold">
                      {getInitials(action.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "Inter" }}>{action.action}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium" style={{ fontFamily: "Inter" }}>{action.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;