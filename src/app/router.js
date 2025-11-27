import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/maninLayout/MainLayout";

import RegisterPage from "../pages/Auth/register/RegisterPage";
import SubjectBasePage from "../pages/Subjects/SubjectBasePage";
import SubjectDetailPage from "../pages/Subjects/subjectBaseDetail/SubjectDetailPage"; 
import TeacherPanelPage from "../pages/Subjects/TeacherPanelPage";

import LessonPanelPage from "../pages/Lessons/LessonPanelPage";
import MyLessonsPage from "../pages/Lessons/MyLessonsPage";

import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import UserPanelPage from "../pages/Users/UserPanelPage";
import MyAccountPage from "../pages/Settings/MyAccountPage";
import AddressesPage from "../pages/Settings/AddressesPage";
import SubscriptionPage from "../pages/Settings/SubscriptionPage";
import LoginPage from "../pages/Auth/login/LoginPage";
import UnauthorizedPage from "../pages/Common/UnauthorizedPage";

import LandingPage from "../pages/LandingPage/LandingPage";
import StudentPanelPage from "../pages/Students/StudentPanelPage";
import ExamBasePage from "../pages/examBase/ExamBasePage";
import ExamPanelPage from "../pages/exam/ExamPanelPage";
import ExamBaseQuestionsPage from "../pages/examBase/ExamBaseQuestionsPage";
import ExamDetailPage from "../pages/exams/ExamDetailPage";
import MyExamsPage from "../pages/exams/MyExamsPage";
import ExamSessionPage from "../pages/exams/ExamSessionPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/subjects/base"
        element={
          <MainLayout>
            <SubjectBasePage />
          </MainLayout>
        }
      />

      <Route
        path="/subjects/:id"
        element={
          <MainLayout>
            <SubjectDetailPage />
          </MainLayout>
        }
      />

      <Route
        path="/subjects/teachers"
        element={
          <MainLayout>
            <TeacherPanelPage />
          </MainLayout>
        }
      />

      <Route
        path="/students"
        element={
          <MainLayout>
            <StudentPanelPage />
          </MainLayout>
        }
      />

      <Route
        path="/lessons"
        element={
          <MainLayout>
            <LessonPanelPage />
          </MainLayout>
        }
      />

      <Route
        path="/my-lessons"
        element={
          <MainLayout>
            <MyLessonsPage />
          </MainLayout>
        }
      />

      <Route
        path="/exams/base"
        element={
          <MainLayout>
            <ExamBasePage />
          </MainLayout>
        }
      />

      <Route
        path="/exams/panel"
        element={
          <MainLayout>
            <ExamPanelPage />
          </MainLayout>
        }
      />

      <Route
        path="/analytics"
        element={
          <MainLayout>
            <AnalyticsPage />
          </MainLayout>
        }
      />

      <Route
        path="/users"
        element={
          <MainLayout>
            <UserPanelPage />
          </MainLayout>
        }
      />

      <Route
        path="/settings/account"
        element={
          <MainLayout>
            <MyAccountPage />
          </MainLayout>
        }
      />

      <Route
        path="/settings/addresses"
        element={
          <MainLayout>
            <AddressesPage />
          </MainLayout>
        }
      />

      <Route
        path="/settings/subscription"
        element={
          <MainLayout>
            <SubscriptionPage />
          </MainLayout>
        }
      />

      <Route
        path="/exam-bases/:id/questions"
        element={<ExamBaseQuestionsPage />}
      />

      <Route path="/exams/:id" element={<ExamDetailPage />} />

      <Route path="/exams/my" element={<MyExamsPage />} />

      <Route path="/exam-session/:examId" element={<ExamSessionPage />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default Router;
