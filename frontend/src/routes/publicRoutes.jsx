import LandingPage from '../pages/LandingPage'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import TrainerDiscovery from '../pages/TrainerDiscovery'
import TrainerProfile from '../pages/TrainerProfile'

const publicRoutes = [
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/trainers',
        element: <TrainerDiscovery />
    },
    {
        path: '/trainer/:id',
        element: <TrainerProfile />
    },
]

export default publicRoutes