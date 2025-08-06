import { axiosInstance } from './api';
import { GROUP_URL } from './endpoints';

export const GroupService = {
  // Get all groups
  // No body required
  getAll: () => axiosInstance.get(GROUP_URL.GET_ALL),

  // Get group by ID
  getById: (id: string) => axiosInstance.get(GROUP_URL.GET_BY_ID(id)),

  // Create new group
  // Example body:
  // {
  //   "name": "B",
  //   "students": [
  //     "65c2dde8636d4da2ba22e250"
  //   ]
  // }
  create: (data: {
    name: string;
    students: string[];
  }) => axiosInstance.post(GROUP_URL.CREATE, data),

  // Update group
  // Example body:
  // {
  //   "name": "A",
  //   "students": [
  //     "65c278780ba99c760533e0a3",
  //     "65c271dbd7bcdd639a80102d"
  //   ]
  // }
  update: (id: string, data: {
    name: string;
    students: string[];
  }) => axiosInstance.put(GROUP_URL.UPDATE(id), data),

  // Delete group
  // No body required
  delete: (id: string) => axiosInstance.delete(GROUP_URL.DELETE(id)),
};
