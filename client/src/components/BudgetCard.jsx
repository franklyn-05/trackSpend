export default function BudgetCard({ b }){

    const budget = b.budget;
    const spent = b.spent || 0;
    const progress = Math.min((spent/budget.limit)*100, 100);
    function daysBetween(startDate, endDate){
        const oneDay = 1000 * 60 * 60 * 24;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const s = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
        const e = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
        return (s - e) / oneDay;
    };
    function remaining(spent, limit){
        if ((limit - spent) > 0){
            return limit - spent
        } else{
            return 0
        }
    }

    return (
        <div key={budget._id} className=" shadow-md shadow-(color:--secondary_color) bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-2xl p-6">
            <div className="flex justify-between pb-5">
                <div>
                    <h3 className="text-4xl font-bold">{budget.name}</h3>
                    <p className="py-2 text-(--secondary_color)">{budget.category ? (budget.category.split("_").join(" ")) : ("NO CATEGORY SELECTED")}</p>
                    <p className="pt-6">£{budget.limit} budget | £{spent} spent | £{remaining(spent, budget.limit)} remaining </p>
                </div>
                <div className="radial-progress shadow-md shadow-(color:--secondary_color) text-(--secondary_color) text-2xl" style={{ "--value": progress, "--size": "10rem" }} role="progressbar">
                    {Math.round(progress)}%
                </div>
            </div>
            <progress className="progress my-2 [&::-webkit-progress-value]:bg-(--secondary_color) w-full" value={progress} max="100"></progress>
            <div className="flex">
                <p className="text-xl text-right">{daysBetween(budget.startDate, budget.endDate)} days left</p>
            </div>
        </div>
    )


            {/* <p className="text-md">
                {new Date(budget.startDate).toLocaleDateString()} - 
                {new Date(budget.endDate).toLocaleDateString()}
            </p> */}
}