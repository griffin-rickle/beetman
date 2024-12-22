import React from 'react';
import ReactDOM from 'react-dom/client';

import AlbumPage from './pages/AlbumPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/Search';
import TrackPage from './pages/TrackPage';

import {BrowserRouter, Routes, Route, Navigate} from 'react-router';
import AuthProvider, {AuthIsNotSignedIn, AuthIsSignedIn} from './contexts/authContext';


// TODO: Put React Router in here. Move what's currently in here to a Search component. Set up routes for search and edit pages.
const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
    <AuthProvider>
        <AuthIsSignedIn>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SearchPage />}/>
                    <Route path="/login" element={<LoginPage />}/>
                    <Route path="/track/:trackId" element={<TrackPage />} />
                    <Route path="/album/:albumId" element={<AlbumPage />} />
                </Routes>
            </BrowserRouter>
        </AuthIsSignedIn>
        <AuthIsNotSignedIn>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />}/>
                    <Route path="/*" element={<Navigate replace to={"/login"}/>}/>
                </Routes>
            </BrowserRouter>
        </AuthIsNotSignedIn>
    </AuthProvider>
);
