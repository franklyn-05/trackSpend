import { useNavigate } from "react-router-dom"

export default function Home() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const getStarted = () => {
        if (token) {
            navigate('/profile');    
        } else {
            navigate('/login')
        }
    }

    return (
        <div className="hero">
            <div className="hero-content text-center">
                <div className="max-w-lg">
                <h1 className="text-5xl font-bold">Master your <span className="text-(--secondary_color)">Spending</span></h1>
                <p className="text-xl py-6">
                    TrackSpend is a smart, convenient finance tool, allowing you to link to your bank account, view your spending habits and set budgeting goals. Start now and take control of your finances
                </p>
                <button onClick={getStarted} className="btn border border-(--text_color) bg-(--primary_color) hover:bg-(--secondary_color) hover:border-(--primary_color) hover:text-(--primary_color) p-6">Get Started with TrackSpend</button>
                </div>
            </div>
        </div>
    )
};