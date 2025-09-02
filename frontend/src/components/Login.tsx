import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "@/lib/utils";

const Login = () => {
    const [email, setEmail] = useState("johndoe@example.com");
    const [password, setPassword] = useState("johndoe");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${backendUrl}/users/login`,
                { email, password },
                {
                    withCredentials: true, // important for cookies to work
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Login success:", response.data);

            // Optionally, you can store tokens in localStorage/sessionStorage if needed
            // localStorage.setItem("accessToken", response.data.data.accessToken);

            // Navigate to account page
            navigate("/account");
        } catch (err: any) {
            console.error("Login error:", err.response || err);
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Sign in to your PopX account
                </h1>
                <p className="text-gray-600 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>

                {error && (
                    <div className="mb-4 text-red-600 font-medium text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="email"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
              peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Email Address
                        </label>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="password"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
              peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Password
                        </label>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"} text-white font-medium py-2 rounded-md transition-colors`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
