import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/blogs"
    return axiosClient.get(url,{params});
};
function getDetail(blogid){
    const url="/api/blogs/"
    return axiosClient.get(`${url}${blogid}`);
}
function destroy(blogid){
    const url="/api/blogs/"
    return axiosClient.delete(`${url}${blogid}`);
}
function isactive(blogid){
    const url="/api/blogs/isactive/"
    return axiosClient.get(`${url}${blogid}`);
}
const BlogService = {
  getAll,
  destroy,
  getDetail,
  isactive
};
export default BlogService