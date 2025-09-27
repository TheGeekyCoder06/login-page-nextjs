'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
    // These will be replaced with dynamic data later
    const name = "Your Name";
    const email = "your.email@example.com";
    const profilePicture = "/images/placeholder.jpg"; 

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            {/* The Profile Card Container */}
            <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 text-center">
                <div className="flex flex-col items-center">
                    {/* Profile Picture */}
                    <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-gray-600">
                        <Image
                            src={profilePicture}
                            alt={`${name}'s profile picture`}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-100">{name}</h1>
                    <p className="text-sm text-gray-400 mt-1">{email}</p>
                </div>

                {/* You can add more sections here */}
                <div className="mt-6 text-left space-y-4">
                    <div className="border-t border-gray-700 pt-4">
                        <h2 className="text-xl font-semibold text-gray-100 mb-2">My Information</h2>
                        <ul className="space-y-2 text-gray-400">
                            <li><span className="font-medium text-gray-300">Username:</span> YourUsername</li>
                            <li><span className="font-medium text-gray-300">Joined:</span> Date</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                    <Link href="/edit-profile" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Edit Profile
                    </Link>
                    <Link href="/logout" className="py-2 px-4 border border-gray-600 text-gray-400 font-semibold rounded-lg hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Log Out
                    </Link>
                </div>
            </div>
        </div>
    );
}