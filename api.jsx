// src/api.js
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const getAllUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createUser = async (user) => {
  const response = await axios.post(API_URL, user);
  return response.data;
};

const updateUser = async (userId, updatedUser) => {
  const response = await axios.put(`${API_URL}/${userId}`, updatedUser);
  return response.data;
};

const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/${userId}`);
  return response.data;
};

export { getAllUsers, createUser, updateUser, deleteUser };
