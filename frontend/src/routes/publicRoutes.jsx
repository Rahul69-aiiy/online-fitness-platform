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
        element: <Login />,
        publicOnly: true,
    },
    {
        path: '/register',
        element: <Register />,
        publicOnly: true,
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