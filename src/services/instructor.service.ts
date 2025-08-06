import { axiosInstance } from './api';
import { INSTRUCTOR_URL } from './endpoints';

export const InstructorService = {
  // Update instructor
  // Example body:
  // {
  //   "last_name": "Mohamed"
  // }
  update: (id: string, data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
  }) => axiosInstance.put(INSTRUCTOR_URL.UPDATE(id), data),
};
