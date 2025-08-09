"use client";

import { useEffect, useState } from "react";
import { StudentService } from "../../services/student.service";
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import CustomPagination from "@/app/components/shared/CustomPagination";

export interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  role: string;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [fade, setFade] = useState(true);

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

  if (loading) return <p>Loading...</p>;

  const currentData = students.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-6 flex flex-col min-h-screen">
      <h1 className="text-xl font-bold mb-6">Students List</h1>

      {/* محتوى ثابت الارتفاع */}
      <div
        className={`grid grid-cols-3 gap-4 mb-6 transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        } min-h-[500px]`}
      >
        {currentData.map((student) => (
          <div
            key={student._id}
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/student.png"
                alt="Graduation"
                width={40}
                height={40}
              />
              <span className="capitalize">
                {student.first_name} {student.last_name}
              </span>
            </div>
            <FaEye className="text-green-600 cursor-pointer" />
          </div>
        ))}
      </div>

      {/* الباجينشن دايمًا في الأسفل */}
      {totalPages > 1 && (
        <div className="mt-auto">
          <CustomPagination
            totalPages={totalPages}
            page={page}
            setPage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
