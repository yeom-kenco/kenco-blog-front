import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false, // ✅ 인증 확인 완료 여부
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
      state.authChecked = true
    },
    clearUser(state) {
      state.user = null
      state.isAuthenticated = false
      state.authChecked = true
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
