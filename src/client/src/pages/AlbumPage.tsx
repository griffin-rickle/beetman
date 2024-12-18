import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Album } from '../types';
import { getAlbum, updateAlbum } from '../api';
import AlbumComponent from '../components/AlbumComponent';

const AlbumPage: React.FC = () => {
    const [ albumInfo, setAlbumInfo ] = useState<Album | undefined>(undefined);
    const { albumId } = useParams();

    useEffect(() => {
        if(!!albumId) {
            const albumInfo = getAlbum(parseInt(albumId));
            albumInfo.then(response => {
                if(!!response) {
                    console.log(response);
                    setAlbumInfo(response);
                }
            });
        }
    }, []);

    const handleButtonClick = (event) => {
        if(!!albumId && !!albumInfo) {
            const result = updateAlbum(parseInt(albumId), albumInfo)
        }
    };

    return (
        <>
            {!!albumInfo ? <AlbumComponent album={albumInfo} setAlbumInfo={setAlbumInfo}/>: <h2>Loading</h2>}
            <button onClick={handleButtonClick}>Save</button>
        </>
    );
};

export default AlbumPage;
