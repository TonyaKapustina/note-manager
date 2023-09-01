export const DEFAULT_DIRECTORY_ID = 1;

export const ERROR_MESSAGES_CATALOG = {
    NOTE: {
        EMPTY_TITLE: "You can't save empty notice title",
        TITLE_HAS_DUPLICATES: "Notice with same name has been already created in this directory"
    },
    DIRECTORY: {
        EMPTY_TITLE: "You can't save empty directory name",
        TITLE_HAS_DUPLICATES: "Directory with same name has been already created",
        ROOT_DELETE: "You can't remove root directory",
        IS_NOT_EMPTY: "The directory has content inside. Only empty directories can be removed."
    }
};