'use client'

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import toast from "react-hot-toast";

export default function SignupPage() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "student" // Default role added
    });
    const router = useRouter();
    const [buttonDisabled, setButtonDisabled] = useState(true); // Changed initial state to true
    const [loading , setLoading] = useState(false);

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0 && user.role.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    const onSignup = async () => {
        // Your signup logic here
        try{
            setLoading(true);
            const response = await axios.post('/api/users/signup', user);
            console.log(response.data);
            toast.success("Account created successfully");
            router.push('/login');
        }catch(err:any){
            toast.error("Something went wrong");
            console.log(err.message);
        }finally{
            setLoading(false);
        }
        console.log("Signing up user:", user);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-sm p-8 bg-gray-50 rounded-xl shadow-xl border border-gray-200">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{loading ? "Creating Account..." : "Create Account"}</h1>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            id="role"
                            value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                            className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    <button
                        onClick={onSignup}
                        disabled={buttonDisabled || loading}
                        className={`w-full py-2 px-4 font-semibold rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            buttonDisabled || loading
                                ? 'bg-blue-300 text-white cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-50'
                        }`}
                    >
                        {loading ? "Processing..." : buttonDisabled ? "Fill all fields" : "Sign Up"}
                    </button>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition duration-300">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}