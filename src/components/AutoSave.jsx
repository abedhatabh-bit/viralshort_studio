import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { projectStorage } from '../utils/projectStorage';

/**
 * AutoSave Component
 * Automatically saves project data at specified intervals
 * 
 * @param {Object} props
 * @param {Object} props.project - Project data to save
 * @param {Array} props.frames - Video frames data
 * @param {Function} props.onChange - Callback when save status changes
 * @param {number} props.interval - Save interval in milliseconds
 * @param {boolean} props.enabled - Whether autosave is enabled
 */
const AutoSave = forwardRef(({
  project,
  frames = [],
  onChange,
  interval = 30000,
  enabled = true
}, ref) => {
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(null);
  const lastSavedRef = useRef(null);
  const projectRef = useRef(project);
  const framesRef = useRef(frames);
  
  // Update refs when props change
  useEffect(() => {
    projectRef.current = project;
  }, [project]);
  
  useEffect(() => {
    framesRef.current = frames;
  }, [frames]);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Force save
    forceSave: async () => {
      return await saveProject();
    },
    
    // Check for recovery data
    checkForRecovery: async () => {
      return await checkRecoveryData();
    },
    
    // Apply recovery data
    applyRecovery: async () => {
      return await applyRecoveryData();
    },
    
    // Discard recovery data
    discardRecovery: async () => {
      return await discardRecoveryData();
    }
  }));
  
  // Set up autosave timer
  useEffect(() => {
    if (!enabled) return;
    
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set up new timer
    timerRef.current = setInterval(async () => {
      await saveProject();
    }, interval);
    
    // Check for recovery data on mount
    checkRecoveryData();
    
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, interval]);
  
  // Save project data
  const saveProject = async () => {
    if (!projectRef.current?.id) return false;
    
    try {
      setStatus('saving');
      
      if (onChange) {
        onChange({ status: 'saving' });
      }
      
      // Save project data
      await projectStorage.saveProject(projectRef.current);
      
      // Save frames data if available
      if (framesRef.current?.length > 0) {
        await projectStorage.saveFrames(projectRef.current.id, framesRef.current);
      }
      
      // Update last saved timestamp
      lastSavedRef.current = Date.now();
      
      setStatus('saved');
      
      if (onChange) {
        onChange({ status: 'saved', timestamp: lastSavedRef.current });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save project:', error);
      
      setStatus('error');
      
      if (onChange) {
        onChange({ status: 'error', error });
      }
      
      return false;
    }
  };
  
  // Check for recovery data
  const checkRecoveryData = async () => {
    if (!projectRef.current?.id) return null;
    
    try {
      // Check if recovery data exists
      const recoveryData = await projectStorage.getRecoveryData(projectRef.current.id);
      
      if (recoveryData) {
        setStatus('recovery-available');
        
        if (onChange) {
          onChange({ status: 'recovery-available', data: recoveryData });
        }
        
        return recoveryData;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to check recovery data:', error);
      return null;
    }
  };
  
  // Apply recovery data
  const applyRecoveryData = async () => {
    if (!projectRef.current?.id) return null;
    
    try {
      // Get recovery data
      const recoveryData = await projectStorage.getRecoveryData(projectRef.current.id);
      
      if (!recoveryData) return null;
      
      // Apply recovery data
      setStatus('applying-recovery');
      
      if (onChange) {
        onChange({ status: 'applying-recovery' });
      }
      
      // Clear recovery data
      await projectStorage.clearRecoveryData(projectRef.current.id);
      
      setStatus('recovery-applied');
      
      if (onChange) {
        onChange({ status: 'recovery-applied', data: recoveryData });
      }
      
      return recoveryData;
    } catch (error) {
      console.error('Failed to apply recovery data:', error);
      
      setStatus('error');
      
      if (onChange) {
        onChange({ status: 'error', error });
      }
      
      return null;
    }
  };
  
  // Discard recovery data
  const discardRecoveryData = async () => {
    if (!projectRef.current?.id) return false;
    
    try {
      // Clear recovery data
      await projectStorage.clearRecoveryData(projectRef.current.id);
      
      setStatus('idle');
      
      if (onChange) {
        onChange({ status: 'idle' });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to discard recovery data:', error);
      
      setStatus('error');
      
      if (onChange) {
        onChange({ status: 'error', error });
      }
      
      return false;
    }
  };
  
  // This is a headless component, so it doesn't render anything
  return null;
});

AutoSave.displayName = 'AutoSave';

export default AutoSave;