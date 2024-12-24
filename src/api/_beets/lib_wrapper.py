from enum import Enum
from typing import Optional, Tuple

from beets.library import Album, Item, LibModel, Library
from beets.ui import UserError, commands


class SearchType(Enum):
    TRACK = 0
    ALBUM = 1


class LibraryWrapper(Library):  # type: ignore
    def __init__(self, path: str, directory: str, path_format: str):
        super().__init__(
            path=path,
            directory=directory,
            path_formats=(("default", path_format),),
        )

    def multi_query(self, query: str, search_type: SearchType) -> Tuple[LibModel]:
        album = search_type == SearchType.ALBUM
        # commands._do_query returns a list of 2 lists; the first list is
        # the track results; the second list is the album results
        # pylint: disable=protected-access
        try:
            return_values: Tuple[LibModel] = commands._do_query(
                self, query=query, album=album
            )[search_type.value]
        except UserError:
            return []  # type: ignore
        return return_values

    def get_tracks(self, query: str) -> Tuple[Item]:
        return self.multi_query(query, SearchType.TRACK)

    def get_albums(self, query: str) -> Tuple[Album]:
        return self.multi_query(query, SearchType.ALBUM)
