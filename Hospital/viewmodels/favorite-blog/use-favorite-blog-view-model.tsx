import { useState, useEffect } from "react";
import FavoriteBlogService from "../../services/FavoriteBlogService";
import AuthService from "../../services/auth/AuthService";
import { useAuth } from "../../contexts/auth-context";

export const useFavoriteBlogViewModel = () => {
  const [favoriteblogs, setFavoriteBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchFavoriteBlogs = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await FavoriteBlogService.getAll(params);
      setFavoriteBlogs(response.data);
    } catch (err: any) {
      setFavoriteBlogs([]);
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  const deleteFavoriteBlog = async (blogid: any) => {
    setLoading(true);
    try {
      const response = await FavoriteBlogService.destroy(blogid);
      setFavoriteBlogs(prev =>
        prev.filter(blog => blog.blogid !== blogid)
      );
    } catch (err: any) {
      setFavoriteBlogs([]);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  return {
    favoriteblogs,
    loading,
    error,
    refreshFavoriteBlogs: fetchFavoriteBlogs,
    deleteFavoriteBlog
  };
};


// export const useAddFavoriteBlogViewModel = () => {
//   const [favoriteBlog, setFavoriteBlog] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<any>(null);

//   const addFavoriteBlog = async (data: any) => {
//     setLoading(true);
//     try {
//       const response = await FavoriteBlogService.create(data);
//       setFavoriteBlog(response.data);
//       console.log("response.data: ", response.data);
//     } catch (err: any) {
//       setFavoriteBlog(null);
//       console.error(err);
//       setError(err.message || "Đã có lỗi xảy ra");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     favoriteBlog,
//     loading,
//     error,
//     addFavoriteBlog
//   };
// };


// export const useDestroyFavoriteBlogViewModel = () => {
//   const [favoriteBlogDestroy, setFavoriteBlogDestroy] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<any>(null);

//   const destroyFavoriteBlog = async (blogid: any) => {
//     setLoading(true);
//     try {
//       const response = await FavoriteBlogService.destroy(blogid);
//       setFavoriteBlogDestroy(response.data);
//       console.log("response.data: ", response.data);
//     } catch (err: any) {
//       setFavoriteBlogDestroy(null);
//       console.error(err);
//       setError(err.message || "Đã có lỗi xảy ra");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     favoriteBlogDestroy,
//     loading,
//     error,
//     destroyFavoriteBlog
//   };
// };


