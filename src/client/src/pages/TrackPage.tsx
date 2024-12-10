import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import TrackComponent from '../components/TrackComponent';
import { Track } from '../types';
import { getTrack, updateTrack } from '../api';

const TrackPage: React.FC = () => {
    const [ trackInfo, setTrackInfo ] = useState<Track | undefined>(undefined);
    const { trackId } = useParams();

    useEffect(() => {
        if(!!trackId) {
            const trackInfo = getTrack(parseInt(trackId));
            trackInfo.then(response => {
                if(!!response) {
                    setTrackInfo(response);
                }
            });
        }
    }, []);

    const handleButtonClick = (event) => {
        if(!!trackId && !!trackInfo) {
            const result = updateTrack(parseInt(trackId), trackInfo);
        }
    };

    return (
        <>
            <h1>Track Page</h1>
            {!!trackInfo ? <TrackComponent track={trackInfo} setTrackInfo={setTrackInfo}/>: <h2>Loading</h2>}
            <button onClick={handleButtonClick}>Save</button>
        </>
    )
};

export default TrackPage;
