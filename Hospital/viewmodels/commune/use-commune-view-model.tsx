import { useState } from "react";
import CommuneService from "../../services/CommuneService";

export const useHamletListByComuneViewModel = () => {
  const [hamlets, setHamlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const fetchHamletsByComune= async (CommuneId:String) => {
    setLoading(true);
    setError(null);

    try {
      const response = await CommuneService.getHamlets(CommuneId);
      setHamlets(response.data);
    } catch (err:any) {
      setHamlets([])
      console.log(err);
      setError(err?.message || "Lỗi lấy danh sách thôn/xóm");
    } finally {
      setLoading(false);
    }
  };

  return {
    hamlets,
    loading,
    error,
    fetchHamletsByComune,
  };
};