export const createAuthState = (set) => ({
    userInfo: null, 
    setUserInfo: (userInfo) => set({ userInfo }),
});