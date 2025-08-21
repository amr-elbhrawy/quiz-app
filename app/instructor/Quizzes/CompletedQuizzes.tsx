 "use client";
import { useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCheck,
  FaUsers,
  FaTrophy,
  FaSync,
  FaCalendarAlt,
  FaUserFriends,
} from "react-icons/fa";
import { fetchCompletedQuizzes } from "@/store/features/quiz/quizSlice";
import { GroupService } from "@/services/group.service";
import type { RootState, AppDispatch } from "@/store/store";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

interface CompletedQuiz {
  title: string;
  group: string;
  groupName: string;
  persons: number;
  date: string;
  score?: number;
}

// Table Row
const TableRow = memo(
  ({ quiz, index }: { quiz: CompletedQuiz; index: number }) => (
    <tr
      key={index}
      className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200"
    >
      <td className="p-4 font-medium text-gray-900 truncate max-w-xs">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <FaCheck className="text-blue-600 text-sm" />
          </div>
          <span className="truncate">{quiz.title}</span>
        </div>
      </td>
      <td className="p-4 text-gray-600 truncate max-w-xs">
        <div className="flex items-center">
          <FaUserFriends className="text-gray-400 mr-2 text-sm" />
          <span className="truncate">{quiz.groupName}</span>
        </div>
      </td>
      <td className="p-4 text-gray-600">
        <div className="flex items-center">
          <FaUsers className="text-gray-400 mr-2 text-sm" />
          <span>{quiz.persons}</span>
        </div>
      </td>
      <td className="p-4 text-gray-600">
        <div className="flex items-center">
          <FaCalendarAlt className="text-gray-400 mr-2 text-sm" />
          <span>{quiz.date}</span>
        </div>
      </td>
      {quiz.score !== undefined && (
        <td className="p-4">
          <div className="flex items-center gap-2 font-medium">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                quiz.score >= 80
                  ? "bg-green-100 text-green-800"
                  : quiz.score >= 60
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span>{quiz.score}%</span>
            </div>
            <FaTrophy
              className={
                quiz.score >= 80
                  ? "text-yellow-500"
                  : quiz.score >= 60
                  ? "text-gray-400"
                  : "text-gray-300"
              }
            />
          </div>
        </td>
      )}
    </tr>
  )
);

TableRow.displayName = "TableRow";

export const CompletedQuizzes = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { completed: quizzes, loading } = useSelector(
    (state: RootState) => state.quiz
  );
  const { role, user } = useSelector((state: RootState) => state.auth);

  const [showAll, setShowAll] = useState(false);
  const [groups, setGroups] = useState<{ _id: string; name: string }[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setGroupsLoading(true);

        if (role === "instructor") {
          // المدرس يجيب كل الجروبات
          const res = await GroupService.getAll();
          setGroups(res.data.map((g: any) => ({ _id: g._id, name: g.name })));
        } else if (role === "student" && user?.group) {
          // الطالب جروبه بس
          setGroups([{ _id: user.group._id, name: user.group.name }]);
        } else {
          setGroups([]);
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setGroupsLoading(false);
      }
    };

    fetchGroups();
  }, [role, user]);

  // Process data
  const processCompletedData = useCallback(
    (
      data: any[],
      groupsData: { _id: string; name: string }[]
    ): CompletedQuiz[] => {
      if (!Array.isArray(data)) return [];

      return data.map((item: any, i: number) => {
        const groupId =
          typeof item.group === "string" ? item.group : item.group?._id;
        const groupObj = groupsData.find((g) => g._id === groupId);
        const groupName = groupObj?.name || item.group?.name || "No Group";

        return {
          title: item.title || `Quiz ${i + 1}`,
          group: groupId || "No Group ID",
          groupName,
          persons: Array.isArray(item.participants)
            ? item.participants.length
            : item.participants || 0,
          date: item.closed_at
            ? new Date(item.closed_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : new Date(item.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
          score: item.score,
        };
      });
    },
    []
  );

  const processedQuizzes = processCompletedData(quizzes || [], groups);
  const displayedQuizzes = showAll
    ? processedQuizzes
    : processedQuizzes.slice(0, 5);
  const hasMoreQuizzes = processedQuizzes.length > 5;

  useEffect(() => {
    dispatch(fetchCompletedQuizzes());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchCompletedQuizzes());
  }, [dispatch]);

  const toggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  if (loading || groupsLoading) {
    return <LoadingSkeletonCard variant="table" count={5} />;
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <h2 className="text-xl font-bold text-gray-800">Completed Quizzes</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            {displayedQuizzes.length} of {processedQuizzes.length}
          </span>
          <button
            onClick={handleRefresh}
            className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
            title="Refresh completed quizzes"
          >
            <FaSync />
          </button>
        </div>
      </div>

      {processedQuizzes.length === 0 ? (
        <div className="text-center py-10">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaCheck className="text-2xl text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No completed quizzes yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Completed quizzes will appear here
          </p>
        </div>
      ) : (
        <>
          {/* Table view */}
          <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-4 text-left font-semibold">Quiz Title</th>
                  <th className="p-4 text-left font-semibold">Group Name</th>
                  <th className="p-4 text-left font-semibold">Participants</th>
                  <th className="p-4 text-left font-semibold">
                    Completion Date
                  </th>
                  {processedQuizzes.some((quiz) => quiz.score !== undefined) && (
                    <th className="p-4 text-left font-semibold">Score</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayedQuizzes.map((quiz, index) => (
                  <TableRow key={index} quiz={quiz} index={index} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {displayedQuizzes.map((quiz, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
              >
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaCheck className="text-blue-600" /> {quiz.title}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <FaUserFriends className="text-gray-400" /> {quiz.groupName}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <FaUsers className="text-gray-400" /> {quiz.persons} Participants
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <FaCalendarAlt className="text-gray-400" /> {quiz.date}
                </p>
                {quiz.score !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        quiz.score >= 80
                          ? "bg-green-100 text-green-800"
                          : quiz.score >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {quiz.score}%
                    </span>
                    <FaTrophy
                      className={
                        quiz.score >= 80
                          ? "text-yellow-500"
                          : quiz.score >= 60
                          ? "text-gray-400"
                          : "text-gray-300"
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {hasMoreQuizzes && (
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <button
                onClick={toggleShowAll}
                className="px-5 py-2.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors font-medium inline-flex items-center"
              >
                {showAll
                  ? "Show Less"
                  : `View All Completed Quizzes (${
                      processedQuizzes.length - 5
                    } more)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

CompletedQuizzes.displayName = "CompletedQuizzes";
