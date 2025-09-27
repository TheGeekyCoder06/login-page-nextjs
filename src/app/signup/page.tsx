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
        password: ""
    });
    const router = useRouter();
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);
    const [loading , setLoading] = useState(false);

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
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <h1 className="text-2xl font-bold text-center text-gray-100 mb-6">{loading ? "Creating Account..." : "Create Account"}</h1>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        onClick={onSignup}
                        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        {buttonDisabled ? "Fill all fields" : "Sign Up"}
                    </button>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-green-500 hover:text-green-400 transition duration-300">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}