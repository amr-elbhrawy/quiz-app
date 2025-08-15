"use client";

import { useEffect, useState } from "react";
import { StudentService } from "../../../services/student.service";
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import CustomPagination from "@/app/components/shared/CustomPagination";
import ViewStudentModal from "./ViewGroupModal";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

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

  const itemsPerPage = 21;
  const currentData = students.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await StudentService.getAll();
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handlePageChange = (newPage: number) => {
    setFade(false);
    setTimeout(() => {
      setPage(newPage);
      setFade(true);
    }, 200);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <LoadingSkeletonCard key={i} height="80px" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Students List</h1>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentData.map((student) => (
          <StudentCard 
            key={student._id}
            student={student}
            onView={() => setSelectedStudent(student)}
          />
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

      <ViewStudentModal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
      />
    </div>
  );
}

function StudentCard({
  student,
  onView
}: {
  student: Student;
  onView: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <Image
          src="/student.png"
          alt={`${student.first_name} ${student.last_name}`}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <p className="font-medium capitalize">
            {student.first_name} {student.last_name}
          </p>
          <p className="text-sm text-gray-500 truncate max-w-[120px]">
            {student.email}
          </p>
        </div>
      </div>
      <button 
        onClick={onView}
        className="cursor-pointer text-green-600 hover:text-green-700 transition-colors"
        aria-label="View student details"
      >
        <FaEye className="text-xl" />
      </button>
    </div>
  );
}