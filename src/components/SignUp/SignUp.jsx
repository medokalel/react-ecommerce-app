import React, { useContext, useState } from 'react'
import styles from '../Auth/Auth.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup'
import { userContext } from '../../Context/userContext';
import { API_BASE, getErrorMessage } from '../../utils/auth';

export default function SignUp() {

  let {setLogin} = useContext(userContext);
  let navigate = useNavigate();
  let [apiError ,setError] = useState('');

  async function handleRegister(formData){ 

    setError('');
    try {
      const response = await axios.post(`${API_BASE}/auth/signup`, formData);
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
    name: Yup.string().required('name is required'),
    email: Yup.string().required('email is required').email('@ is required'),
    phone: Yup.string().required('phone is required').matches(/^01[0125][0-9]{8}$/,'phone is not valid'),
    password: Yup.string().required('password is required').min(6,'password must be at least 6 characters'),
    rePassword: Yup.string().required('please confirm your password').oneOf([Yup.ref('password')],'passwords do not match'),
  })

  let formik = useFormik({
    initialValues:{
      name:'',
      email:'',
      password:'',
      rePassword:'',
      phone:'',
    },
    validationSchema:validation,
    onSubmit:handleRegister
  })

  return (
    <>
      <div className={styles.rightSideContent}>
        <div className={styles.rightSideHeader}>
          <h2>FashionStore</h2>
          <span>Create an account to get started.</span>
        </div>
        <div className={styles.form}>
          <form action="" onSubmit={formik.handleSubmit}>
            {
              apiError?
                <div className='text-danger bg-danger-subtle p-3 rounded-2 mb-3'>
                  {apiError}
                </div>:null
            }
            <div className={styles.inputs}>
              <label htmlFor="name">Full Name</label>
              <span><i className="fa-solid fa-user"></i></span>
              <input id='name' className={`form-control ${formik.touched.name && formik.errors.name?'is-invalid':''}`} onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" name='name' value={formik.values.name} placeholder='Enter your full name' />
              {
                formik.touched.name && formik.errors.name ?(
                  <div className={`text-danger ${styles.error}`}>{formik.errors.name}</div>
                ):null
              }
            </div>
            <div className={styles.inputs}>
              <label htmlFor="email">Email Address</label>
              <span><i className="fa-regular fa-envelope"></i></span>
              <input id='email' className={`form-control ${formik.touched.email && formik.errors.email?'is-invalid':''}`} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" name='email' value={formik.values.email} placeholder='Enter your email' />
              {
                formik.touched.email && formik.errors.email ?(
                  <div className={`text-danger ${styles.error}`}>{formik.errors.email}</div>
                ):null
              }
            </div>
            <div className={styles.inputs}>
              <label htmlFor="phone">Phone Number</label>
              <span><i className="fa-solid fa-phone"></i></span>
              <input id='phone' className={`form-control ${formik.touched.phone && formik.errors.phone?'is-invalid':''}`} onChange={formik.handleChange} onBlur={formik.handleBlur} type="tel" name='phone' value={formik.values.phone} placeholder='01xxxxxxxxx' />
              {
                formik.touched.phone && formik.errors.phone ?(
                  <div className={`text-danger ${styles.error}`}>{formik.errors.phone}</div>
                ):null
              }
            </div>
            <div className={styles.inputs}>
              <label htmlFor="password">Password</label>
              <span><i className="fa-solid fa-lock"></i></span>
              <input id='password' className={`form-control ${formik.touched.password && formik.errors.password?'is-invalid':''}`} onChange={formik.handleChange} onBlur={formik.handleBlur} type="password" name='password' value={formik.values.password} placeholder='Enter your password' />
              {
                formik.touched.password && formik.errors.password ?(
                  <div className={`text-danger ${styles.error}`}>{formik.errors.password}</div>
                ):null
              }
            </div>
            <div className={styles.inputs}>
              <label htmlFor="repassword">Confirm Password</label>
              <span><i className="fa-solid fa-lock"></i></span>
              <input id='repassword' className={`form-control ${formik.touched.rePassword && formik.errors.rePassword?'is-invalid':''}`} onChange={formik.handleChange} onBlur={formik.handleBlur} type="password" name='rePassword' value={formik.values.rePassword} placeholder='confirm your password' />
              {
                formik.touched.rePassword && formik.errors.rePassword ?(
                  <div className={`text-danger ${styles.error}`}>{formik.errors.rePassword}</div>
                ):null
              }
            </div>
            <div>
              <button type='submit' disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Creating account…' : 'Create Account'}</button>
            </div>
          </form>
        </div>
        <div className={styles.signUp}>
          <span>Already have an account?<Link to={'/auth/login'}> Login</Link></span>
        </div>
      </div>
    </>
  )
}
