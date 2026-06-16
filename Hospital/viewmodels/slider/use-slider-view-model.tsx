import { useState, useEffect } from "react";
import SliderService from "../../services/SliderService";
import { transformQuillHtml } from "@/utils/function";


export const useSliderViewModel = () => {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSliders = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await SliderService.getAll(params);
      setSliders(response.data);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };


  return {
    sliders,
    loading,
    error,
    refreshSliders: fetchSliders,
  };
};

