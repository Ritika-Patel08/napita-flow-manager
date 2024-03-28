import { useUserStore } from '@/store/user';
import axios from 'axios';
import { client } from "@/api"

const login = async (username: string, password: string): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  //let token = ""
  try {
    const resp = await client({
      url: "access/token",
      method: "post",
      baseURL,
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }) as any;

    return Promise.resolve(resp.data);
  } catch(err) {
    return Promise.reject("Sorry, login failed. Please try again");
  }
}

const fetchExpirationTime = async (token: any): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;

  try {
    const resp = await client({
      url: "access/token/expiration",
      method: "get",
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as any;
    return Promise.resolve(resp);
  } catch (err) {
    return Promise.reject("Sorry, login failed. Please try again");
  }
}
const FetchProcessGroups = async (token: any, root: any): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;

  try {
    const resp = await client({
      url: `flow/process-groups/${root}`,
      method: "get",
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as any;
    const processGroupDetails = resp.data.processGroupFlow.flow.processGroups.map((group: any) => ({
          id: group.id,
          name: group.component.name,
          runningCount: group.runningCount,
          stoppedCount: group.stoppedCount,
          invalidCount: group.invalidCount,
          disabledCount: group.disabledCount,
          inputPortCount: group.inputPortCount
        }));
    //console.log(processGroupDetails);
    return Promise.resolve(processGroupDetails);
  } catch (err) {
    console.log(err);  
    return Promise.reject("Sorry, login failed. Please try again");
  }
}

const FetchProcessGroupsConnection = async (root: any, token: any, groupId: any): Promise<any> => {  
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;

  try {
    const resp = await client({
      url: `flow/process-groups/${root}`,
      method: "get",
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as any;
    const connections = resp.data.processGroupFlow.flow.connections;
    
    const connection = connections.find((conn: any) => conn.destination?.groupId === groupId);
    
    if (connection) {
      const sourceGroupId = connection.source?.id;
      if (sourceGroupId) {
        console.log(sourceGroupId);
        return Promise.resolve(sourceGroupId);
      } else {
        return Promise.reject("SourceId not found in the connection object");
      }
    } else {
      return Promise.reject("GroupId not found in any destination");
    }
  } catch (err) {
    console.log(err);  
    return Promise.reject("Sorry, login failed. Please try again");
  }
}
  
const logout = async (token: any): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;
  let response = ''
  try {
    const resp = await client({
      url: "access/logout",
      method: "delete",
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as any;
    response = resp;
  } catch (err) {
    return Promise.reject("Sorry, logout failed. Please try again");
  }
  return response;
}

export const UserService = {
  login,
  fetchExpirationTime,
  logout,
  FetchProcessGroups,
  FetchProcessGroupsConnection
}