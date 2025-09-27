'use client'

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function UserProfilePage({ params }: any) {
    const [data , setData] = React.useState('Loading...');
    const router = useRouter();

    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logout successful");
            router.push("/login");
        } catch (error: any) {
            toast.error("Logout failed. Please try again.");
            console.error("Logout error:", error);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get("/api/users/me");
            setData(res.data.data.username); // Use username
        } catch (error: any) {
            console.error("Failed to fetch user details:", error);
            setData("Unknown user");
        }
    }

    React.useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 text-center">
                <h1 className="text-3xl font-bold text-gray-100 mb-4">User Profile</h1>
                <hr className="border-gray-700 mb-6" />

                <div className="space-y-4">
                    <p className="text-xl text-gray-400">
                        This is the profile page for user:
                    </p>
                    <p className="text-5xl font-bold text-blue-500">
                        {data}
                    </p>
                </div>

                <div className="mt-8">
                    <button
                        className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
