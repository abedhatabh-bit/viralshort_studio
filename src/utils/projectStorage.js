/**
 * Project Storage Utility
 * Handles storing and retrieving project data using IndexedDB
 */

// IndexedDB database name and version
const DB_NAME = 'viralshort-studio-db';
const DB_VERSION = 1;

// IndexedDB object stores
const STORES = {
  PROJECTS: 'projects',
  FRAMES: 'frames',
  RECOVERY: 'recovery'
};

// Open IndexedDB database
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject(new Error('Failed to open database'));
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.FRAMES)) {
        db.createObjectStore(STORES.FRAMES, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.RECOVERY)) {
        db.createObjectStore(STORES.RECOVERY, { keyPath: 'id' });
      }
    };
  });
};

// Save project data
const saveProject = async (project) => {
  if (!project || !project.id) {
    throw new Error('Invalid project data');
  }
  
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORES.PROJECTS);
    
    // Add or update project
    const request = store.put({
      ...project,
      lastSaved: Date.now()
    });
    
    request.onerror = (event) => {
      reject(new Error('Failed to save project'));
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

// Get project data
const getProject = async (projectId) => {
  if (!projectId) {
    throw new Error('Invalid project ID');
  }
  
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PROJECTS], 'readonly');
    const store = transaction.objectStore(STORES.PROJECTS);
    
    // Get project by ID
    const request = store.get(projectId);
    
    request.onerror = (event) => {
      reject(new Error('Failed to get project'));
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

// Delete project data
const deleteProject = async (projectId) => {
  if (!projectId) {
    throw new Error('Invalid project ID');
  }
  
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PROJECTS, STORES.FRAMES, STORES.RECOVERY], 'readwrite');
    const projectStore = transaction.objectStore(STORES.PROJECTS);
    const framesStore = transaction.objectStore(STORES.FRAMES);
    const recoveryStore = transaction.objectStore(STORES.RECOVERY);
    
    // Delete project
    const projectRequest = projectStore.delete(projectId);
    
    projectRequest.onerror = (event) => {
      reject(new Error('Failed to delete project'));
    };
    
    // Delete frames
    const framesRequest = framesStore.delete(projectId);
    
    framesRequest.onerror = (event) => {
      console.warn('Failed to delete frames');
    };
    
    // Delete recovery data
    const recoveryRequest = recoveryStore.delete(projectId);
    
    recoveryRequest.onerror = (event) => {
      console.warn('Failed to delete recovery data');
    };
    
    transaction.oncomplete = (event) => {
      resolve(true);
    };
  });
};

// Get all projects
const getAllProjects = async () => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PROJECTS], 'readonly');
    const store = transaction.objectStore(STORES.PROJECTS);
    
    // Get all projects
    const request = store.getAll();
    
    request.onerror = (event) => {
      reject(new Error('Failed to get projects'));
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

// Save frames data
const saveFrames = async (projectId, frames) => {
  if (!projectId || !frames) {
    throw new Error('Invalid frames data');
  }
  
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.FRAMES], 'readwrite');
    const store = transaction.objectStore(STORES.FRAMES);
    
    // Add or update frames
    const request = store.put({
      id: projectId,
      frames,
      lastSaved: Date.now()
    });
    
    request.onerror = (event) => {
      reject(new Error('Failed to save frames'));
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

// Get frames data
const getFrames = async (projectId) => {
  if (!projectId) {
    throw new Error('Invalid project ID');
  }
  
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.FRAMES], 'readonly');
    const store = transaction.objectStore(STORES.FRAMES);
    
    // Get frames by project ID
    const request = store.get(projectId);
    
    request.onerror = (event) => {
      reject(new Error('Failed to get frames'));
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result?.frames || []);
    };
  });
};

// Save recovery data
const saveRecoveryData = async (projectId, data) => {
  if (!projectId || !data) {
    throw new Error('Invalid recovery data');
  }
  
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.RECOVERY], 'readwrite');
    const store = transaction.objectStore(STORES.RECOVERY);
    
    // Add or update recovery data
    const request = store.put({
      id: projectId,
      data,
      timestamp: Date.now()
    });
    
    request.onerror = (event) => {
      reject(new Error('Failed to save recovery data'));
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

// Get recovery data
const getRecoveryData = async (projectId) => {
  if (!projectId) {
    throw new Error('Invalid project ID');
  }
  
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.RECOVERY], 'readonly');
    const store = transaction.objectStore(STORES.RECOVERY);
    
    // Get recovery data by project ID
    const request = store.get(projectId);
    
    request.onerror = (event) => {
      reject(new Error('Failed to get recovery data'));
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result?.data || null);
    };
  });
};

// Clear recovery data
const clearRecoveryData = async (projectId) => {
  if (!projectId) {
    throw new Error('Invalid project ID');
  }
  
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.RECOVERY], 'readwrite');
    const store = transaction.objectStore(STORES.RECOVERY);
    
    // Delete recovery data
    const request = store.delete(projectId);
    
    request.onerror = (event) => {
      reject(new Error('Failed to clear recovery data'));
    };
    
    request.onsuccess = (event) => {
      resolve(true);
    };
  });
};

// Get storage usage
const getStorageUsage = async () => {
  try {
    // Check if the Storage API is available
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        percent: estimate.quota ? Math.round((estimate.usage / estimate.quota) * 100) : 0
      };
    }
    
    // Fallback if Storage API is not available
    return {
      usage: 0,
      quota: 0,
      percent: 0
    };
  } catch (error) {
    console.error('Failed to get storage usage:', error);
    
    return {
      usage: 0,
      quota: 0,
      percent: 0,
      error: error.message
    };
  }
};

// Clear all data
const clearAllData = async () => {
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.PROJECTS, STORES.FRAMES, STORES.RECOVERY], 'readwrite');
      
      // Clear all object stores
      transaction.objectStore(STORES.PROJECTS).clear();
      transaction.objectStore(STORES.FRAMES).clear();
      transaction.objectStore(STORES.RECOVERY).clear();
      
      transaction.oncomplete = (event) => {
        resolve(true);
      };
      
      transaction.onerror = (event) => {
        reject(new Error('Failed to clear all data'));
      };
    });
  } catch (error) {
    console.error('Failed to clear all data:', error);
    throw error;
  }
};

// Export the project storage API
export const projectStorage = {
  saveProject,
  getProject,
  deleteProject,
  getAllProjects,
  saveFrames,
  getFrames,
  saveRecoveryData,
  getRecoveryData,
  clearRecoveryData,
  getStorageUsage,
  clearAllData
};