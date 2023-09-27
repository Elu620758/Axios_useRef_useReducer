// src/UserList.js
import React, { useEffect, useRef, useReducer } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../api';

const initialState = {
  users: [],
  newUser: {},
  editingUserId: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_NEW_USER':
      return { ...state, newUser: action.payload };
    case 'SET_EDITING_USER':
      return { ...state, editingUserId: action.payload };
    case 'RESET_EDITING_USER':
      return { ...state, editingUserId: null };
    default:
      return state;
  }
};

const UserList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const nameInputRef = useRef(null);

  useEffect(() => {
    getAllUsers().then((users) => {
      dispatch({ type: 'SET_USERS', payload: users });
    });
  }, []);

  const handleAddUser = async () => {
    const newUser = { name: state.newUser.name };
    const addedUser = await createUser(newUser);
    dispatch({ type: 'SET_USERS', payload: [...state.users, addedUser] });
    dispatch({ type: 'SET_NEW_USER', payload: {} });
  };

  const handleEditUser = async (userId) => {
    const editedUser = { name: state.newUser.name };
    await updateUser(userId, editedUser);
    const updatedUsers = state.users.map((user) =>
      user.id === userId ? { ...user, ...editedUser } : user
    );
    dispatch({ type: 'SET_USERS', payload: updatedUsers });
    dispatch({ type: 'RESET_EDITING_USER' });
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    const updatedUsers = state.users.filter((user) => user.id !== userId);
    dispatch({ type: 'SET_USERS', payload: updatedUsers });
  };

  return (
    <div>
      <h1>User List</h1>
      <ul style={{ listStyle: 'none' }} class="list-group">
        {state.users.map((user) => (
          <li key={user.id} class="list-group-item">
            {state.editingUserId === user.id ? (
              <div>
                <input
                  type="text"
                  value={state.newUser.name || user.name}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_NEW_USER',
                      payload: { ...state.newUser, name: e.target.value },
                    })
                  }
                  ref={nameInputRef}
                />
                <button class="btn btn-success" onClick={() => handleEditUser(user.id)}>Save</button>
              </div>
            ) : (
              <div>
                {user.name}<br></br>
                <button type="button" class="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                <button type="button" class="btn btn-warning" onClick={() => dispatch({ type: 'SET_EDITING_USER', payload: user.id })}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Add new user"
          value={state.newUser.name || ''}
          onChange={(e) =>
            dispatch({ type: 'SET_NEW_USER', payload: { name: e.target.value } })
          }
        />
        <button onClick={handleAddUser}>Add</button>
      </div>
    </div>
  );
};

export default UserList;
