import { useEffect } from "react";

// Temporary component to wake up a sleeping service
export default function Wakeup() {
    const API_URL = process.env.REACT_APP_QUERY_SVC_URL;

    useEffect(async () => {
        const res = await fetch(API_URL + "/fake_api", {
            method: "GET"
        });
    }, []);

    return null;
}