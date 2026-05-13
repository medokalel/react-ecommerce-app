import React, { useContext, useState } from 'react'
import styles from '../Auth/Auth.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup'
import { userContext } from '../../Context/userContext';

export default function SignUp() {

  let {setLogin} = useContext(userContext);
  let navigate = useNavigate();
  let [apiError ,setError] = useState('');

  async function handleRegister(formData){ 

    await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup',formData)
      .then((response)=>{
        if(response.data.message =='success'){
          localStorage.setItem('userToken',response.data.token)
          setLogin(response.data.token);
          navigate('/');
        }
      })
      .catch((error)=>{
        setError(error.response.data.message)
      })

  }
  let validation = Yup.object({
    name: Yup.string().required('name is required'),
    email: Yup.string().required('email is required').email('@ is required'),
    phone: Yup.string().required('phone is required').matches(/^01[0125][0-9]{8}$/,'phone is not valid'),
    password: Yup.string().required('password is required').matches(/^[A-Za-z0-9@#*]{6,12}$/,'password is not valid'),
    rePassword: Yup.string().required('required').oneOf([Yup.ref('password')]),
  })

  let formik = useFormik({
    initialValues:{
      name:'',
      email:'',
      password:'',
      rePassword:'',
      phone:'01010700702',
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
              <button type='submit'>Create Account</button>
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
          <span>Already have an account?<Link to={'..'}> Login</Link></span>
        </div>
      </div>
    </>
  )
}
