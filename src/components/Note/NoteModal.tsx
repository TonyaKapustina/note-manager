import React, {FC, useEffect, useMemo} from "react";
import ReactDOM from "react-dom";
import {NoteTagType, NoteType} from "../../interfaces/note";
import CreatableSelect from "react-select/creatable";
import {ERROR_MESSAGES_CATALOG} from "../../utils/constants";
import {useNotesData} from "../../hooks/useNotesData";
import {Controller, SubmitHandler, useForm} from "react-hook-form";

type NoteModalPropsType = {
    setShowModal: (value: boolean) => void,
    onSave: (notice: NoteType) => Promise<void>,
    note?: NoteType,
}

interface IFormModal {
    noteName: string,
    noteDescription: string,
    noteTags: NoteTagType[]
}

export const NoteModal: FC<NoteModalPropsType> = ({
                                                      setShowModal,
                                                      onSave,
                                                      note,
                                                  }) => {
    const {
        title = '',
        description = '',
        tags = [],
        ...rest
    } = note || {};
    const isEditMode = note?.title;
    const modalTitle = isEditMode ? `Edit "${title}"` : 'Add new note';

    const {notesData, openDirectoryNotes} = useNotesData();
    const {register, handleSubmit, control, formState: {errors}} = useForm<IFormModal>({
        defaultValues: {
            noteName: title,
            noteDescription: description,
            noteTags: tags
        }
    })

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                setShowModal(false);
            }
        };

        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, [setShowModal])

    const allNoticesTags = useMemo(() => {
        if (notesData?.length) {
            return notesData.map(({tags}) => tags).flat(Infinity);
        }
    }, [notesData]);

    const onSubmit: SubmitHandler<IFormModal> = (data) => {
        const {noteName, noteDescription, noteTags} = data;
        const note = {
            title: noteName.trim(),
            description: noteDescription.trim(),
            tags: noteTags,
            ...rest
        };

        // @ts-ignore
        onSave(note);
        setShowModal(false);
    }

    console.log(errors);

    const modalContent = (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative max-w-[1045px] w-full p-5">
                    <form onSubmit={handleSubmit(onSubmit)}
                          className="border-0 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-10">
                        <div
                            className="flex items-start pb-8">
                            <h2 className="text-2xl font-semibold">
                                {modalTitle}
                            </h2>
                        </div>
                        <div className="relative flex gap-x-4">
                            <div className="w-1/3">
                                <div className='mb-6'>
                                    <label htmlFor="noteName" className="form-control-label">Note Title</label>
                                    <input
                                        {...register("noteName", {
                                            validate: {
                                                isEmpty: value => {
                                                    if (value.trim() === '') {
                                                        return ERROR_MESSAGES_CATALOG.NOTE.EMPTY_TITLE
                                                    }
                                                },
                                                hasDuplicates: value => {
                                                    if (isEditMode && value === title) {
                                                        return
                                                    }
                                                    const hasDuplicates = openDirectoryNotes.some(({title}) => title.toLowerCase() === value.trim().toLowerCase());
                                                    if (hasDuplicates) {
                                                        return ERROR_MESSAGES_CATALOG.NOTE.TITLE_HAS_DUPLICATES
                                                    }
                                                }
                                            }
                                        })}
                                        placeholder="Add a title here"
                                        id="noteName"
                                        className={`form-control ${errors.noteName?.message && 'border-red-500'}`}
                                    />
                                    {
                                        errors.noteName?.message && (
                                            <small className="font-normal leading-normal mt-0 mb-4 text-red-800">
                                                {errors.noteName?.message}
                                            </small>
                                        )
                                    }
                                </div>
                                <div>
                                    <label className="form-control-label">Tags</label>
                                    <Controller
                                        name="noteTags"
                                        control={control}
                                        render={({field}) => {
                                            return (
                                                <CreatableSelect
                                                    isMulti
                                                    // @ts-ignore
                                                    options={allNoticesTags}
                                                    value={field.value}
                                                    className="form-select"
                                                    {...field}
                                                />
                                            )
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="w-2/3">
                                <label htmlFor="noteDescription" className="form-control-label">Note body text</label>
                                <textarea
                                    rows={4}
                                    cols={40}
                                    name="noteDescription"
                                    id="noteDescription"
                                    placeholder="Add you note description here"
                                    className="form-control"
                                    {...register("noteDescription")}
                                />
                            </div>
                        </div>
                        <div
                            className="flex items-center justify-end pt-8">
                            <button
                                className="form-button"
                                type="reset"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="form-button"
                                type="submit"
                                disabled={Boolean(Object.keys(errors).length)}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={() => setShowModal(false)}></div>
        </>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root") ?? document.body
    );
};