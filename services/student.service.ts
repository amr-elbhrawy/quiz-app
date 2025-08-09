import { axiosInstance } from './api';
import { STUDENT_URL } from './endpoints';

export const StudentService = {
  //    Get all students
    // {
    //     "_id": "669f775dc85f1ecdbc306201",
    //     "first_name": "omair",
    //     "last_name": "Mohammed",
    //     "email": "elrosyomair@gmail.com",
    //     "status": "active",
    //     "role": "Student",
    //     "group": {
    //         "_id": "66ce2247c85f1ecdbc313006",
    //         "name": "Group1",
    //         "status": "active",
    //         "instructor": "66ce2073c85f1ecdbc312fb6",
    //         "students": [
    //             "669f775dc85f1ecdbc306201",
    //             "66a14742c85f1ecdbc30663b"
    //         ],
    //         "max_students": 25,
    //         "updatedAt": "2025-08-07T09:44:22.434Z",
    //         "createdAt": "2024-08-27T19:00:23.773Z",
    //         "__v": 0
    //     }
    // },
      getAll: () => axiosInstance.get(STUDENT_URL.GET_ALL),

  //    Get all students without group
     // {
    //     "_id": "6895151f44dab7b8cb065533",
    //     "first_name": "Heba",
    //     "last_name": "Saber",
    //     "email": "heba@gmail.com",
    //     "status": "active",
    //     "role": "Student"
    // },

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
