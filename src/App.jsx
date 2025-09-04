import React, { useEffect } from "react";
import Routes from "./Routes";
import { errorHandler } from "./utils/errorHandling";
import startupValidator from "./utils/startupValidator";
import AppDebugger from "./utils/appDebugger";
import "./utils/appAnalytics";
import "./utils/consoleCommands";
import { fixCommonIssues } from "./utils/componentFixer";

function App() {
  useEffect(() => {
    // Initialize error handling
    errorHandler.addListener((error) => {
      if (error.type === 'critical') {
        console.error('Critical error detected:', error);
      }
    });

    // Fix common component issues
    fixCommonIssues();

    // Run comprehensive system check
    const runSystemCheck = async () => {
      try {
        console.log('🔍 Running comprehensive system check...');
        window.analytics?.trackFeature('system_check_started');
        
        // Run startup validation
        if (startupValidator?.validate) {
          const report = await startupValidator.validate();
          if (report.healthy) {
            console.log('✅ Basic validation passed');
          } else {
            console.warn('⚠️ Basic validation issues detected');
          }
        }
        
        // Run deep diagnostic in development
        if (process.env.NODE_ENV === 'development') {
          const appDebugger = new AppDebugger();
          await appDebugger.autoFix();
          const diagnosticReport = await appDebugger.runFullDiagnostic();
          
          if (diagnosticReport.status === 'HEALTHY') {
            console.log('✅ ViralShort Studio - All systems operational');
          } else {
            console.warn('⚠️ System issues detected:', diagnosticReport);
          }
        }
        
      } catch (error) {
        console.error('❌ System check failed:', error);
      }
    };
    
    runSystemCheck();
  }, []);
  
  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error('Global error caught:', event.error);
      errorHandler.handleError(event.error, 'global');
    };
    
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      errorHandler.handleError(event.reason, 'promise');
    };
    
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <Routes />
  );
}

export default App;
