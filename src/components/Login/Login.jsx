import React, { useContext, useState } from 'react';
import styles from '../Auth/Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { userContext } from '../../Context/userContext';

export default function Login() {
  let {setLogin} = useContext(userContext);
  let navigate = useNavigate();
  let [ApiError ,setError] = useState('');

  async function handleLogin(formData){ 

    await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin',formData)
      .then((response)=>{
        if(response.data.message =='success'){
          localStorage.setItem('userToken',response.data.token);
          setLogin(response.data.token);
          navigate('/')
        }
      })
      .catch((error)=>{
        setError(error.response.data.message)
      })

  }
  let validation = Yup.object({
    email: Yup.string().required('email is required').email('@ is required'),
    password: Yup.string().required('password is required').matches(/^[A-Za-z0-9@#*]{7,9}$/,'password is not valid'),
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
            <div className={styles.rf}>
              <div className={styles.remember}>
                <input type="checkbox" name="remember-me" id="remember"/>
                <label htmlFor="remember">Remember me</label>
              </div>
              <div className={styles.forget}>
                <Link to={''}>Forgot Password?</Link>
              </div>
            </div>
            <div>
              <button type='submit'>Login</button>
            </div>
          </form>
        </div>
        <div className={styles.divider}>
          <span>Or continue with</span>
        </div>
        <div className={styles.otherLogin}>
          <span><i className="fa-brands fa-google"></i></span>
          <span><i className="fa-brands fa-facebook"></i></span>
          <span><i className="fa-brands fa-apple"></i></span>
        </div>
        <div className={styles.signUp}>
          <span>Don't have an account?<Link to={'signup'}> sign up</Link></span>
        </div>
      </div>
    </>
  )
}
