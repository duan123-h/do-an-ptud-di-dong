import { useState, useEffect } from "react";
import MedicalExaminationService from "../../services/MedicalexamService";
import { transformQuillHtml } from "@/utils/function";


export const useMedicalExaminationViewModel = () => {
  const [medicalExaminations, setMedicalExaminations] = useState<any[]>([]);
  const [medicalExamination, setMedicalExamination] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchMedicalExaminations = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await MedicalExaminationService.getAll(params);
      setMedicalExaminations(response.data);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalExamination = async (MedicalExaminationid: String) => {
    setLoading(true);
    try {
      const response = await MedicalExaminationService.getDetail(MedicalExaminationid);
      if (response?.data?.detail) {
        response.data.detail = transformQuillHtml(response.data.detail);
      }
      setMedicalExamination(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };



  return {
    medicalExaminations,
    medicalExamination,
    loading,
    error,
    refreshMedicalExaminations: fetchMedicalExaminations,
    fetchMedicalExamination
  };
};

