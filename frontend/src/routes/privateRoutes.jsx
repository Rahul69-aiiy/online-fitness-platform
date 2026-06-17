import StudentDashboard from "../pages/dashboard/StudentDashboard"
import TrainerDashboard from "../pages/dashboard/TrainerDashboard"
import Checkout from "../pages/Checkout"
import LiveSession from "../pages/LiveSession"
import Settings from "../pages/Settings"

const privateRoutes = [
    {
        path: '/dashboard',
        element: <StudentDashboard />
    },
    {
        path: '/trainer/dashboard',
        element: <TrainerDashboard />
    },
    {
        path: '/live/:id',
        element: <LiveSession />
    },
    {
        path: '/checkout',
        element: <Checkout />
    },
    {
        path: '/settings',
        element: <Settings />
    },
]

export default privateRoutes