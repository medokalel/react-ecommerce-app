import React, { useContext, useState } from 'react';
import styles from '../Auth/Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { userContext } from '../../Context/userContext';
import { API_BASE, getErrorMessage } from '../../utils/auth';

export default function Login() {
  let {setLogin} = useContext(userContext);
  let navigate = useNavigate();
  let [ApiError ,setError] = useState('');

  async function handleLogin(formData){ 

    setError('');
    try {
      const response = await axios.post(`${API_BASE}/auth/signin`, formData);
      if (response.data.message === 'success') {
        localStorage.setItem('userToken', response.data.token);
        setLogin(response.data.token);
        navigate('/');
      }
    } catch (error) {
      setError(getErrorMessage(error));
    }

  }
  let validation = Yup.object({
    email: Yup.string().required('email is required').email('@ is required'),
    password: Yup.string().required('password is required'),
  })

  let formik = useFormik({
    initialValues:{
      email:'',
      password:'',
    },
    validationSchema:validation,
    onSubmit:handleLogin,
  })

  return (
    <>
      <div className={styles.rightSideContent}>
        <div className={styles.rightSideHeader}>
          <h2>FashionStore</h2>
          <span>Welcome back! Please login to your account.</span>
        </div>
        <div className={styles.form}>
          <form action="" onSubmit={formik.handleSubmit}>
            {ApiError ? <div className="alert alert-danger py-2" role="alert">{ApiError}</div> : null}
            <div className={styles.inputs}>
              <label htmlFor="email">Email Address</label>
              <span><i className="fa-regular fa-envelope"></i></span>
              <input className={`form-control ${formik.touched.email && formik.errors.email?'is-invalid':''}`} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} name='email' id='email' type="email" placeholder='Enter your email' />
              {
                formik.touched.email && formik.errors.email ?(
                  <div className={`text-danger ${styles.error}`}>{formik.errors.email}</div>
                ):null
              }
            </div>
            <div className={styles.inputs}>
              <label htmlFor="password">Password</label>
              <span><i className="fa-solid fa-lock"></i></span>
              <input className={`form-control ${formik.touched.password && formik.errors.password?'is-invalid':''}`} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} name='password' id='password' type="password" placeholder='Enter your password' />
              {
                formik.touched.password && formik.errors.password ?(
                  <div className={`text-danger ${styles.error}`}>{formik.errors.password}</div>
                ):null
              }
            </div>
            <div>
              <button type='submit' disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Signing in…' : 'Login'}</button>
            </div>
          </form>
        </div>
        <div className={styles.signUp}>
          <span>Don't have an account?<Link to={'/auth/signup'}> sign up</Link></span>
        </div>
      </div>
    </>
  )
}
