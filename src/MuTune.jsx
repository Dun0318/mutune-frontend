import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SheetMusic from './pages/SheetMusic'
import SheetMusicStep2 from './pages/SheetMusicStep2';
import SheetMusicStep3 from './pages/SheetMusicStep3';

import DefaultLayout from "./layouts/DefaultLayout";
import NoFooterLayout from "./layouts/NoFooterLayout";
import EmptyLayout from "./layouts/EmptyLayout";
import AuthCallback from "./pages/AuthCallback";
import Terms from "./pages/Terms";


function MuTune() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<DefaultLayout><Home /></DefaultLayout>} />
        <Route path="/sheetMusic" element={<SheetMusic />} />
        <Route path="/login" element={<EmptyLayout><Login /></EmptyLayout>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="terms" element={<Terms></Terms>}/>
        <Route path="/sheetmusic/step2" element={<SheetMusicStep2 />} />
        <Route path="/sheetmusic/step3" element={<SheetMusicStep3 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default MuTune