import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  url: string;
}

class DocumentService {
  async getPolicyDocuments(
    policyId: string,
    token: string
  ): Promise<Document[]> {
    try {
      const response = await axios.get(
        `${API_URL}/documents/policy/${policyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching policy documents:", error);
      throw error;
    }
  }

  async uploadDocuments(
    files: File[],
    policyId: string,
    applicationId: string,
    token: string
  ): Promise<Document[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        `${API_URL}/documents/upload/multiple?applicationId=${applicationId}&policyId=${policyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading documents:", error);
      throw error;
    }
  }
}

export const documentService = new DocumentService();
