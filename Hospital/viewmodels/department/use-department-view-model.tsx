import { useState, useEffect } from "react";
import DepartmentService from "../../services/DepartmentService";
import { transformQuillHtml } from "@/utils/function";

export const useDepartmentViewModel = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [department, setDepartment] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchDepartments = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await DepartmentService.getAll(params);
      setDepartments(response.data);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartment = async (Departmentid: String) => {
    setLoading(true);
    try {
      const response = await DepartmentService.getDetail(Departmentid);
      setDepartment(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };


  return {
    departments,
    department,
    loading,
    error,
    refreshDepartments: fetchDepartments,
    fetchDepartment
  };
};

