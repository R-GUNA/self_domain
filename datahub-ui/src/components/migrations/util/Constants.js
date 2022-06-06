import {EXTERNAL_AWS_TYPE, EXTERNAL_AZURE_TYPE, EXTERNAL_GCP_TYPE} from "../../utils/Constants";
import {aws_submit, azure_submit, gcp_submit} from "./ExtSubmit";

export let submit_stage_ext = {
    [EXTERNAL_AWS_TYPE]: aws_submit,
    [EXTERNAL_GCP_TYPE]: gcp_submit,
    [EXTERNAL_AZURE_TYPE]: azure_submit
};

export let DATABASE_MIGRATION = "DB";
export let FILE_MIGRATION = "FL";