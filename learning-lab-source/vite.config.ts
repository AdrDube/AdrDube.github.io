import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'/learning-lab/',plugins:[react()],build:{outDir:'../learning-lab',emptyOutDir:true}});
