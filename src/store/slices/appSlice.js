// src/store/slices/appSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appReady: false,
  isFirstLaunch: true,
  currentScreen: null,
  navigationHistory: [],
  modalVisible: false,
  modalType: null,
  modalData: null,
  toast: {
    visible: false,
    message: '',
    type: 'info', // 'success' | 'error' | 'info' | 'warning'
    duration: 3000,
  },
  networkStatus: {
    isConnected: true,
    type: null,
  },
  lastSync: null,
  pendingActions: [],
  theme: 'light', // 'light' | 'dark' | 'system'
  currentLanguage: 'tr',
  appMetrics: {
    sessionStartTime: null,
    screenViewCount: {},
    featureUsage: {},
    errorCount: 0,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppReady: (state, action) => {
      state.appReady = action.payload;
    },
    setFirstLaunch: (state, action) => {
      state.isFirstLaunch = action.payload;
    },
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
      state.navigationHistory.push(action.payload);
      // Keep only last 10 screens in history
      if (state.navigationHistory.length > 10) {
        state.navigationHistory.shift();
      }
    },
    showModal: (state, action) => {
      state.modalVisible = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data;
    },
    hideModal: (state) => {
      state.modalVisible = false;
      state.modalType = null;
      state.modalData = null;
    },
    showToast: (state, action) => {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 3000,
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = {
        isConnected: action.payload.isConnected,
        type: action.payload.type,
      };
    },
    setLastSync: (state, action) => {
      state.lastSync = action.payload;
    },
    addPendingAction: (state, action) => {
      state.pendingActions.push(action.payload);
    },
    removePendingAction: (state, action) => {
      state.pendingActions = state.pendingActions.filter(
        (action) => action.id !== action.payload
      );
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
    updateAppMetrics: (state, action) => {
      state.appMetrics = {
        ...state.appMetrics,
        ...action.payload,
      };
    },
    incrementScreenView: (state, action) => {
      const screenName = action.payload;
      state.appMetrics.screenViewCount[screenName] = 
        (state.appMetrics.screenViewCount[screenName] || 0) + 1;
    },
    incrementFeatureUsage: (state, action) => {
      const featureName = action.payload;
      state.appMetrics.featureUsage[featureName] = 
        (state.appMetrics.featureUsage[featureName] || 0) + 1;
    },
    incrementErrorCount: (state) => {
      state.appMetrics.errorCount += 1;
    },
    startSession: (state) => {
      state.appMetrics.sessionStartTime = Date.now();
    },
    resetAppState: () => initialState,
  },
});

export const {
  setAppReady,
  setFirstLaunch,
  setCurrentScreen,
  showModal,
  hideModal,
  showToast,
  hideToast,
  setNetworkStatus,
  setLastSync,
  addPendingAction,
  removePendingAction,
  setTheme,
  setLanguage,
  updateAppMetrics,
  incrementScreenView,
  incrementFeatureUsage,
  incrementErrorCount,
  startSession,
  resetAppState,
} = appSlice.actions;

export default appSlice.reducer;