import Cookies from 'js-cookie';
import React, { useState } from 'react'
import axiosInstance from '../../../api';



const API_URL = import.meta.env.VITE_API_URL;
export default function useUpdate() {
    const [loading,setLoading]=useState(false);


    const updateOrmaDetails = async (name: any, eventDate: any, banner: string, profileImage: string, event_hash: any) => {
        let token = Cookies.get("token");
        setLoading(true)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("event_date", eventDate);
        if (banner) formData.append("banner", banner);
        if (profileImage) formData.append("profile_image", profileImage);
        if (formData) {
            try {
                const response = await axiosInstance.put(
                    `${API_URL}/events/${event_hash}/update`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: token,
                        },
                    }
                );
                if (response.status === 200) {
                    window.location.reload()
                    setLoading(false)
                } else {
                    console.error("Failed to create event");
                    setLoading(false)
                }
            } catch (e) {
                console.error("Error:", e);
                setLoading(false)
            }
        }
    };
    return {
        updateOrmaDetails,
        loading,
        setLoading
    }
}
