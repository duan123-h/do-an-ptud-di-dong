import { useState, useEffect } from "react";
import StaffService from "../../services/StaffService";
import { transformQuillHtml } from "@/utils/function";

export const useStaffViewModel = () => {
  const [staffs, setStaffs] = useState<any[]>([]);
  const [staff, setStaff] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchStaffs = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await StaffService.getAll(params);
      setStaffs(response.data);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async (Staffid: String) => {
    setLoading(true);
    try {
      const response = await StaffService.getDetail(Staffid);
      setStaff(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };


  return {
    staffs,
    staff,
    loading,
    error,
    refreshStaffs: fetchStaffs,
    fetchStaff
  };
};

