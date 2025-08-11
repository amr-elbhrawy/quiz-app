"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic imports with loading placeholders
const GroupsList = dynamic(() => import("../group/GroupsList"), {
  loading: () => <p>Loading Groups...</p>,
});
const StudentsList = dynamic(() => import("../students/page"), {
  loading: () => <p>Loading Students...</p>,
});
const QuestionsList = dynamic(() => import("../Questions/page"), {
  loading: () => <p>Loading Questions...</p>,
});
const QuizzesList = dynamic(() => import("../Quizzes/page"), {
  loading: () => <p>Loading Quizzes...</p>,
});

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("groups");

  const tabs = [
    { id: "groups", label: "Groups", component: <GroupsList /> },
    { id: "students", label: "Students", component: <StudentsList /> },
    { id: "questions", label: "Questions", component: <QuestionsList /> },
    { id: "quizzes", label: "Quizzes", component: <QuizzesList setActive={setActiveTab} /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-100 p-4 border-r">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer p-2 rounded ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {tabs.find((t) => t.id === activeTab)?.component}
      </main>
    </div>
  );
}
