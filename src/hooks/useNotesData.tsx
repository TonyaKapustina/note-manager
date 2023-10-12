import useSWR from "swr";
import {NoteType} from "../interfaces/note";
import {apiEndpoints} from "../api/apiEndpoints";
import {useEffect, useMemo} from "react";
import {useRouter} from "next/router";
import {getOpenDirectoryId} from "../utils/url";

export const useNotesData = () => {
    const {data, isLoading} = useSWR<NoteType[], boolean>(apiEndpoints.notices);
    const {query: {id, noteId}, push} = useRouter();
    const queryId = id as string[];
    const currentDirectory = getOpenDirectoryId(queryId);

    const openDirectoryNotes = useMemo(() => {
        if (!isLoading && queryId && data?.length) {
            return data.filter(({directoryId}) => directoryId === currentDirectory)
        }
    }, [data, isLoading, queryId]);

    useEffect(() => {
        if (!isLoading && noteId && openDirectoryNotes?.length) {
            const isNoteInDirectory = openDirectoryNotes.some(({id}) => id === Number(noteId));

            if (!isNoteInDirectory) {
                push('/404')
            }
        }
    }, [openDirectoryNotes, isLoading, noteId, push, queryId]);

    return {
        notesData: data || [],
        isNotesDataLoading: isLoading,
        openDirectoryNotes: openDirectoryNotes || [],
        currentDirectory
    }
}