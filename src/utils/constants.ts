export const DEFAULT_DIRECTORY_ID = 1;

export const ERROR_MESSAGES_CATALOG = {
    NOTE: {
        EMPTY_TITLE: "You can't save note with an empty title",
        TITLE_HAS_DUPLICATES: "Note with same name has been already created in this directory",
        EMPTY_DESCRIPTION: "You can't save note with an empty description",
    },
    DIRECTORY: {
        EMPTY_TITLE: "You can't save empty directory name",
        TITLE_HAS_DUPLICATES: "Directory with same name has been already created",
        ROOT_DELETE: "You can't remove root directory",
        IS_NOT_EMPTY: "The directory has content inside. Only empty directories can be removed."
    }
};