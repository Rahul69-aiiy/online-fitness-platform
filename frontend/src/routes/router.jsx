import privateRoutes from "./privateRoutes";
import publicRoutes from "./publicRoutes";
import { Navigate, Route, Routes} from "react-router-dom";
// import NotFound from "../components/ui/NotFound";

const Router = () => {
  const temp = [...publicRoutes, ...privateRoutes, 
    { 
      // Fallback 
      path: "*",
      element: <Navigate to="/" replace />
      // path: "*",
      // element: <NotFound />
    }
  ]

  const pageRoutes = temp.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={route.element}
    />
  ))
  
  return <Routes>{pageRoutes}</Routes>;
};

export default Router