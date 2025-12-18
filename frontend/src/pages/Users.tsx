import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import type { User } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/Modal';
import { Users as UsersIcon, Edit, Trash2, Shield, User as UserIcon, Mail, Calendar } from 'lucide-react';
import './Users.css';

export const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersList = await userService.getAll();
      setUsers(usersList);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      if (error.response?.status === 403) {
        alert('Only ADMIN can view users. You do not have permission.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!editingUser) return;
    try {
      await userService.updateRole(editingUser.id, selectedRole);
      setShowRoleModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update user role. Please try again.');
    }
  };

  const handleDelete = async (id: number, email: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own account.');
      return;
    }
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }
    try {
      await userService.delete(id);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const openRoleModal = (user: User) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'role-badge admin';
      case 'MEMBER':
        return 'role-badge member';
      case 'GUEST':
        return 'role-badge guest';
      default:
        return 'role-badge';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="role-icon" />;
      default:
        return <UserIcon className="role-icon" />;
    }
  };

  if (loading) {
    return (
      <div className="users-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="users-page">
        <div className="content-section">
          <div className="access-denied">
            <Shield className="denied-icon" />
            <h2>Access Denied</h2>
            <p>Only administrators can view and manage users.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="content-section">
        <div className="page-header">
          <div>
            <h1>User Management</h1>
            <p>Manage users and their roles</p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <UsersIcon className="empty-icon" />
            <h3>No users found</h3>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <div className="user-email">
                        <Mail className="icon-small" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td>{user.username}</td>
                    <td>
                      <span className={getRoleBadgeClass(user.role)}>
                        {getRoleIcon(user.role)}
                        <span>{user.role}</span>
                      </span>
                    </td>
                    <td>
                      <div className="date-cell">
                        <Calendar className="icon-small" />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-actions">
                        <button
                          className="icon-btn"
                          onClick={() => openRoleModal(user)}
                          title="Change role"
                        >
                          <Edit />
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            className="icon-btn danger"
                            onClick={() => handleDelete(user.id, user.email)}
                            title="Delete user"
                          >
                            <Trash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setEditingUser(null);
        }}
        title="Change User Role"
        size="small"
      >
        {editingUser && (
          <div className="role-form">
            <div className="form-group">
              <label className="form-label">User</label>
              <div className="user-info">
                <strong>{editingUser.email}</strong>
                <span className="current-role">Current: {editingUser.role}</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                New Role
              </label>
              <select
                id="role"
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'GUEST' | 'MEMBER' | 'ADMIN')}
              >
                <option value="GUEST">GUEST</option>
                <option value="MEMBER">MEMBER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowRoleModal(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRoleUpdate}
              >
                Update Role
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

