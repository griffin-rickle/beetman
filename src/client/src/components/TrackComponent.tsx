import React from 'react';
import { Track } from '../types';

interface TrackComponentProps {
    track: Track;
    setTrackInfo: Function;
}
const TrackComponent: React.FC<TrackComponentProps> = ({track, setTrackInfo}: TrackComponentProps) => {
    const handleValueChange = (event, key) => {
        const newTrack = { ...track };
        newTrack[key] = event.target.value;
        setTrackInfo(newTrack);
    }
    return (
        <>
            {Object.keys(track).map((key) => {
                return (
                    <>
                        <table>
                            <td>
                                <label key={`${key}-label`} htmlFor="track-id">{`${key}: `}</label>
                                <input onChange={(event) => handleValueChange(event, key)} key={`${key}-input`} name="track-id" type="text" placeholder={track[key].toString()} />
                            </td>
                        </table>
                    </>
                );
            })}
        </>
    );
};

export default TrackComponent;
