import React from 'react';

function Connections() {
    return (
        <div
            className="right_col"
            role="main"
            style={{
                minHeight: 1826
            }}
        >
            <div className>
                <div className="clearfix"/>
                <div className="row">
                    <div className="col-md-12 col-sm-12 ">
                        <div className="x_panel">
                            <div className="x_title">
                                <h2>Form Design
                                    <small>different form elements</small>
                                </h2>
                                <div className="clearfix"/>
                            </div>
                            <div className="x_content">
                                <br/>
                                <form
                                    id="demo-form2"
                                    data-parsley-validate
                                    className="form-horizontal form-label-left"
                                    noValidate>
                                    <div className="item form-group">
                                        <label
                                            className="col-form-label col-md-3 col-sm-3 label-align"
                                            htmlFor="first-name">First Name
                                            <span className="required">*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                type="text"
                                                id="first-name"
                                                required="required"
                                                className="form-control "/>
                                        </div>
                                    </div>
                                    <div className="item form-group">
                                        <label
                                            className="col-form-label col-md-3 col-sm-3 label-align"
                                            htmlFor="last-name">Last Name
                                            <span className="required">*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                type="text"
                                                id="last-name"
                                                name="last-name"
                                                required="required"
                                                className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="item form-group">
                                        <label
                                            htmlFor="middle-name"
                                            className="col-form-label col-md-3 col-sm-3 label-align">Middle Name /
                                            Initial</label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                id="middle-name"
                                                className="form-control"
                                                type="text"
                                                name="middle-name"/>
                                        </div>
                                    </div>
                                    <div className="item form-group">
                                        <label className="col-form-label col-md-3 col-sm-3 label-align">Gender</label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <div id="gender" className="btn-group" data-toggle="buttons">
                                                <label
                                                    className="btn btn-secondary"
                                                    data-toggle-class="btn-primary"
                                                    data-toggle-passive-class="btn-default">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        defaultValue="male"
                                                        className="join-btn"
                                                        data-parsley-multiple="gender"/>
                                                    &nbsp; Male &nbsp;
                                                </label>
                                                <label
                                                    className="btn btn-primary"
                                                    data-toggle-class="btn-primary"
                                                    data-toggle-passive-class="btn-default">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        defaultValue="female"
                                                        className="join-btn"
                                                        data-parsley-multiple="gender"/>
                                                    Female
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item form-group">
                                        <label className="col-form-label col-md-3 col-sm-3 label-align">Date Of Birth
                                            <span className="required">*</span>
                                        </label>
                                        <div className="col-md-6 col-sm-6 ">
                                            <input
                                                id="birthday"
                                                className="date-picker form-control"
                                                required="required"
                                                type="text"/>
                                        </div>
                                    </div>
                                    <div className="ln_solid"/>
                                    <div className="item form-group">
                                        <div className="col-md-6 col-sm-6 offset-md-3">
                                            <button className="btn btn-primary" type="button">Cancel</button>
                                            <button className="btn btn-primary" type="reset">Reset</button>
                                            <button type="submit" className="btn btn-success">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Connections;