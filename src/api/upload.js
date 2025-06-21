import request from "@/utils/request"; // Axios instance

// Function to upload an image
export function uploadImage(file) {
  const formData = new FormData();
  formData.append("img", file);

  return request({
    url: "/upload_img/upload_img", // The endpoint for uploading the file
    method: "post", // HTTP method (POST)
    data: formData, // Sending FormData containing the file
    headers: {
      "Content-Type": "multipart/form-data", // Ensures the request is formatted for file uploads
    },
  });
}
