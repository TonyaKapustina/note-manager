import React, {FC, useMemo, useState} from "react";
import ReactDOM from "react-dom";
import useSWR from "swr";
import {apiEndpoints} from "../../api/apiEndpoints";
import {useRouter} from "next/router";
import {isNoticeTitleNotUnique} from "../../utils/notice";
import {NoticeType} from "../../interfaces/notice";
import {InputField} from "../general/inputField";
import CreatableSelect from "react-select/creatable";

type NoteModalPropsType = {
    setShowModal: (boolean) => void,
    onSave: () => void,
    notice?: NoticeType,
}

const NoticeModal: FC<NoteModalPropsType> = ({
                                                 setShowModal,
                                                 notice,
                                                 onSave,
                                             }) => {
    const {
        title = "New note",
        description = "Text...",
        tags = [],
        id,
        ...rest
    } = notice || {};
    const {query: {id: queryId = []}} = useRouter();
    const {data: noticesData} = useSWR(apiEndpoints.notices);

    const [noteTitle, setNoteTitle] = useState(title);
    const [noteDescription, setNoteDescription] = useState(description);
    const [noteTags, setNoteTags] = useState(tags);
    const [hasErrors, setHasErrors] = useState(false);

    const currentDirectoryNotices = noticesData?.filter(({directoryId}) => directoryId === Number(queryId.slice(-1)));

    const isTitleNotUnique = isNoticeTitleNotUnique(currentDirectoryNotices, id, noteTitle);

    const allNoticesTags = useMemo(() => {
        if (noticesData.length) {
            return noticesData.map(({tags}) => tags).flat(Infinity)
        }
    }, [noticesData]);

    //TODO: add submitting on enter an closing on escape

    const onInputChangeHandler = (value) => {
        setNoteTitle(value);

        if (isTitleNotUnique) {
            setHasErrors(false);
        }
    }

    const onSaveClickHandler = () => {
        if (isTitleNotUnique) {
            setHasErrors(true);
            return;
        }

        setHasErrors(false);

        const note = {
            title: title === noteTitle.trim() || noteTitle.trim() === "" ? title : noteTitle.trim(),
            description: description === noteDescription.trim() || noteDescription.trim() === "" ? description : noteDescription,
            tags: noteTags,
            id,
            ...rest
        };

        onSave(note);
        setShowModal(false);
    }

    const modalContent = (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div
                        className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div
                            className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                            <h2 className="text-3xl font-semibold">
                                Manager
                            </h2>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setShowModal(false)}
                            >
                            </button>
                        </div>
                        <div className="relative p-6 flex-auto">
                            <div className="mb-5">
                                <h3>Title</h3>
                                <InputField
                                    name="noteName"
                                    value={noteTitle}
                                    onChange={onInputChangeHandler}
                                    hasErrors={hasErrors}
                                    errorText="The note with this name is already taken."/>
                            </div>
                            <div className="mb-5">
                                <h3>Description</h3>
                                <textarea
                                    rows={4}
                                    cols={40}
                                    name="noteDescription"
                                    id="noteDescription"
                                    placeholder="Note description"
                                    className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                                    value={noteDescription}
                                    onChange={(event) => setNoteDescription(event.target.value)}
                                />
                            </div>
                            <div className="mb-5">
                                <h3>Tags</h3>
                                <CreatableSelect
                                    isMulti
                                    options={allNoticesTags}
                                    onChange={(options) => setNoteTags(options)}
                                    value={noteTags}
                                />
                            </div>
                        </div>
                        <div
                            className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={onSaveClickHandler}
                                disabled={hasErrors}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={() => setShowModal(false)}></div>
        </>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root")
    );
};

export default NoticeModal