import Login, {Logout} from "./components/login/Login";
import Signup from "./components/signup/signup";
import Home from "./components/home/Home";
import {default as CreateDatabaseMigration} from "./components/migrations/CreateMigration";
import {default as CreateFileMigration} from "./components/fileMigration/CreateFileMigration";
import MetaDataProfiling from "./components/migrations/MetaDataProfiling";
import MigrationStatus from "./components/migrations/MigrationStatus";
import MigrationPostValidation from "./components/migrations/MigrationPostValidation";
import ListMigrations from "./components/migrations/ListMigrations";
import UserPermission from "./components/migrations/forms/UserPermission";
import Validation from "./components/validation/Validation";
import Authentication from "./components/auth/auth";
import Viewusers from "./components/auth/viewusers";
import Updateuser from "./components/auth/updateuser";
import Lostpswd from "./components/auth/lostpswd";
import DataProfiling from "./components/dataprofiling/DataProfiling";
import ViewMigration from "./components/migrations/ViewMigration";
import MigrationError from "./components/migrations/MigrationError";
import MigrationErrorDetail from "./components/migrations/MigrationErrorDetail";
import CreateConnection from "./components/connections/CreateConnection";
import EditConnection from "./components/connections/EditConnection";
import ViewConnection from "./components/connections/ViewConnection";
import Error404 from "./components/errorpage/404";
import Error500 from "./components/errorpage/500";
import PostValidation from "./components/postValidation/PostValidation";
import ValidationReport from "./components/postValidation/ValidationReport";
import HashDetails from "./components/validation/HashDetails";
import React from "react";


export const routes = {
    "/login": () => <Login/>,
    "/logout": () => Logout(),
    "/signup": () => <Signup/>,
    "/": () => <Home/>,
    "/migration/configure/database": () => <CreateDatabaseMigration/>,
    "/migration/configure/file": () => <CreateFileMigration/>,
    "/migration/metadataprofiling": () => <MetaDataProfiling/>,
    "/migration/status": () => <MigrationStatus/>,
    "/migration/validation": () => <MigrationPostValidation/>,
    "/migrations": () => <ListMigrations/>,
    "/userpermission/:id": ({id}) => <UserPermission id={id}/>,
    "/:id/validation": ({id}) => <Validation id={id}/>,
    "/auth": () => <Authentication/>,
    "/view": () => <Viewusers/>,
    "/editusers/:id": ({id}) => <Updateuser id={id}/>,
    "/lostpswd": () => <Lostpswd/>,
    "/:id/dataprofiling" : ({id}) => <DataProfiling id={id}/>,
    "/:id/:type/viewdetails" : ({id,type}) => <ViewMigration id={id} type={type}/>,
    "/:id/errors" : ({id}) => <MigrationError id={id}/>,
    "/:migid/:errorid/error_detail": ({migid , errorid}) => <MigrationErrorDetail mig_id={migid} error_id={errorid}/>,
    "/createconnections" : ()=> <CreateConnection />,
    "/editconnections/:id" : ({id}) => <EditConnection id={id}/>,
    "/viewconnections": () => <ViewConnection />,
    "/Error404":()=> <Error404 />,
    "/Error500":()=> <Error500 />,
    "/:id/ValidationDetails" : ({id}) => <PostValidation id={id}/>,
    "/validationreport/:id": ({id}) => <ValidationReport id={id}/>,
     "/hashdetails": () => <HashDetails/>

};

export default routes;
