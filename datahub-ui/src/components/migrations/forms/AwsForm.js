import React from "react";

export let AwsForm = (props) => {
    const setForm = (event, type) => {
        props.setParentState({...props.parentState, [type]: event.target.value})
    };
    return (
        <form className="form-horizontal">

            <div  className="row">
                <div className="form-group col-sm-10" >
                    <input type="url" id="url" className="form-control form-control-sm"
                           onChange={(event => {
                               setForm(event, "aws_url")
                           })} defaultValue={props.parentState.aws_url}
                           placeholder="Enter S3 Bucket URL"/>


                </div>
                <i data-placement="right" data-toggle="tooltip" title="Format: s3://amazonaws.com/[bucket_name]/"
                   className="fa fa-question-circle"/>
                <div className="form-group col-sm-10">

                        <input type="text" className="form-control form-control-sm"
                               onChange={(event => {
                                   setForm(event, "aws_id")
                               })}
                               defaultValue={props.parentState.aws_id} placeholder="AWS ID"/>

                </div>
                <i data-placement="right" data-toggle="tooltip" title="An AWS account ID is a 12-digit number, such as 123456789012, that is used to construct Amazon Resource Names (ARNs)."
                   className="fa fa-question-circle"/>
                <div className="form-group col-sm-10">

                        <input type="text" className="form-control form-control-sm"
                               onChange={(event => {
                                   setForm(event, "aws_secret")
                               })}
                               defaultValue={props.parentState.aws_secret} placeholder="AWS SECRET KEY"/>

                </div>
                <i data-placement="right" data-toggle="tooltip" title="Secret Keys are used to sign the requests, like the Username/Password pair you use to access your AWS account"
                   className="fa fa-question-circle"/>
            </div>

        </form>
    )
};