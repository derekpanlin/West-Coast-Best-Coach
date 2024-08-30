import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import LandingPage from '../components/LandingPage/LandingPage';
import FindACoachPage from '../components/FindACoachPage';
import ManageLessonsPage from '../components/ManageLessonsPage/ManageLessonsPage';
import ManageReviewsPage from '../components/ManageReviewsPage/ManageReviewsPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/find-a-coach",
        element: <FindACoachPage />
      },
      {
        path: "/manage-lessons",
        element: <ManageLessonsPage />
      },
      {
        path: "/manage-reviews",
        element: <ManageReviewsPage />
      }
    ],
  },
]);
