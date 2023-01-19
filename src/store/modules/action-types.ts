

export enum ActionTypes {
    //                      APP
    INITIALIZE_APP       = 'INITIALIZE_APP',
    EJECT_INSTANSE_AXIOS = 'EJECT_INSTANSE_AXIOS',
    


    //                      AUTH_REDUCER
    LOGIN = 'LOGIN',
    INITIALIZE_USER      = 'INITIALIZE_USER',
    REGISTRATION = 'REGISTRATION',

    //                      BOTS
    GET_BOTS_LIST = 'GET_BOTS_LIST',
    CREATE_BOT = 'CREATE_BOT',
    GENERATE_BOT_FILES='GENERATE_BOT_FILES',
    BOT_TOGGLER='BOT_TOGGLER',
    UPDATE_BOT='UPDATE_BOT',

    //                      MESSAGES
    GET_MESSAGE_LIST='GET_MESSAGE_LIST',
    CREATE_MESSAGE='CREATE_MESSAGE',
    UPDATE_CONSTRUCTOR='UPDATE_CONSTRUCTOR',
    DELETE_CONSTRUCTOR='DELETE_CONSTRUCTOR',
    FIND_CURRENT_CONSTRUCTOR='FIND_CURRENT_CONSTRUCTOR',

    //                      OPTIONS
    CREATE_NEW_OPTION='CREATE_NEW_OPTION',
    GET_OPTION_LIST='GET_OPTION_LIST',
    DELETE_OPTION='DELETE_OPTION',
    UPDATE_OPTION='UPDATE_OPTION',


    //                      COMMAND
    CREATE_COMMAND='CREATE_COMMAND',
    DELETE_COMMAND='DELETE_COMMAND',
    GET_LIST_COMMAND='GET_LIST_COMMAND',
    UPDATE_COMMAND='UPDATE_COMMAND'
}