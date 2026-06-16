import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/blogs"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/blogs"
    return axiosClient.post(url,data);
};
function update(data,blogid){
    const url=`/api/blogs/${blogid}`;
    return axiosClient.put(url,data);
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
  create,
  destroy,
  getDetail,
  update,
  isactive
};
export default BlogService