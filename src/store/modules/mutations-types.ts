

export enum MutationTypes {
    //                      SIDEBAR
    IS_BLOCK_SIDEBAR = 'IS_BLOCK_SIDEBAR',
    EDIT_CONSTRUCTOR_FORM = 'EDIT_CONSTRUCTOR_FORM',
    //                      AUTH_REDUCER
    SET_USER_CREDENTIALS = 'SET_USER_CREDENTIALS',
    SET_CURRENT_BOT      = 'SET_CURRENT_BOT',
    SET_USER_INITIAL_CREDENTIALS = 'SET_USER_INITIAL_CREDENTIALS',

    //                      APP
    INITIALIZE = 'INITIALIZE',
    SET_EJECT_AXIOS = 'SET_EJECT_AXIOS',
    SET_IS_EXPAND_SIDEBAR = 'SET_IS_EXPAND_SIDEBAR',
    SET_CURRENT_LAYOUT = 'SET_CURRENT_LAYOUT',

    //                      BOTS
    SET_BOTS_LIST = 'SET_BOTS_LIST',
    SET_BOT_START_MESSAGE_OR_ERROR='SET_BOT_START_MESSAGE_OR_ERROR',
    SET_ACTIVE_BOTS='SET_ACTIVE_BOTS',
    APPEND_ACTIVE_BOT='APPEND_ACTIVE_BOT',
    REMOVE_ACTIVE_BOT='REMOVE_ACTIVE_BOT',
    APPEND_CREATED_BOT='APPEND_CREATED_BOT',
    REMOVE_BOT_FROM_LIST='REMOVE_BOT_FROM_LIST',

    //                      Messages
    SET_CURRENT_MESSAGE='SET_CURRENT_MESSAGE',
    SET_NEW_MESSAGE='SET_NEW_MESSAGE',
    RESET_CURRENT_MESSAGE='RESET_CURRENT_MESSAGE',

    UPDATE_CONSTRUCTOR='UPDATE_CONSTRUCTOR',
    DELETE_CONSTRUCTOR='DELETE_CONSTRUCTOR',
    //                      LIST
    EDIT_CONSTRUCTOR_LIST='EDIT_CONSTRUCTOR_LIST',
    SET_CONSTRUCTOR_COORDINATE='SET_CONSTRUCTOR_COORDINATE',
    SET_INITIAL_CONSTRUCTOR_LIST='SET_INITIAL_CONSTRUCTOR_LIST',

    //                      OPTION
    SET_NEW_OPTION_NAME='SET_NEW_OPTION_NAME',
    RESET_TEMP_OPTIONS_LIST='RESET_TEMP_OPTIONS_LIST',
    DELETE_OPTION='DELETE_OPTION',

    //                      LINK LAYER
    ATTACH_COMPUTED_PATH_POSITION='ATTACH_COMPUTED_PATH_POSITION',
    UPDATE_OPTION='UPDATE_OPTION',
    CHANGE_CURRENT_LINK='CHANGE_CURRENT_LINK',

    // RESET
    RESET_STATE='RESET_STATE',


    //                      COMMAND
    APPEND_COMMAND='APPEND_COMMAND',
    DELETE_COMMAND='DELETE_COMMAND',
    SET_COMMAND_LIST='SET_COMMAND_LIST',
    SET_CURRENT_COMMAND='SET_CURRENT_COMMAND',
    UPDATE_COMMAND='UPDATE_COMMAND',

    //                      DARK MODE
    SET_DARK_MODE='SET_DARK_MODE',


    //                      TEST
    SET_TEST_CONSTRUCTOR_LIST='SET_TEST_CONSTRUCTOR_LIST',
    APPEND_TEST_CONSTRUCTOR_LIST='APPEND_TEST_CONSTRUCTOR_LIST'
}