import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import privateRoutes from "./privateRoutes";
import publicRoutes from "./publicRoutes";

const routes = [
  ...publicRoutes.map((r) => ({ ...r, isPrivate: false })),
  ...privateRoutes.map((r) => ({ ...r, isPrivate: true })),
  {
    path: "*",
    element: <Navigate to="/" replace />,
    isPrivate: false,
  },
];

const Router = () => {
  return (
    <Routes>
      {routes.map(({ path, element, isPrivate }) => (
        <Route
          key={path}
          path={path}
          element={
            isPrivate ? (
              <ProtectedRoute>{element}</ProtectedRoute>
            ) : (
              element
            )
          }
        />
      ))}
    </Routes>
  );
};

export default Router;