# Three Resume - Interactive 3D Portfolio

A high-performance interactive resume built with **Next.js 15**, **Three.js**, and **TypeScript**. This project demonstrates advanced web graphics programming, real-time user interface interaction, and modern full-stack development practices.

## Overview

Three Resume is a sophisticated web application that blends 3D graphics rendering with responsive web design to create an engaging portfolio experience. The application features:

- **Interactive 3D Scene Rendering** - Real-time 3D graphics powered by Three.js with GLTF asset loading
- **Camera Animation System** - Choreographed camera movements and tweening for narrative-driven scene exploration
- **Responsive Design** - Seamless experience across desktop and mobile with adaptive UI overlays
- **Optimized Performance** - Strategic asset loading and GPU-accelerated rendering
- **Type-Safe Development** - Full TypeScript implementation with strict mode enabled

## Tech Stack

### Core
- **Next.js 15** - React framework with server-side rendering and optimized builds
- **React 19** - Component-based UI architecture
- **TypeScript** - Type-safe development with strict compiler settings
- **Three.js** - WebGL-based 3D graphics library

### Build & Tooling
- **Webpack** (via Next.js) - Module bundling and code splitting
- **PostCSS** - CSS transformation and optimization
- **ESLint/Prettier** - Code quality and formatting standards

## Architecture Highlights

### State Management
- Centralized application state via Zustand store (\ppStateStore.ts\)
- Page navigation and UI state management

### Animation & Interaction
- Custom React hooks for camera manipulation (\useCameraAnimate\, \useCameraConfig\)
- Scroll-driven animations with trigger points (\useScrollTriggerAnimations\)
- Button animation state (\useContactButtonAnimation\)

### 3D Graphics Pipeline
- GLTF model loading with material management (\GLTFAssetLoader.tsx\)
- Material application and optimization (\pplyMats.tsx\)
- Raycasting for interactive object selection (\aycast.tsx\)
- Camera targeting and smooth interpolation (\	argetAnimate.tsx\)

### Responsive Architecture
- Mobile detection and adaptive layouts (\useMobileDetection\)
- Platform-specific UI components (mobile side pane, desktop overlay)
- Debug utilities for camera system development

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation & Development

\\\ash
# Install dependencies
npm install

# Start development server with hot-reload
npm run dev
\\\

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

\\\ash
npm run build
npm start
\\\

## Project Structure

\\\
app/
 components/
    Scene.tsx                    # Main Three.js scene setup
    GLTFAssetLoader.tsx          # Model loading and caching
    ExperienceContent.tsx        # Content presentation layer
    stages/                      # Scene-specific components
 hooks/                           # Custom React hooks for animation & state
 store/                           # Zustand state management
 utils/                           # Graphics utilities & helpers
 types/                           # TypeScript type definitions
 enums/                           # Page navigation enums
\\\

## Key Features for Developers

### Performance Optimizations
- Lazy-loaded GLTF assets with streaming support
- GPU-accelerated camera animations
- Efficient state updates with selective re-renders
- Optimized bundle sizes with Next.js code splitting

### Developer Experience
- Hot Module Replacement (HMR) for rapid iteration
- TypeScript strict mode for safety and clarity
- Modular component architecture for maintainability
- Centralized configuration management

### Advanced Techniques
- **Raycasting** for 3D object interaction detection
- **Tweening** for smooth interpolated animations
- **Material Management** for complex shader optimization
- **Responsive Viewport Handling** for adaptive rendering

## Development Commands

\\\ash
# Development server with hot-reload
npm run dev

# Build production bundle
npm run build

# Start production server
npm start

# Troubleshoot port conflicts (Windows)
netstat -ano | findstr :3000
taskkill /F /PID <PID>
\\\

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires WebGL support

## License

Open source project showcasing modern web development practices.
