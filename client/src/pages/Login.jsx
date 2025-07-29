import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const credentials = {email, password};
            const response = await api.post('auth/login', credentials);
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err) {
            console.log('Login attempt failed');
            console.log(err);
        }
    }

    return (
            <div className="flex flex-col items-center justify-center px-6 mx-auto my-25 lg:py-0">
                <h1 className="text-xl pb-5 font-bold leading-tight tracking-tight md:text-4xl">
                    Login
                </h1>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#1a1a1a] dark:border-gray-700">
                    <div className="p-6 space-y-2 md:space-y-6 sm:p-8">
                        <form className="space-y-2 md:space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-base font-medium">Email Address</label>
                                <input onChange={e => {setEmail(e.target.value)}} value={email} type="email" id="email" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-base font-medium">Password</label>
                                <input onChange={e => {setPassword(e.target.value)}} value={password} type="password" id="password" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" required="" />
                            </div>
                            <button type="submit" className="btn w-full focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-2.5 text-center">Login</button>
                        </form>
                    </div>
                </div>
            </div>
    )


}