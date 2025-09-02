import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [fullName, setFullName] = useState("John Doe");
    const [phone, setPhone] = useState("0000000000");
    const [email, setEmail] = useState("johndoe@example.com");
    const [password, setPassword] = useState("johndoe");
    const [company, setCompany] = useState("John");
    const [isAgency, setIsAgency] = useState<null | boolean>(false);
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({
            fullName,
            phone,
            email,
            password,
            company,
            isAgency,
        });
        navigate("/account")
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Create your PopX account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm 
                            text-gray-900 bg-transparent rounded-lg border border-gray-300 
                            appearance-none focus:outline-none focus:ring-0 
                            focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="fullName"
                            className="absolute text-sm text-gray-500 duration-300 transform 
                            -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white 
                            px-2 peer-placeholder-shown:scale-100 
                            peer-placeholder-shown:-translate-y-1/2 
                            peer-placeholder-shown:top-1/2 
                            peer-focus:top-2 peer-focus:scale-75 
                            peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Full Name
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm 
                            text-gray-900 bg-transparent rounded-lg border border-gray-300 
                            appearance-none focus:outline-none focus:ring-0 
                            focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="phone"
                            className="absolute text-sm text-gray-500 duration-300 transform 
                            -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white 
                            px-2 peer-placeholder-shown:scale-100 
                            peer-placeholder-shown:-translate-y-1/2 
                            peer-placeholder-shown:top-1/2 
                            peer-focus:top-2 peer-focus:scale-75 
                            peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Phone Number
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm 
                            text-gray-900 bg-transparent rounded-lg border border-gray-300 
                            appearance-none focus:outline-none focus:ring-0 
                            focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="email"
                            className="absolute text-sm text-gray-500 duration-300 transform 
                            -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white 
                            px-2 peer-placeholder-shown:scale-100 
                            peer-placeholder-shown:-translate-y-1/2 
                            peer-placeholder-shown:top-1/2 
                            peer-focus:top-2 peer-focus:scale-75 
                            peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Email Address
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm 
                            text-gray-900 bg-transparent rounded-lg border border-gray-300 
                            appearance-none focus:outline-none focus:ring-0 
                            focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="password"
                            className="absolute text-sm text-gray-500 duration-300 transform 
                            -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white 
                            px-2 peer-placeholder-shown:scale-100 
                            peer-placeholder-shown:-translate-y-1/2 
                            peer-placeholder-shown:top-1/2 
                            peer-focus:top-2 peer-focus:scale-75 
                            peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Password
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm 
                            text-gray-900 bg-transparent rounded-lg border border-gray-300 
                            appearance-none focus:outline-none focus:ring-0 
                            focus:border-purple-600 peer"
                            placeholder=" "
                        />
                        <label
                            htmlFor="company"
                            className="absolute text-sm text-gray-500 duration-300 transform 
                            -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white 
                            px-2 peer-placeholder-shown:scale-100 
                            peer-placeholder-shown:-translate-y-1/2 
                            peer-placeholder-shown:top-1/2 
                            peer-focus:top-2 peer-focus:scale-75 
                            peer-focus:-translate-y-4 peer-focus:text-purple-600"
                        >
                            Company Name
                        </label>
                    </div>

                    <div>
                        <span className="block text-sm text-gray-700 mb-2">
                            Are you an Agency?
                        </span>
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

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 
                        text-white font-medium py-2 rounded-md transition-colors"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
