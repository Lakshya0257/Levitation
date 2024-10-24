// import client from "../client/client";
// import { ApiResponse } from "../types/api";

// export const fetchAllProjects = (): Promise<ApiResponse> => client.get('/project/all');
// export const fetchProjectSettings = (projectId:string): Promise<ApiResponse> => client.get(`/project/${projectId}/settings`);
// export const updateProject = (projectId: string, projectData:any): Promise<ApiResponse> => client.patch(`/project/${projectId}`, projectData);
// export const fetchProject = (projectId:string): Promise<ApiResponse> => client.get(`/project/${projectId}`);
// export const fetchStack = (projectId:string, sId:string): Promise<ApiResponse> => client.get(`/project/${projectId}/stack/${sId}`);
// export const createNewProject = (projectData:any): Promise<ApiResponse> => client.post('/project/new', projectData);
// export const createNewStack = (stackData:any): Promise<ApiResponse> => client.post('/project/stack/new', stackData);
// export const editStack = (projectId: string, sId: string,stackData:any): Promise<ApiResponse> => client.patch(`/project/${projectId}/stack/${sId}`, stackData);
// export const deleteStack = (projectId: string, sId: string): Promise<ApiResponse> => client.delete(`/project/${projectId}/stack/${sId}`);
// export const editSignature = (projectId: string, sId: string, signatureId: string, signatureData: any): Promise<ApiResponse> => client.patch(`/project/${projectId}/stack/${sId}/signature/${signatureId}`, signatureData);
// export const createSignature = (signatureData: any): Promise<ApiResponse> => client.post('/project/stack/signature/new', signatureData);
// export const deleteSignature = (projectId: string, sId: string, signatureId: string): Promise<ApiResponse> => client.delete(`/project/${projectId}/stack/${sId}/signature/${signatureId}`);
// export const createNewComponent = (componentData:any): Promise<ApiResponse> => client.post('/project/stack/component/new', componentData);
// export const deleteComponent = (projectId: string, stackId: string, signatureId: string, componentId: string): Promise<ApiResponse> => client.delete(`/project/${projectId}/stack/${stackId}/signature/${signatureId}/component/${componentId}`)
// export const fetchAllInterfaces = (): Promise<ApiResponse> => client.get('/project/interfaces');
// export const fetchViewers = ():Promise<ApiResponse> => client.get('/project/viewers');
// // export const createUser = (userData: Omit<User, 'id'>): Promise<ApiResponse<User>> => client.post('/users', userData);