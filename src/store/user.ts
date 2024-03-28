import { defineStore } from "pinia";
import { UserService } from "@/services/UserService"
import { DateTime } from 'luxon';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      instanceUrl: "",
      token: {
        value: '',
        expirationTime: ''
      }as any,
      processGroups: [],
      currentProcessGroup:{} as any,
      root:'a3229852-0187-1000-8abc-9e42ca1734f2'
    }
  },
  getters: {
    getInstanceUrl(state) {
      return state.instanceUrl
    },
    getBaseUrl(state) {
      let baseURL = process.env.VUE_APP_BASE_URL;
      if (!baseURL) baseURL = state.instanceUrl;
      return baseURL.startsWith('http') ? baseURL : `https://${baseURL}.hotwax.io/nifi-api`;
    },
    getUserToken(state) {
      return state.token;
    },
    getProcessGroups(state) {
      return state.processGroups
    },
    getCurrentProcessGroup(state) {
      return state.currentProcessGroup
    },
    isAuthenticated(state) {
      let isTokenExpired = false
      
      if (state.token.expirationTime) {

        const currTime = DateTime.now().toMillis()
        isTokenExpired = state.token.expirationTime < currTime
      }
      
      return state.token.value && !isTokenExpired
    }
  },
  actions: {
    async login( username: string, password:string ) {
      try {
        if (!username.length || !password.length) {
          return Promise.reject('')
        }

        const token = await UserService.login(username, password);
 
        this.token.value = token;
      
        const expirationTimeDetails = await UserService.fetchExpirationTime(token);
    
        const expirationDateTime = DateTime.fromISO(expirationTimeDetails.data.accessTokenExpiration.expiration).toMillis();

        this.token.expirationTime = expirationDateTime;

        // const processGroups = await UserService.FetchProcessGroups(token);
        // this.processGroups = processGroups.processGroupFlow.flow.processGroups.map((group: any) => group.component.name);
        const processGroups = await UserService.FetchProcessGroups(token,this.root);
        this.processGroups = processGroups;

        return Promise.resolve(token)
      } catch(err){
        console.log("user.ts",err);
        
        return Promise.reject(err)
      }
    },
    async fetchProcessGroupFromParent(root: any){
      try {
        const token = this.token.value;
        const fetchProcessGroupFromParent = await UserService.FetchProcessGroups(token,root);      
        return Promise.resolve(fetchProcessGroupFromParent);
      }catch(err){
        Promise.reject(err);
      }
    },
    async fetchProcessGroupConnection(groupId: any){
      try {
        const token = this.token.value;
        const root = this.root;
        const fetchProcessGroupConnection = await UserService.FetchProcessGroupsConnection(token,root,groupId);      
        return Promise.resolve(fetchProcessGroupConnection);
      }catch(err){
        Promise.reject(err);
      }
    },
    setCurrentProcessGroup(processGroup: any) {
      this.currentProcessGroup = processGroup;
    },
    async setUserInstanceUrl(instanceUrl: string) {
      this.instanceUrl = instanceUrl;
    },
    async logout()
    {
      const token = this.token.value;
      this.token.value = ''
      await UserService.logout(token);
    },
  },
  persist: true,
})