---
description: Repository Information Overview
alwaysApply: true
---

# ViralShort Studio Information

## Summary

ViralShort Studio is a web-based application for creating, editing, and managing viral short-form videos. It provides tools for batch processing, template-based creation, and analytics for social media content.

## Structure

The application is built with React and uses Vite as the build tool. It follows a component-based architecture with pages, reusable UI components, and utility services.

## Language & Runtime

**Language**: JavaScript/JSX (React)
**Version**: React 18.2.0
**Build System**: Vite 5.0.0
**Package Manager**: npm

## Dependencies

**Main Dependencies**:
- react, react-dom: UI framework
- react-router-dom: Routing
- @reduxjs/toolkit, redux: State management
- fabric: Canvas manipulation
- framer-motion: Animations
- tailwindcss: Styling
- lucide-react: Icons
- date-fns: Date utilities

**Development Dependencies**:
- @vitejs/plugin-react: React support for Vite
- tailwindcss, autoprefixer, postcss: CSS processing
- vite-tsconfig-paths: Path aliasing

## Build & Installation

```bash
npm install
npm start       # Development server
npm run build   # Production build
npm run serve   # Serve production build
```

## Key Features

- **Batch Video Creator**: Process multiple videos simultaneously using templates
- **Web Workers**: Parallel processing for video rendering
- **IndexedDB Storage**: Local project persistence
- **Auto-Save**: Automatic project recovery
- **Error Handling**: Robust error recovery system

## Main Files

- **Entry Point**: src/index.jsx
- **Routing**: src/Routes.jsx
- **Pages**: src/pages/* (dashboard, video-creator, batch-creator, etc.)
- **Components**: src/components/* (UI elements, AutoSave)
- **Utilities**: src/utils/* (projectStorage, errorHandling, videoQueue)
- **Workers**: src/workers/videoWorker.js (background processing)

## Testing

**Framework**: Jest with React Testing Library
**Test Location**: Tests are co-located with components
**Run Command**:
```bash
npm test
```