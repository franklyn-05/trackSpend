import { useNavigate } from "react-router-dom"

export default function NoPage() {

    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-center font-semibold text-6xl items-center py-8">
                <span className="text-(--secondary_color)">4</span>0<span className="text-(--secondary_color)">4</span> - Page Not Found
            </h1>
            <p className="text-center text-2xl pb-5">
                The page youre looking for couldn't be found or doesn't exist.
            </p>
            <button onClick={() => navigate('/')} className="btn border flex items-center justify-center border-(--text_color) bg-(--primary_color) hover:bg-(--secondary_color) hover:border-(--primary_color) hover:text-(--primary_color) p-6">Back to Home</button>

        </div>

    )
}