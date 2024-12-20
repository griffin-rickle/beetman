import React from 'react';
import { Album } from '../types';

interface AlbumComponentProps {
    album: Album;
    setAlbumInfo: Function;
}

const AlbumComponent: React.FC<AlbumComponentProps> = ({album, setAlbumInfo}: AlbumComponentProps) => {
    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const newAlbum = { ...album };
        newAlbum[key] = event.target.value;
        setAlbumInfo(newAlbum);
    }
    return (
        <>
            <h1>{album.albumartist} - {album.title}</h1>
            {Object.keys(album).map((key) => {
                if(key === 'tracks') { return null }
                return (
                    <>
                        <table>
                            <td>
                                <label key={`${key}-label`} htmlFor="album-id">{`${key}: `}</label>
                                <input onChange={(event) => handleValueChange(event, key)} key={`${key}-input`} name="album-id" type="text" placeholder={album[key].toString()} />
                            </td>
                        </table>
                    </>
                );
            })}
            <h2>Tracks</h2>
            <table>
                <thead>
                    <tr>
                        <td>Track</td>
                        <td>Title</td>
                    </tr>
                </thead>
                <tbody>
                    {album.tracks.map((track) => {
                        return (
                            <tr>
                                <td>{track.track}</td>
                                <td><a href={`/track/${track.id}`}>{track.title}</a></td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
        </>
    );
};

export default AlbumComponent;
