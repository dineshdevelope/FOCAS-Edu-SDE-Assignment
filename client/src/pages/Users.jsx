import { useState, useEffect } from 'react';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { API_BASE_URL } from '../config';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreate = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        fetchUsers();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdate = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        fetchUsers();
        setEditingUser(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add New User
        </button>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}

      <UserList
        users={users}
        onEdit={(user) => {
          setEditingUser(user);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Users;