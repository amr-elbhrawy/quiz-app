import { axiosInstance } from './api';
import { STUDENT_URL } from './endpoints';

export const StudentService = {
  //    Get all students
  // No body required
  getAll: () => axiosInstance.get(STUDENT_URL.GET_ALL),

  //    Get all students without group
  // No body required
  getAllWithoutGroup: () => axiosInstance.get(STUDENT_URL.GET_ALL_WITHOUT_GROUP),

  //    Get student by ID
  getById: (id: string) => axiosInstance.get(STUDENT_URL.GET_BY_ID(id)),

  //    Delete student by ID
  delete: (id: string) => axiosInstance.delete(STUDENT_URL.DELETE(id)),

  //    Delete student from a group
  // No body required
  deleteFromGroup: (studentId: string, groupId: string) =>
    axiosInstance.delete(STUDENT_URL.DELETE_FROM_GROUP(studentId, groupId)),

  //    Add student to group
  // No body required  
  addToGroup: (studentId: string, groupId: string) =>
    axiosInstance.get(STUDENT_URL.ADD_TO_GROUP(studentId, groupId)),

  //    Update student group
  // {
  //   "group": "Group A"
  // }
  updateGroup: (studentId: string, groupId: string) =>
    axiosInstance.put(STUDENT_URL.UPDATE_GROUP(studentId, groupId)),

  //    Get top 5 students
  topFive: () => axiosInstance.get(STUDENT_URL.TOP_FIVE),

  //    Update my student account  
//   {
//     "last_name":"Mohamed"
// }
  updateMyAccount: (data: {
    first_name: string;
    last_name: string;
    email: string;
  }) => axiosInstance.put(STUDENT_URL.UPDATE_MY_ACCOUNT, data),
};
