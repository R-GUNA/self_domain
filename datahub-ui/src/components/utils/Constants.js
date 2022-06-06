export const RequestConfig = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const validations = {
    host: '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}',
    port: '^()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])$',
    Server: '^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\\-]*[A-Za-z0-9])$',
    connectionname: '^(?!\\s*$).+',
    username: '^(?!\\s*$).+',
    password: '^(?!\\s*$).+',
    email: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$',
    database: '^(?!\\s*$)'
};
export const MigrationTableStatusConstant = {
    0: "Structure Not Created",
    1: "Structure Created",
    2: "Files created",
    3: "Put File Done",
    4: "Data Migrated"
};

export const MigrationConst = {

  0: "Created",
  1: "Started",
  2: "Failed",
  3: "Partially Completed",
  4: "Completed"
};


export const StageStatus = {
    0: "Migration Created",
    1: "Migration Started",
    2: "Migration Failed",
    3: "Migration Partially Completed",
    4: "Migration Completed"
}

export const TableStatusConstant = {
    0: "Started",
    1: "Done"
};

export const IS_STAGE = "IS";
export const IS_EXT = "IE";
export const IS_DEF = "ID";

export const EXTERNAL_AWS_TYPE = "AWS";
export const EXTERNAL_GCP_TYPE = "GCP";
export const EXTERNAL_AZURE_TYPE = "AZURE";

export const DATABASE_MIGRATION = "DB"
export const FILE_MIGRATION = "FL"

export const FILEMIGRATIONTABLELOGSTATUS = {
    1: "Started",
    2: "Failed",
    3: "data Migrated"
}

export const VALIDATION_STATUS = {
    "1": "STARTED",
    "2": "FAILED",
    "3": "COMPLETED",
    "4": "COMPLETED WITH ERRORS"
}