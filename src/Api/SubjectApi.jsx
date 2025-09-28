
import axiosInstance from './axiosTest.jsx'
import axios from "axios";
// const API_URL = import.meta.env.VITE_TEST_API_URL

export const GetAllSubject = async () => {
    const allSubject = await axiosInstance.get(`/subjects`);
    return allSubject.data;
};