import { useEffect } from "react"
import api from "../services/api";
import { useState } from "react";
import BudgetCard from "../components/BudgetCard";

export default function Budgets(){

    const [results, setResults] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [recurring, setRecurring] = useState(true);
    const [frequency, setFrequency] = useState('');
    const [today, setToday] = useState(true);
    const token = localStorage.getItem("token");


    useEffect(() => {
        async function fetchBudgets() {
            const res = await api.get('/budgets');
            setResults(res.data);
        }
        fetchBudgets();
    }, []);

    const handleForm = async (e) => {
        e.preventDefault();
        try{
            let endDate;
            if (today){
                setStart(new Date());
            }
            if (recurring && frequency){
                const s = new Date(start);
                endDate = new Date(s);

                switch (frequency) {
                    case "weekly":
                        endDate.setDate(s.getDate() + 7);
                        break;
                    case "biweekly":
                        endDate.setDate(s.getDate() + 14);
                        break;
                    case "monthly":
                        endDate.setMonth(s.getMonth() + 1);
                        break;
                    default:
                        break;
                }
            } else {
                setRecurring(false);
                setFrequency('');
                endDate = end ? new Date(end) : null;
            }
            const res = await api.post('/budgets',
                {name, limit, category, start, end: endDate, frequency, recurring}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResults([...results, res.data]);
            setName('');
            setLimit('');
            setCategory('');
            setStart('');
            setEnd('');
            setRecurring(true);
            setFrequency('');
            setToday(true);
        } catch (e){
            console.error(e);
        }
    }

    return (
        <div className="min-h-screen">
            <h1 className="text-5xl font-semibold pl-10 pb-5">Active budgets</h1>
            {results && results.length > 0 ? (
                <>
                    <div className=" px-10 py-5 grid grid-cols-2 gap-12">
                        {results.map(result => 
                            <div key={result.budget.id}>
                                <BudgetCard
                                    b={result}
                                />
                            </div>
                        )}
                    </div>
                    <button className="btn buttn mx-10 my-4" onClick={()=>document.getElementById('budget').showModal()}>Create a budget</button>
                    <dialog id="budget" className="modal">
                    <div className="bg-base-100 p-10 min-w-xl">
                        <h3 className="font-bold text-center text-lg pb-2">Create your custom budget</h3>
                        <div>
                        <form className="space-y-2 md:space-y-6" onSubmit={handleForm}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-base font-medium min-w-full">Name</label>
                                <input onChange={e => {setName(e.target.value)}} value={name} type="name" id="name" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="e.g Monthly food/drink budget" required="" />
                            </div>
                            <div>
                                <label htmlFor="category" className="block mb-2 text-base font-medium">Category</label>
                                <select onChange={e => {setCategory(e.target.value)}} className="select select-primary" id="category" value={category}>
                                    <option value="ENTERTAINMENT">Entertainment</option>
                                    <option value="FOOD_AND_DRINK">Food and Drink</option>
                                    <option value="GENERAL_MERCHANDISE">Clothing and Merchandise</option>
                                    <option value="TRANSPORTATION">Transport</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="limit" className="block mb-2 text-base font-medium">Spend Limit</label>
                                <input onChange={e => {setLimit(e.target.value)}} value={limit} type="number" id="limit" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div className="flex space-x-5"> 
                                <label htmlFor="today" className="block mb-2 text-base font-medium">Start today?</label>
                                <input onChange={e => {setToday(e.target.checked)}} value={today} type="checkbox" id="today" className="toggle toggle-primary" defaultChecked />
                            </div>
                            {today ? (
                                <></>
                            ) : (
                                <div>
                                    <label htmlFor="startDate" className="block mb-2 text-base font-medium"> Custom Start Date</label>
                                    <input onChange={e => {setStart(e.target.value)}} type="date" id="start" value={start}/>
                                </div>
                            )}
                            <div className="flex space-x-5">
                                <label htmlFor="recurring" className="block mb-2 text-base font-medium">Recurring?</label>
                                <input onChange={e => {setRecurring(e.target.checked)}} value={recurring} type="checkbox" id="recurring" className="toggle toggle-primary" defaultChecked />
                            </div>
                            {recurring ? (
                                <div>
                                    <label htmlFor="frequency" className="block mb-2 text-base font-medium">Frequency</label>
                                    <select onChange={e => {setFrequency(e.target.value)}} className="select select-primary" id="frequency" value={frequency}>
                                        <option value="weekly">Weekly</option>
                                        <option value="biweekly">Bi-Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="endDate" className="block mb-2 text-base font-medium"> Custom End Date</label>
                                    <input onChange={e => {setEnd(e.target.value)}} type="date" id="end" value={end}/>
                                </div>
                            )}

                            <button type="submit" onSubmit={handleForm} className="btn w-3/4 justify-center content-center mb-5 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-2.5 text-center">Create Event</button>
                        </form>
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                        </div>
                    </div>
                    </dialog>
                </>


            ) : (
                <>
                    <p> No budgets created </p>
                    <button className="btn" onClick={()=>document.getElementById('budget').showModal()}>Create a budget</button>
                    <dialog id="budget" className="modal">
                    <div className="bg-base-100 p-10 min-w-xl">
                        <h3 className="font-bold text-center text-lg pb-2">Create your custom budget</h3>
                        <div>
                        <form className="space-y-2 md:space-y-6" onSubmit={handleForm}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-base font-medium min-w-full">Name</label>
                                <input onChange={e => {setName(e.target.value)}} value={name} type="name" id="name" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="e.g Monthly food/drink budget" required="" />
                            </div>
                            <div>
                                <label htmlFor="category" className="block mb-2 text-base font-medium">Category</label>
                                <select onChange={e => {setCategory(e.target.value)}} className="select select-primary" id="category" value={category}>
                                    <option value="ENTERTAINMENT">Entertainment</option>
                                    <option value="FOOD_AND_DRINK">Food and Drink</option>
                                    <option value="GENERAL_MERCHANDISE">Clothing and Merchandise</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="limit" className="block mb-2 text-base font-medium">Spend Limit</label>
                                <input onChange={e => {setLimit(e.target.value)}} value={limit} type="number" id="limit" className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div className="flex space-x-5"> 
                                <label htmlFor="today" className="block mb-2 text-base font-medium">Start today?</label>
                                <input onChange={e => {setToday(e.target.checked)}} value={today} type="checkbox" id="today" className="toggle toggle-primary" defaultChecked />
                            </div>
                            {today ? (
                                <></>
                            ) : (
                                <div>
                                    <label htmlFor="startDate" className="block mb-2 text-base font-medium"> Custom Start Date</label>
                                    <input onChange={e => {setStart(e.target.value)}} type="date" id="start" value={start}/>
                                </div>
                            )}
                            <div className="flex space-x-5">
                                <label htmlFor="recurring" className="block mb-2 text-base font-medium">Recurring?</label>
                                <input onChange={e => {setRecurring(e.target.checked)}} value={recurring} type="checkbox" id="recurring" className="toggle toggle-primary" defaultChecked />
                            </div>
                            {recurring ? (
                                <div>
                                    <label htmlFor="frequency" className="block mb-2 text-base font-medium">Frequency</label>
                                    <select onChange={e => {setCategory(e.target.value)}} className="select select-primary" id="category" value={category}>
                                        <option disabled={true}>Category</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="biweekly">Bi-Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="endDate" className="block mb-2 text-base font-medium"> Custom End Date</label>
                                    <input onChange={e => {setEnd(e.target.value)}} type="date" id="end" value={end}/>
                                </div>
                            )}

                            <button type="submit" onSubmit={handleForm} className="btn w-3/4 justify-center content-center mb-5 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-2.5 text-center">Create Event</button>
                        </form>
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                        </div>
                    </div>
                    </dialog>
                </>

            )}
        </div>
    )
}