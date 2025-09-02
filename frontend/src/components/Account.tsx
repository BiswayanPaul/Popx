import { useState, useEffect, useRef, type ChangeEvent } from "react";
import axios from "axios";
import { Camera, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URI;

const ProfileCard: React.FC = () => {
    const [name, setName] = useState<string>("John Doe");
    const [email, setEmail] = useState<string>("johndoe@example.com");
    const [image, setImage] = useState<string>("/image.png");
    const [loading, setLoading] = useState<boolean>(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${backendUrl}/users/current-user`, {
                    withCredentials: true, // send cookies automatically
                });

                const user = response.data.data;
                setName(user.fullname);
                setEmail(user.email);
                if (user.profileImage) setImage(user.profileImage);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                // optionally upload to backend here
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                `${backendUrl}/users/logout`,
                {},
                { withCredentials: true }
            );
            navigate("/login"); // redirect to login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-sm w-full p-4 bg-white rounded-2xl shadow-md flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                            <img src={image} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button
                            type="button"
                            onClick={triggerFileInput}
                            className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1 hover:bg-purple-700 shadow-md"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="text-lg font-semibold text-gray-900">{name}</div>
                        <div className="text-sm text-gray-500">{email}</div>
                    </div>
                </div>

                <div>
                    <p className="text-gray-700 text-sm">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure magnam reprehenderit
                        possimus est illum a dolorum facilis voluptates cumque repellat?
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition-colors"
                >
                    <LogOut className="w-4 h-4" /> <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
