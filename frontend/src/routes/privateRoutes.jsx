import StudentDashboard from "../pages/dashboard/StudentDashboard"
import TrainerDashboard from "../pages/dashboard/TrainerDashboard"
import Checkout from "../pages/Checkout"
import Settings from "../pages/Settings"
import Messages from "../pages/Messages"
import PaymentHistory from "../pages/PaymentHistory"
import PaymentSuccess from "../pages/PaymentSuccess"
import ManagePlans from "../pages/trainer/ManagePlans"

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
        path: '/checkout',
        element: <Checkout />
    },
    {
        path: '/payment-history',
        element: <PaymentHistory />
    },
    {
        path: '/payment/success',
        element: <PaymentSuccess />
    },
    {
        path: '/trainer/manage-plans',
        element: <ManagePlans />
    },
    {
        path: '/settings',
        element: <Settings />
    },
    {
        path: '/messages',
        element: <Messages role="student" />
    },
    {
        path: '/trainer/messages',
        element: <Messages role="trainer" />
    },
]

export default privateRoutes