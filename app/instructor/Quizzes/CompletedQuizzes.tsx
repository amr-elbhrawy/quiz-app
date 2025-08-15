"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { QuizService } from "@/services/quiz.service";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

interface CompletedQuiz {
  title: string;
  group: string;
  persons: number;
  date: string;
}

export const CompletedQuizzes = () => {
  const [completed, setCompleted] = useState<CompletedQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await QuizService.getCompleted();
        const processedData = res.data.map((item: any, i: number) => ({
          title: item.title || `Quiz ${i + 1}`,
          group: typeof item.group === "string" ? item.group : item.group?.name || "No Group",
          persons: Array.isArray(item.participants) ? item.participants.length : item.participants || 0,
          date: item.closed_at
            ? new Date(item.closed_at).toLocaleDateString("en-US")
            : new Date(item.createdAt).toLocaleDateString("en-US")
        }));
        setCompleted(processedData);
      } catch (error) {
        toast.error("Failed to load completed quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, []);

  if (loading) return <LoadingSkeletonCard width="100%" height="40px" count={5} />;

  if (completed.length === 0) {
    return <p className="text-gray-500">No completed quizzes found</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Completed Quizzes</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Group name</th>
            <th className="p-2 text-left">Persons</th>
            <th className="p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {completed.map((c, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-2">{c.title}</td>
              <td className="p-2">{c.group}</td>
              <td className="p-2">{c.persons}</td>
              <td className="p-2">{c.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
