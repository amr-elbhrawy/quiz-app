"use client";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { QuizService } from "../../../services/quiz.service";
import { StudentService } from "../../../services/student.service";

interface CompletedQuiz {
  title: string;
  group: string;
  persons: number;
  date: string;
}

export const CompletedQuizzes = () => {
  const [completed, setCompleted] = useState<CompletedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب أسماء المجموعات أولاً
        const studentsRes = await StudentService.getAll();
        const uniqueGroups = studentsRes.data
          .map((student: any) => student.group)
          .filter(
            (group: any, index: number, self: any[]) =>
              group &&
              index === self.findIndex((g: any) => g?._id === group?._id)
          )
          .map((g: any) => ({ _id: g._id, name: g.name }));
        
        setGroups(uniqueGroups);
        console.log("📋 Available Groups:", uniqueGroups);

        // جلب الكويزات المكتملة
        const res = await QuizService.getCompleted();
        
        // معالجة البيانات
        let processedData: CompletedQuiz[] = [];
        
        if (res.data && Array.isArray(res.data)) {
          processedData = res.data.map((item: any, index: number) => {
            // استخراج اسم المجموعة
            let groupName = "No Group";
            const groupId = item.group;
            
            if (groupId) {
              const foundGroup = uniqueGroups.find(g => g._id === groupId);
              if (foundGroup) {
                groupName = foundGroup.name;
              } else {
                groupName = typeof groupId === 'string' && groupId.length > 10 
                  ? `Group ${groupId.substring(0, 8)}...` 
                  : groupId.toString();
              }
            }
            
            // استخراج عدد الأشخاص
            let personsCount = 0;
            if (item.participants && Array.isArray(item.participants)) {
              personsCount = item.participants.length;
            } else {
              const foundGroup = uniqueGroups.find(g => g._id === groupId);
              if (foundGroup) {
                const groupStudents = studentsRes.data.filter((s: any) => s.group?._id === groupId);
                personsCount = groupStudents.length;
              }
            }
            
            // استخراج التاريخ
            let displayDate = "No Date";
            if (item.closed_at) {
              displayDate = new Date(item.closed_at).toLocaleDateString('en-US');
            } else if (item.createdAt) {
              displayDate = new Date(item.createdAt).toLocaleDateString('en-US');
            } else if (item.schadule) {
              displayDate = new Date(item.schadule).toLocaleDateString('en-US');
            }
            
            return {
              title: item.title || `Quiz ${index + 1}`,
              group: groupName,
              persons: personsCount,
              date: displayDate
            };
          });
        }
        
        setCompleted(processedData);
        
      } catch (error) {
        console.error("❌ API Error:", error);
        toast.error("Failed to load completed quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
        <p>Loading...</p>
      </div>
    );
  }

  // عرض رسالة إذا لم توجد بيانات
  if (completed.length === 0) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Completed Quizzes</h2>
        <p className="text-gray-500">لا توجد اختبارات مكتملة</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
      {/* العنوان */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Completed Quizzes</h2>
        <button className="text-green-600 font-medium flex items-center hover:underline">
          Results <FaArrowRight className="ml-1" />
        </button>
      </div>

      {/* Debug Info - يمكن حذفها بعد التحقق */}
      <div className="bg-blue-100 p-2 mb-4 rounded text-sm">
        <strong>Debug Info:</strong> Found {completed.length} completed quiz(es)
        <br />
        <strong>Criteria:</strong> Quizzes with status="closed" and closed_at date
      </div>

      {/* عرض سطح المكتب */}
      <div className="hidden md:block">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Group name</th>
              <th className="p-2 text-left">No. of persons in group</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {completed.map((c, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.title}</td>
                <td className="p-2">{c.group}</td>
                <td className="p-2">{c.persons} persons</td>
                <td className="p-2">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* عرض الموبايل */}
      <div className="md:hidden space-y-3">
        {completed.map((c, i) => (
          <div
            key={i}
            className="border rounded-lg p-3 shadow-sm bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{c.title}</h3>
              <span className="text-xs text-gray-500">{c.date}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Group:</span> {c.group}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Persons:</span> {c.persons}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};