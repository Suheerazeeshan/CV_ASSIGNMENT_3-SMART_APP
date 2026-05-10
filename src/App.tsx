import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { FacultyGate, RequireAuth } from './components/RequireAuth'
import { Bookmarks } from './pages/Bookmarks'
import { Chat } from './pages/Chat'
import { Guide } from './pages/Guide'
import { Notes } from './pages/Notes'
import { Login } from './pages/Login'
import { FacultyHome } from './pages/faculty/FacultyHome'
import { FacultyQuizList } from './pages/faculty/FacultyQuizList'
import { QuizSolutions } from './pages/faculty/QuizSolutions'
import { Reports } from './pages/faculty/Reports'
import { UploadPdf } from './pages/faculty/UploadPdf'
import { ArLab } from './pages/student/ArLab'
import { CvLab } from './pages/student/CvLab'
import { ImageLab } from './pages/student/ImageLab'
import { Models3D } from './pages/student/Models3D'
import { Prompts } from './pages/student/Prompts'
import { QuizTake } from './pages/student/QuizTake'
import { Reading } from './pages/student/Reading'
import { SampleLectureDetail } from './pages/student/SampleLectureDetail'
import { SampleLectures } from './pages/student/SampleLectures'
import { Results } from './pages/student/Results'
import { SampleQuiz } from './pages/student/SampleQuiz'
import { StudentHome } from './pages/student/StudentHome'
import { StudentQuizList } from './pages/student/StudentQuizList'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="guide" replace />} />
          <Route path="guide" element={<Guide />} />
          <Route path="chat" element={<Chat />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="notes" element={<Notes />} />

          <Route element={<FacultyGate />}>
            <Route path="faculty" element={<FacultyHome />} />
            <Route path="faculty/upload" element={<UploadPdf />} />
            <Route path="faculty/quizzes" element={<FacultyQuizList />} />
            <Route path="faculty/quizzes/:id" element={<QuizSolutions />} />
            <Route path="faculty/reports" element={<Reports />} />
          </Route>

          <Route path="student" element={<StudentHome />} />
          <Route path="student/read" element={<Reading />} />
          <Route path="student/lectures" element={<SampleLectures />} />
          <Route path="student/lectures/:lectureId" element={<SampleLectureDetail />} />
          <Route path="student/prompts" element={<Prompts />} />
          <Route path="student/sample-quiz" element={<SampleQuiz />} />
          <Route path="student/ar" element={<ArLab />} />
          <Route path="student/image-lab" element={<ImageLab />} />
          <Route path="student/models" element={<Models3D />} />
          <Route path="student/cv-lab" element={<CvLab />} />
          <Route path="student/quizzes" element={<StudentQuizList />} />
          <Route path="student/quiz/:id" element={<QuizTake />} />
          <Route path="student/results" element={<Results />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
