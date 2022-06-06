import React from "react";
import {Field, Form, Formik} from "formik";

function Vusername(value) {
    let error;

    if (value === "admin") {
        error = "Nice try!";
    }

    return error;

    const Example = () => {
        const onSubmit = values => {
            console.log(values);
        };

        return (
            <Formik
                initialValues={{
                    username: "",
                    email: ""
                }}
                onSubmit={onSubmit}
            >
                {({errors, touched}) => (
                    <Form>
                        <Field name="username" validate={Vusername}/>
                        {errors.username && touched.username && errors.username}

                        <button type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        );
    };
}

return;
(
    <div>Here comes JSX !</div>
);
export default Vusername;