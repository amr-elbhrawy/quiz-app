"use client";
import { useEffect, useState, useCallback } from "react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { QuizService } from "../../../services/quiz.service";
import { StudentService } from "../../../services/student.service";

interface UpcomingQuiz {
  title: string;
  date: string;
  time: string;
  students: number;
  img: string;
  quizId: string;
  status: string;
}

interface UpcomingQuizzesProps {
  refreshTrigger?: number;
}

export const UpcomingQuizzes = ({ refreshTrigger }: UpcomingQuizzesProps) => {
  const [allQuizzes, setAllQuizzes] = useState<UpcomingQuiz[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      
      const studentsRes = await StudentService.getAll();
      const uniqueGroups = studentsRes.data
        .map((student: any) => student.group)
        .filter(
          (group: any, index: number, self: any[]) =>
            group &&
            index === self.findIndex((g: any) => g?._id === group?._id)
        )
        .map((g: any) => ({ _id: g._id, name: g.name }));

      const res = await QuizService.getAll();
      
      if (!res.data || !Array.isArray(res.data)) {
        setAllQuizzes([]);
        return;
      }

      const sortedQuizzes = res.data.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.created_at || 0);
        const dateB = new Date(b.createdAt || b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      });

      const processedData: UpcomingQuiz[] = sortedQuizzes.map((item: any, index: number) => {
        let studentsCount = 0;
        const groupId = item.group;
        
        if (groupId) {
          const groupStudents = studentsRes.data.filter((s: any) => s.group?._id === groupId);
          studentsCount = groupStudents.length;
        }
        
        let displayDate = "No Date";
        let displayTime = "No Time";
        
        if (item.schadule) {
          try {
            const scheduleDateTime = new Date(item.schadule);
            if (!isNaN(scheduleDateTime.getTime())) {
              displayDate = scheduleDateTime.toLocaleDateString('en-US');
              displayTime = scheduleDateTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
            }
          } catch (error) {
            console.warn("Date parsing error:", error);
          }
        }
        
        const getQuizImage = (type: string) => {
          const images = {
            FE: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='%23f97316'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z'/%3E%3C/svg%3E",
            BE: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='%2306b6d4'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z'/%3E%3C/svg%3E"
          };
          return images[type as keyof typeof images] || images.FE;
        };
        
        return {
          title: item.title || `Quiz ${index + 1}`,
          date: displayDate,
          time: displayTime,
          students: studentsCount,
          img: getQuizImage(item.type),
          quizId: item._id,
          status: item.status || 'active'
        };
      });
      
      setAllQuizzes(processedData);
      
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcomingQuizzes();
  }, [fetchUpcomingQuizzes, refreshTrigger]);

  // اعرض أول 5 أو كل الكويزات حسب الحالة
  const displayedQuizzes = showAll ? allQuizzes : allQuizzes.slice(0, 5);
  const hasMoreQuizzes = allQuizzes.length > 5;

  if (loading) {
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Upcoming quizzes</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {showAll ? allQuizzes.length : Math.min(5, allQuizzes.length)} of {allQuizzes.length}
        </span>
      </div>
      
      {allQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📝</div>
          <p className="text-gray-500">No quizzes found</p>
          <p className="text-sm text-gray-400 mt-1">Create your first quiz to get started</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {displayedQuizzes.map((q, i) => (
              <div
                key={`${q.quizId}-${i}`}
                className="flex items-center gap-4 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-20 h-20 bg-orange-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={q.img} alt={q.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{q.title}</h3>
                  <p className="text-sm text-gray-500">
                    {q.date} │ {q.time}
                  </p>
                  <p className="text-sm text-gray-500">
                    No. of student's enrolled: {q.students}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Status: {q.status}
                  </p>
                </div>
                <button className="flex items-center text-green-600 font-medium hover:underline">
                  Open <FaArrowRight className="ml-1" />
                </button>
              </div>
            ))}
          </div>

          {hasMoreQuizzes && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <button 
                onClick={() => setShowAll(!showAll)}
                className=" cursor-pointer px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
              >
                {showAll ? "Show Less" : `Show More (${allQuizzes.length - 5} more)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};