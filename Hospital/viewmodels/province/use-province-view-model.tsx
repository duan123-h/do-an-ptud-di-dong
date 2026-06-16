import { useState, useEffect } from "react";
import ProvinceService from "../../services/ProvinceService";

export const useProvinceListViewModel = () => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const response = await ProvinceService.getAll();
      setProvinces(response.data);
    } catch (err:any) {
      setProvinces([]);
      console.log(err)
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  return {
    provinces,
    loading,
    error,
    refreshProvinces: fetchProvinces
  };
};

export const useCommuneListByProvinceViewModel = () => {
  const [communes, setCommunes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchCommunesByProvince = async (provinceid:String) => {
    setLoading(true);
    try {
      const response = await ProvinceService.getCommunes(provinceid);
      setCommunes(response.data);
    } catch (err:any) {
      setCommunes([]);
      console.log(err);
      console.error(err);
      setError(err.message || "Lỗi lấy danh sách xã");
    } finally {
      setLoading(false);
    }
  };

  return {
    communes,
    loading,
    error,
    fetchCommunesByProvince,
  };
}