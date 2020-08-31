import React, { useState, useCallback, useEffect } from 'react';
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
import axios from 'axios';
import router from 'next/router';
import { FormStatus, FormStatusProps } from '../../common/common-types';
import useIsMountedRef from '../../hooks/use-is-mounted-ref';
import useRequest from '../../hooks/use-request';

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
    .test('password-match', 'Password must match', function (value) {
      return this.parent.password === value;
    }),
});

const SignUp: React.FC<{}> = () => {
  const classes = useStyles();
  const [displayFormStatus, setDisplayFormStatus] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>({
    message: '',
    type: '',
  });

  const isMountedRef = useIsMountedRef();

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      // API call integration will be here. Handle success / error response accordingly.
      const response = await axios.post('/api/users/signup', values);
      console.log('response.data', response.data);
      if (response.data) {
        if (isMountedRef.current) {
          console.log('signup form is mounted');
          setFormStatus(formStatusProps.success);
          actions.resetForm({});
          setTimeout(() => {
            console.log(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 500);
          setTimeout(() => {
            console.log('redirecting to root');
            router.push('/');
          }, 1000);
        } else {
          console.log('signup form is unmounted');
          router.push('/');
        }
      }
    } catch (error) {
      console.log('error.response', error.response);
      const errorResponse = error.response;

      if (
        errorResponse.data.errors[0].message === 'Email in use' &&
        errorResponse.status === 400
      ) {
        setFormStatus(formStatusProps.duplicate);
      } else {
        setFormStatus(formStatusProps.error);
      }
    } finally {
      setDisplayFormStatus(true);
    }
  };

  // const doSignUpRequest = async (data: FormValues, resetForm: Function) => {
  //   try {
  //     // API call integration will be here. Handle success / error response accordingly.
  //     const response = await axios.post('/api/users/signup', data);
  //     console.log(response.data);
  //     if (response.data) {
  //       setFormStatus(formStatusProps.success);
  //       resetForm({});
  //       //router.push('/');
  //     }
  //   } catch (error) {
  //     console.log('error', error.response);
  //     const errorResponse = error.response;
  //     if (
  //       errorResponse.data.errors[0].message === 'Email in use' &&
  //       errorResponse.status === 400
  //     ) {
  //       setFormStatus(formStatusProps.duplicate);
  //     } else {
  //       setFormStatus(formStatusProps.error);
  //     }
  //   } finally {
  //     setDisplayFormStatus(true);
  //   }
  // };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<FormValues>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            isSubmitting,
          } = props;

          return (
            <Form>
              <h1 className={classes.title}>Sign Up</h1>
              <Grid container justify="space-around" direction="row">
                <Grid
                  className={classes.textField}
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                >
                  <TextField
                    id="email"
                    name="email"
                    type="text"
                    value={values.email}
                    label="Email"
                    error={touched.email && errors.email ? true : false}
                    helperText={
                      touched.email && errors.email ? errors.email : null
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  className={classes.textField}
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                >
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={values.password}
                    error={touched.password && errors.password ? true : false}
                    helperText={
                      touched.password && errors.password
                        ? 'Please enter valid password. One uppercase, one lowercase, one special character and no spaces'
                        : null
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  className={classes.textField}
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                >
                  <TextField
                    name="confirmPassword"
                    id="confirmPassword"
                    label="Confirm password"
                    value={values.confirmPassword}
                    type="password"
                    helperText={
                      errors.confirmPassword && touched.confirmPassword
                        ? errors.confirmPassword
                        : 'Re-enter password to confirm'
                    }
                    error={
                      errors.confirmPassword && touched.confirmPassword
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  className={classes.submitButton}
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Sign Up
                  </Button>
                  {displayFormStatus && (
                    <div className="formStatus">
                      {formStatus.type === 'error' ? (
                        <p className={classes.errorMessage}>
                          {formStatus.message}
                        </p>
                      ) : formStatus.type === 'success' ? (
                        <p className={classes.successMessage}>
                          {formStatus.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SignUp;
