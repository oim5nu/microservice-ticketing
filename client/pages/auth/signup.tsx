import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '450px',
      display: 'block',
      margin: '0 auto',
    },
    textField: {
      '& > *': {
        width: '100%',
      },
    },
    submitButton: {
      marginTop: '24px',
    },
    title: { textAlign: 'center' },
    successMessage: { color: 'green' },
    errorMessage: { color: 'red' },
  })
);

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormStatus {
  message: string;
  type: string;
}

interface FormStatusProps {
  [key: string]: FormStatus;
}

const formStatusProps: FormStatusProps = {
  success: {
    message: 'Signed up successfully.',
    type: 'success',
  },
  duplicate: {
    message: 'Email-id already exist. Please use different email-id.',
    type: 'error',
  },
  error: {
    message: 'Something went wrong. Please try again.',
    type: 'error',
  },
};

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Please enter invalid email').required('Required'),
  password: Yup.string()
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{4,20}\S$/)
    .required('Required'),
  confirmPassword: Yup.string()
    .required('Required')
    .test(
      'password-match',
      'Password must match',
      function (value) {
        return this.parent.password === value
      }
    )
});

const SignUp: React.FC<{}> = () => {
  const classes = useStyles();
  const [displayFormStatus, setDisplayFormStatus] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>({
    message: '',
    type: '',
  });

  const createNewUser = async (data: FormValues, resetForm: Function) => {
    try {
      // API call integration will be here. Handle success / error response accordingly.
      if (data) {
        setFormStatus(formStatusProps.success);
        resetForm({});
      }
    } catch (error) {
      const response = error.response;
      if (response.data === 'user already exist' && response.status === 400) {
        setFormStatus(formStatusProps.duplicate);
      } else {
        setFormStatus(formStatusProps.error);
      }
    } finally {
      setDisplayFormStatus(true);
    }
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={(values: FormValues, actions: FormikHelpers<FormValues>) => {
          createNewUser(values, actions.resetForm);
          setTimeout(() => {
            console.log(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 500);
        }}
      >
        {(props: FormikProps<FormValues>) => {

          const { values, touched, errors, handleBlur, handleChange, isSubmitting } = props;
          
          return (
            <Form>
              <h1 className={classes.title}>Sign Up</h1>
              <Grid
                container
                justify="space-around"
                direction="row"
              >
                <Grid className={classes.textField} item lg={10} md={10} sm={10} xs={10} > 
                  <TextField
                    id="email"
                    name="email"
                    type="text"
                    value={values.email}
                    label="Email"
                    error={touched.email && errors.email ? true : false }
                    helperText={touched.email && errors.email ? errors.email : null }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid className={classes.textField} item lg={10} md={10} sm={10} xs={10} >
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={values.password}
                    error={touched.password && errors.password ? true : false }
                    helperText={
                      touched.password && errors.password ? 
                      'Please enter valid password. One uppercase, one lowercase, one special character and no spaces' : 
                      null
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid className={classes.textField} item lg={10} md={10} sm={10} xs={10} >
                  <TextField
                      name="confirmPassword"
                      id="confirmPassword"
                      label="Confirm password"
                      value={values.confirmPassword}
                      type="password"
                      helperText={
                          errors.confirmPassword &&
                          touched.confirmPassword
                              ? errors.confirmPassword
                              : 'Re-enter password to confirm'
                      }
                      error={
                          errors.confirmPassword &&
                          touched.confirmPassword
                              ? true
                              : false
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                  />
                </Grid>                
                <Grid className={classes.submitButton} item lg={10} md={10} sm={10} xs={10} >
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} >
                    Sign Up
                  </Button>
                  {displayFormStatus && (
                    <div className="formStatus">
                      {formStatus.type === 'error' ? (
                        <p
                          className={
                            classes.errorMessage
                          }
                        >
                          {formStatus.message}
                        </p>
                      ) : formStatus.type === 'success' ? (
                        <p 
                          className={
                            classes.successMessage
                          }
                        >
                          {formStatus.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                </Grid>
              </Grid>
            </Form>
        )}}
      </Formik>
    </div>
  );
}

export default SignUp;