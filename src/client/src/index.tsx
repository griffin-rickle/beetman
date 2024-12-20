import React from 'react';
import ReactDOM from 'react-dom/client';

import SearchPage from './pages/Search';
import AlbumPage from './pages/AlbumPage';
import TrackPage from './pages/TrackPage';

import {BrowserRouter, Routes, Route} from 'react-router';

// TODO: Put React Router in here. Move what's currently in here to a Search component. Set up routes for search and edit pages.
const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<SearchPage />}/>
            <Route path="/track/:trackId" element={<TrackPage />} />
            <Route path="/album/:albumId" element={<AlbumPage />} />
        </Routes>
    </BrowserRouter>
);
