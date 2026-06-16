import { useState, useEffect } from "react";
import PrescriptionService from "../../services/PrescriptionService";
import { transformQuillHtml } from "@/utils/function";


export const usePrescriptionViewModel = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [prescription, setPrescription] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchPrescriptions = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await PrescriptionService.getAll(params);
      setPrescriptions(response.data);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescription = async (Prescriptionid: String) => {
    setLoading(true);
    try {
      const response = await PrescriptionService.getDetail(Prescriptionid);
      if (response?.data?.detail) {
        response.data.detail = transformQuillHtml(response.data.detail);
      }
      setPrescription(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };



  return {
    prescriptions,
    prescription,
    loading,
    error,
    refreshPrescriptions: fetchPrescriptions,
    fetchPrescription
  };
};

