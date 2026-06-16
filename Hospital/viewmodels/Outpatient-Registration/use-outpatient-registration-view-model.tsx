import { useState, useEffect } from "react";
import OutpatientRegistrationService from "../../services/OutpatientregistrationService";
import { transformQuillHtml } from "@/utils/function";


export const useOutpatientRegistrationViewModel = () => {
  const [outpatientRegistrations, setOutpatientRegistrations] = useState<any[]>([]);
  const [outpatientRegistration, setOutpatientRegistration] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchOutpatientRegistrations = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await OutpatientRegistrationService.getAll(params);
      setOutpatientRegistrations(response.data);
      console.log(response.data.length);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const fetchOutpatientRegistration = async (OutpatientRegistrationid: String) => {
    setLoading(true);
    try {
      const response = await OutpatientRegistrationService.getDetail(OutpatientRegistrationid);
      if (response?.data?.detail) {
        response.data.detail = transformQuillHtml(response.data.detail);
      }
      setOutpatientRegistration(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };



  return {
    outpatientRegistrations,
    outpatientRegistration,
    loading,
    error,
    refreshOutpatientRegistrations: fetchOutpatientRegistrations,
    fetchOutpatientRegistration
  };
};

