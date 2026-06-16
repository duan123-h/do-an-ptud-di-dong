import { useState, useEffect } from "react";
import ServiceRequestService from "../../services/ServicerequestService";
import { transformQuillHtml } from "@/utils/function";


export const useServiceRequestViewModel = () => {
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [serviceRequestDetails, setServiceRequestDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchServiceRequests = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await ServiceRequestService.getAll(params);
      setServiceRequests(response.data);
      console.log(response.data.length);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  const fetchServiceRequestDetails = async (id: any) => {
    setLoading(true);
    try {
      const response = await ServiceRequestService.getDetails(id);
      setServiceRequestDetails(response.data);
      console.log(response.data.length);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };




  return {
    serviceRequests,
    loading,
    error,
    refreshServiceRequests: fetchServiceRequests,
    fetchServiceRequestDetails,
    serviceRequestDetails
  };
};

