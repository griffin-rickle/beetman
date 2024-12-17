import React from 'react';
import { Album } from '../types';

interface AlbumComponentProps {
    album: Album;
    setAlbumInfo: Function;
}
const AlbumComponent: React.FC<AlbumComponentProps> = ({album, setAlbumInfo}: AlbumComponentProps) => {
    const handleValueChange = (event, key) => {
        const newAlbum = { ...album };
        newAlbum[key] = event.target.value;
        setAlbumInfo(newAlbum);
    }
    return (
        <>
            {Object.keys(album).map((key) => {
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
        </>
    );
};

export default AlbumComponent;
