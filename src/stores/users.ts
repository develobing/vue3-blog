import { defineStore } from 'pinia';
import { fetchApi } from '../api';
import { NewUser } from '../users';

export const useUsers = defineStore('users', {
  actions: {
    createUser(newUser: NewUser) {
      return fetchApi('/api/users', {
        method: 'POST',
        data: newUser,
      });
    },
  },
});
