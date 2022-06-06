import React from "react";

export let AzureForm = (props) => {
    let url_help_tip = "URL should be azure://<account name>.blob.windows.net/<container name>/path/to/folder";
    return (
        <form className="form-horizontal">


            <div className="row">
                <div className="form-group col-sm-10">
                    <input type="url" id="url" onChange={event => props.setParentState({
                        ...props.parentState,
                        "azure_url": event.target.value
                    })}
                           defaultValue={props.parentState.azure_url} className="form-control form-control-sm"
                           placeholder="Enter URL"/>
                </div>
                <i data-placement="right" data-toggle="tooltip" title={url_help_tip}
                   className="fa fa-question-circle"/>

                <div className="form-group col-sm-10">
                    <input type="url" id="token" onChange={event => props.setParentState({
                        ...props.parentState,
                        "azure_sas": event.target.value
                    })}
                           defaultValue={props.parentState.azure_sas} className="form-control form-control-sm"
                           placeholder="Enter Azure SAS Token"/>
                </div>
                <i data-placement="right" data-toggle="tooltip" title="Example: ?sv=2015-07-08&sr=b&sig=3 9Up9JZHkxhUINFEJEH959 4DJxe7 w6clRCZOVGICGSO%3D&se=2016-10-18T2 1%3A51%3A37Z&sp=rcw"
                className="fa fa-question-circle" aria-hidden="true"/>

            </div>
        </form>
    )
};