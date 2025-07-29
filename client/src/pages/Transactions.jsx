import { useEffect } from "react";
import api from "../services/api";
import { useState } from "react";

export default function Transactions(){

    const [results, setResults] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function sync() {
            try{
                await api.get('/plaid/transactions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const response = await api.get('/transactions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(response.data);
            } catch(e){
                console.error(e);
            }
        };
        sync();
    })
    return (
        <>
            <h1>Transactions</h1>
            {results && results.map(t => (
                <p key={t.id}>
                    {t.name}, {t.merchant}, {t.amount}
                </p>
            ))}
        </>

    )
}