import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()
    const handleRedirectRegister = () => {
        navigate("/register")
    }
    const handleRedirectLogin = () => {
        navigate("/login")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2">Welcome to PopX</h1>
                <p className="text-gray-600 mb-6">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>

                <div className="flex flex-col gap-4">
                    <button className="bg-purple-600 text-white py-2 rounded-lg shadow-md hover:bg-purple-500 transition w-full hover:cursor-pointer"
                        onClick={handleRedirectRegister}
                    >
                        Create Account
                    </button>
                    <button className="bg-gray-200 text-black py-2 rounded-lg shadow-md hover:bg-gray-300 transition w-full hover:cursor-pointer"
                        onClick={handleRedirectLogin}
                    >
                        Already Registered? Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home
