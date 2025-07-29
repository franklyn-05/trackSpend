import api from "../services/api"
import { useEffect, useState } from "react"
import { usePlaidLink } from "react-plaid-link";

export default function Profile() {

    const [profile, setProfile] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [connected, setConnected] = useState(false);
    const [bank, setBank] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [linkToken, setLinkToken] = useState();
    const token = localStorage.getItem("token");


    useEffect(() => {
        async function getProfile() {
            try {
                const res = await api.get("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfile(res.data);
            } catch (e) {
            console.log("Error occurred:", e)
            } finally {
                setFetching(false);
            }
        }
        getProfile();
    }, []);


    useEffect(() => {
        async function fetch() {
            const response = await api.post(
            "/plaid/create-link-token",
            {},
            { headers: { Authorization: `Bearer ${token}` }}
            );
            
            setLinkToken(response.data.link_token);
            
        }
        fetch();
    }, []);

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: async (public_token, metadata) => {
            try {
                const res = await api.post('/plaid/exchange-token', {
                    public_token
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(res.data);
                setConnected(true);
                setBank(metadata.institution.name);
                setAccounts(metadata.accounts)
                console.log('Success', public_token, metadata);
            } catch (e) {
                console.log("Failed to exchange tokens: ", e)
            }
        },
    });

    const disconnectBank = async () => {
        try{
            const res = await api.get('/plaid/disconnect');
            setConnected(false);
            setBank(null);
            setAccounts(null);
        } catch (e) {
            console.log("Error Occurred", e);
        }
    }

    if (fetching){
        return <p className="text-center">Fetching<span className="loading loading-dots loading-xl"></span></p>;
    } else if (!profile) {
        return <p className="text-center">Failed to Load Profile</p>
    } else {
        return (
            <div className="text-center">
                <p className="text-xl py-4">{profile.fname} {profile.sname}</p>
                <p className="text-xl pb-4">Member Since {new Date(profile.createdAt).toLocaleDateString()}</p>
                {connected ? (
                    <>
                        <p>Bank account connected - {bank}!</p>
                        {accounts && accounts.map(acc => (
                            <p key={acc.id}>
                                {acc.name} | ****{acc.mask}
                            </p>
                        ))}
                        <button onClick={disconnectBank} className="btn border border-(--text_color) bg-(--primary_color) hover:bg-(--secondary_color) hover:border-(--primary_color) hover:text-(--primary_color) p-6 m-3">
                            Disconnect bank account
                        </button>
                    </>
                ) : (
                    <button onClick={() => open()} disabled={!ready} className="btn border border-(--text_color) bg-(--primary_color) hover:bg-(--secondary_color) hover:border-(--primary_color) hover:text-(--primary_color) p-6">
                        Connect a bank account
                    </button>
                )}             

            </div>
            
        )
    }

};