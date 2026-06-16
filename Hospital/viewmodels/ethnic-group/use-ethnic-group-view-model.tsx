import { useState, useEffect } from "react";
import EthnicgroupService from "../../services/EthnicgroupService";

export const useEthnicGroupListViewModel = () => {
  const [ethnicGroup, setEthnicGroup] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEthnicGroup = async () => {
    setLoading(true);
    try {
      const response = await EthnicgroupService.getAll();
      setEthnicGroup(response.data); 
    } catch (err:any) {
      console.log(err)
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEthnicGroup();
  }, []);

  return {
    ethnicGroup,
    loading,
    error,
    refreshEthnicGroup: fetchEthnicGroup
  };
};
