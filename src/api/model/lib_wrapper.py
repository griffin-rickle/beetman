from enum import Enum
from typing import Tuple

from beets.library import Album, Item, LibModel, Library
from beets.ui import UserError, commands


class SearchType(Enum):
    TRACK = 0
    ALBUM = 1


class LibraryWrapper(Library):  # type: ignore
    def __init__(self, path: str, directory: str):
        super().__init__(path=path, directory=directory)

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
            pass
        return return_values

    def single_query(self, query: str, search_type: SearchType) -> LibModel:
        # pylint: disable=protected-access
        results = self.multi_query(query, search_type)

        if len(results) == 0:
            raise RuntimeError(f"Could not find item from query {query}")

        if len(results) > 1:
            raise RuntimeError(f"Found more than one item with query {query}")

        return results[0]

    def get_albums(self, query: str) -> Tuple[Album]:
        return self.multi_query(query, SearchType.ALBUM)

    def get_single_album(self, query: str) -> Album:
        return self.single_query(query, SearchType.ALBUM)

    def get_single_track(self, query: str) -> Item:
        return self.single_query(query, SearchType.TRACK)
