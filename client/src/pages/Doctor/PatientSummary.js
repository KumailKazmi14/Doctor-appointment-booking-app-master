import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PatientForm from "../../components/PatientForm";

function PatientSummary() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const params = useParams();
    const [doctor, setDoctor] = useState(null);
    const navigate = useNavigate();
    const onFinish = async (values) => {
      try {
        dispatch(showLoading());
        const response = await axios.post(
          "/api/doctor/patientsummary",
          {
            ...values,
            userId: user._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Something went wrong");
      }
    };

    const getDoctorData = async () => {
        try {
          dispatch(showLoading());
          const response = await axios.post(
            "/api/doctor/get-doctor-info-by-user-id",
            {
              userId: params.userId,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
    
          dispatch(hideLoading());
          if (response.data.success) {
            setDoctor(response.data.data);
          }
        } catch (error) {
          console.log(error);
          dispatch(hideLoading());
        }
      };
    
      useEffect(() => {
        getDoctorData();
      }, []);
  
    return (
      <Layout>
        <h1 className="page-title">Patient's Appointment Summary</h1>
        <hr />
  
       {doctor && <PatientForm onFinish={onFinish} initivalValues={doctor} /> }
      </Layout>
    );
  }
  
  export default PatientSummary;