"use client";

import { useEffect, useState } from "react";
import { StudentService } from "../../services/student.service";
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import CustomPagination from "@/app/components/shared/CustomPagination";
import ViewStudentModal from "./ViewGroupModal";

export interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  role: string;
  group?: { name: string };
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [fade, setFade] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 21;
  const totalPages = Math.ceil(students.length / itemsPerPage);

  useEffect(() => {
    StudentService.getAll()
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handlePageChange = (newPage: number) => {
    setFade(false);
    setTimeout(() => {
      setPage(newPage);
      setFade(true);
    }, 200);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;

  const currentData = students.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 flex flex-col min-h-screen">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6">
        Students List
      </h1>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        } min-h-[500px]`}
      >
        {currentData.map((student) => (
          <div
            key={student._id}
            className="flex items-center justify-between p-3 sm:p-4 border rounded-lg shadow-sm bg-white w-full"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/student.png"
                alt="Graduation"
                width={40}
                height={40}
                className="sm:w-[48px] sm:h-[48px] lg:w-[56px] lg:h-[56px]"
              />
              <span className="capitalize text-sm sm:text-base lg:text-lg">
                {student.first_name} {student.last_name}
              </span>
            </div>
            <FaEye
              className="text-green-600 cursor-pointer text-lg sm:text-xl lg:text-2xl"
              onClick={() => handleViewStudent(student)}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-auto">
          <CustomPagination
            totalPages={totalPages}
            page={page}
            setPage={handlePageChange}
          />
        </div>
      )}

      {/* مودال عرض تفاصيل الطالب */}
      <ViewStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}
