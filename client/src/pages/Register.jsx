import { useState } from "react"
import api from "../services/api";
import { useNavigate } from "react-router-dom";


export default function Register() {

    const navigate = useNavigate();
    const [fname, setFname] = useState("");
    const [sname, setSname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNum, setPhoneNum] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const credentials = {fname, sname, email, password, phoneNum};
            await api.post('/auth/register', credentials).then(() => {
                return api.post('auth/login', {
                    email: email,
                    password: password
                });
            }).then(res => {
                localStorage.setItem('token', res.data.token);
                navigate('/profile');
            })
        } catch (e) {
            console.log("Error occured", e);
        }
    } 



    return (
        <>
            <div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
                <h1 className="text-xl pb-5 font-bold leading-tight tracking-tight md:text-4xl">
                    Sign up with TrackSpend
                </h1>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#1a1a1a] dark:border-gray-700">
                    <div className="p-6 space-y-2 md:space-y-6 sm:p-8">
                        <form className="space-y-2 md:space-y-6" onSubmit={handleRegister}>
                            <div>
                                <label for="fname" className="block mb-2 text-base font-medium">First Name</label>
                                <input type="text" onChange={e => {setFname(e.target.value)}} value={fname} id="fname" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required="" />
                            </div>
                            <div>
                                <label for="sname" className="block mb-2 text-base font-medium">Surname</label>
                                <input type="text" onChange={e => {setSname(e.target.value)}} value={sname} id="sname" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required="" />
                            </div>
                            <div>
                                <label for="email" className="block mb-2 text-base font-medium">Email Address</label>
                                <input type="email" onChange={e => {setEmail(e.target.value)}} value={email} id="email" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                            </div>
                            <div>
                                <label for="number" className="block mb-2 text-base font-medium">Phone No.</label>
                                <input type="tel" onChange={e => {setPhoneNum(e.target.value)}} value={phoneNum} id="number" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="074123456789" required="" />
                            </div>
                            <div>
                                <label for="password" className="block mb-2 text-base font-medium">Password</label>
                                <input type="password" onChange={e => {setPassword(e.target.value)}} value={password} id="password" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" required="" />
                            </div>
                            <button type="submit" className="btn w-full focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-2.5 text-center">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
};