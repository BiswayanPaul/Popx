import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URI; // your .env variable

const Register = () => {
    const [fullName, setFullName] = useState("John Doe");
    const [phone, setPhone] = useState("0000000000");
    const [email, setEmail] = useState("johndoe@example.com");
    const [password, setPassword] = useState("johndoe");
    const [company, setCompany] = useState("John");
    const [isAgency, setIsAgency] = useState<null | boolean>(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${backendUrl}/users/register`,
                {
                    fullname: fullName,
                    phonenumber: phone,
                    email,
                    password,
                    companyname: company,
                    agency: isAgency,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log("Register success:", response.data);
            navigate("/login"); // redirect after success
        } catch (err: any) {
            console.error("Register error:", err);
            if (err.response?.data?.message) setError(err.response.data.message);
            else setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Create your PopX account
                </h1>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {/* Full Name */}
                    <div className="relative">
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="fullName"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
              peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Full Name
                        </label>
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="phone"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
              peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Phone Number
                        </label>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
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
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
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

                    {/* Company */}
                    <div className="relative">
                        <input
                            type="text"
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="company"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
              peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Company Name
                        </label>
                    </div>

                    {/* Agency */}
                    <div>
                        <span className="block text-sm text-gray-700 mb-2">Are you an Agency?</span>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="isAgency"
                                    value="yes"
                                    checked={isAgency === true}
                                    onChange={() => setIsAgency(true)}
                                    required
                                    className="mr-2"
                                />
                                Yes
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="isAgency"
                                    value="no"
                                    checked={isAgency === false}
                                    onChange={() => setIsAgency(false)}
                                    required
                                    className="mr-2"
                                />
                                No
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-md transition-colors"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
