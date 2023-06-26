const TABLE = {
    ID: "Primary key for table which is Unique and Type is UUID",
    USERS: {
        TABLE: "Table for storing users like admin,user or superadmin of companies or warehouses",
        FIRSTNAME: "Firstname of the user like 'John'",
        LASTNAME: "Lastname of the user like 'Smith'",
        EMAIL: "Email Id  of the user",
        PASSWORD: "Password of the user in encrypted form using bcrypt module",
        LANGUAGE: "Language of the user like 'english or dutch' etc",
        ROLE_ID: "Role Id from the roles table for different roles like admin,user and superAdmin"
    }
}

export default TABLE;