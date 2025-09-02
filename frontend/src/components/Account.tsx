import { useState, useEffect, useRef, type ChangeEvent } from "react";
import Cookies from "js-cookie";
import { Camera } from "lucide-react";

const ProfileCard: React.FC = () => {
    const [name, setName] = useState<string>("John Doe");
    const [email, setEmail] = useState<string>("johndoe@example.com");
    const [image, setImage] = useState<string>("/image.png");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userName = Cookies.get("name");
        const userEmail = Cookies.get("email");
        const userImage = Cookies.get("profileImage");

        if (userName) setName(userName);
        if (userEmail) setEmail(userEmail);
        if (userImage) setImage(userImage);
    }, []);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                Cookies.set("profileImage", reader.result as string, { expires: 7 });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

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
            </div>
        </div>
    );
};

export default ProfileCard;
