import { useState, useEffect } from "react";
import BlogService from "../../services/BlogService";
import { transformQuillHtml } from "@/utils/function";
import FavoriteBlogService from "../../services/FavoriteBlogService";

export const useBlogViewModel = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blog, setBlog] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchBlogs = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await BlogService.getAll(params);
      setBlogs(response.data);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlog = async (blogid: String) => {
    setLoading(true);
    try {
      const response = await BlogService.getDetail(blogid);
      if (response?.data?.detail) {
        response.data.detail = transformQuillHtml(response.data.detail);
      }
      setBlog(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const addFavoriteBlog = async (data: any) => {
    setLoading(true);
    try {
      const response = await FavoriteBlogService.create(data);
      setBlogs(prev =>
        prev.map(blog =>
          blog.blogid === response?.data?.blogid
            ? { ...blog, isfavorite: true }
            : blog
        )
      );
      blog.isfavorite = true;
      setBlog(blog);

      console.log("response.data: ", response.data);
    } catch (err: any) {
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

      setBlogs(prev =>
        prev.map(blog =>
          blog.blogid === blogid
            ? { ...blog, isfavorite: false }
            : blog
        )
      );
      blog.isfavorite = false;
      setBlog(blog);
      console.log("response.data: ", response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };


  return {
    blogs,
    blog,
    loading,
    error,
    refreshBlogs: fetchBlogs,
    fetchBlog,
    addFavoriteBlog,
    deleteFavoriteBlog
  };
};

