import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { MemberProfile } from './pages/member/MemberProfile';
import { ClassesPage as MemberClassesPage } from './pages/member/ClassesPage';
import { SubscriptionPage } from './pages/member/SubscriptionPage';
import { PurchaseHistory } from './pages/member/PurchaseHistory';
import { FitnessJourney } from './pages/member/FitnessJourney';
import { ShopPage } from './pages/member/ShopPage';
import { EquipmentPage as MemberEquipmentPage } from './pages/member/EquipmentPage';
import { EquipmentPage as EmployeeEquipmentPage } from './pages/employee/EquipmentPage';
import { InventoryPage as EmployeeInventoryPage } from './pages/employee/InventoryPage';
import { MyClassesPage as EmployeeMyClassesPage } from './pages/employee/MyClassesPage';
import {  LogEntryPage } from './pages/employee/LogEntryPage';
import { MembersPage  } from './pages/employee/MembersPage';
import { SuppliersPage } from './pages/employee/SuppliersPage';
import { MaintenanceLogsPage } from './pages/employee/MaintenanceLogsPage';
import { ManageClassesPage } from './pages/employee/ManageClassesPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ChatBubble } from './components/ChatBubble';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Card } from './components/Card';
import { EmployeeProfilePage } from './pages/employee/EmployeeProfilePage';
import { StaffManagementPage } from './pages/manager/StaffManagementPage';

const MemberPlaceholder = ({ path }: { path: string }) => (
  <DashboardLayout>
    <Card>
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
        <p className="text-slate-400">{path} page is under development</p>
      </div>
    </Card>
  </DashboardLayout>
);

const EmployeePlaceholder = ({ path }: { path: string }) => (
  <DashboardLayout>
    <Card>
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
        <p className="text-slate-400">{path} page is under development</p>
      </div>
    </Card>
  </DashboardLayout>
);

const ManagerPlaceholder = ({ path }: { path: string }) => (
  <DashboardLayout>
    <Card>
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
        <p className="text-slate-400">{path} page is under development</p>
      </div>
    </Card>
  </DashboardLayout>
);

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/member/classes" element={<ProtectedRoute requiredRole="Member"><MemberClassesPage /></ProtectedRoute>} />
        <Route path="/member/fitness" element={<ProtectedRoute requiredRole="Member"><FitnessJourney /></ProtectedRoute>} />
        <Route path="/member/plans" element={<ProtectedRoute requiredRole="Member"><SubscriptionPage /></ProtectedRoute>} />
        <Route path="/member/profile" element={<ProtectedRoute requiredRole="Member"><MemberProfile  /></ProtectedRoute>} />
        {/* <Route path="/member/profile" element={<MemberProfile />} /> */}
        <Route path="/member/purchases" element={<ProtectedRoute requiredRole="Member"><PurchaseHistory /></ProtectedRoute>} />
        <Route path="/member/shop" element={<ProtectedRoute requiredRole="Member"><ShopPage /></ProtectedRoute>} />
        <Route path="/member/equipment" element={<ProtectedRoute requiredRole="Member"><MemberEquipmentPage /></ProtectedRoute>} />

        <Route path="/employee/classes" element={<ProtectedRoute requiredRole="Employee"><EmployeeMyClassesPage /></ProtectedRoute>} />
        <Route path="/employee/manage-classes" element={<ProtectedRoute requiredRole="Employee"><ManageClassesPage /></ProtectedRoute>} />
        <Route path="/employee/equipment" element={<ProtectedRoute requiredRole="Employee"><EmployeeEquipmentPage /></ProtectedRoute>} />
        <Route path="/employee/inventory" element={<ProtectedRoute requiredRole="Employee"><EmployeeInventoryPage /></ProtectedRoute>} />
        <Route path="/employee/colleagues" element={<ProtectedRoute requiredRole="Employee"><EmployeePlaceholder path="Colleagues" /></ProtectedRoute>} />
        <Route path="/employee/maintenance" element={<ProtectedRoute requiredRole="Employee"><MaintenanceLogsPage /></ProtectedRoute>} />
        <Route path="/employee/profile" element={<ProtectedRoute requiredRole="Employee"><EmployeeProfilePage /></ProtectedRoute>} />
        <Route path="/employee/members" element={<ProtectedRoute requiredRole="Employee"><MembersPage /></ProtectedRoute>}/>
        <Route   path="/employee/log-entry"   element={    <ProtectedRoute requiredRole="Employee"> <LogEntryPage /> </ProtectedRoute>} />
        <Route path="/employee/suppliers" element={<ProtectedRoute requiredRole="Employee"><SuppliersPage /></ProtectedRoute>} 
/>
        
        {/* <Route path="/manager/analytics" element={<ProtectedRoute requiredRole="Manager"><ManagerPlaceholder path="Analytics" /></ProtectedRoute>} /> */}
        <Route path="/manager/staff" element={<ProtectedRoute requiredRole="Manager"><StaffManagementPage /></ProtectedRoute>} />
        <Route path="/manager/classes" element={<ProtectedRoute requiredRole="Manager"><ManageClassesPage /></ProtectedRoute>} />
        <Route path="/manager/equipment" element={<ProtectedRoute requiredRole="Manager"><EmployeeEquipmentPage /></ProtectedRoute>} />
        <Route path="/manager/inventory" element={<ProtectedRoute requiredRole="Manager"><EmployeeInventoryPage /></ProtectedRoute>} />
        <Route path="/manager/suppliers" element={<ProtectedRoute requiredRole="Manager"><SuppliersPage /></ProtectedRoute>} />
        <Route path="/manager/members" element={<ProtectedRoute requiredRole="Manager"><MembersPage /></ProtectedRoute>} />
        {/* <Route path="/manager/reports" element={<ProtectedRoute requiredRole="Manager"><ManagerPlaceholder path="Reports" /></ProtectedRoute>} /> */}

        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isAuthenticated && <ChatBubble />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
