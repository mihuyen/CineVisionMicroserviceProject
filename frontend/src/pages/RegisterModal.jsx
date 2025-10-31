import { Form, Formik } from 'formik';
import React from 'react'
import { useState } from 'react';
import { UserService } from '../services/userService'
import KaanKaplanTextInput from '../utils/customFormItems/KaanKaplanTextInput';
import { ToastContainer, toast } from 'react-toastify';

export default function RegisterModal() {

    const userService = new UserService();

    const registerCustomer = (values) => {

        if (values.password === values.passwordAgain) {

            let customer = {
                customerName: values.customerName,
                email: values.email,
                phone: values.phone,
                password: values.password
            };

            userService.addCustomer(customer).then(result => {
                if(result.status == 200) {
                    document.querySelector("#loginModalLink").click();
                    toast("Tài khoản của bạn đã được tạo thành công! Vui lòng đăng nhập.", {
                        theme:"colored",
                        position:"top-center"
                    })
                }
            })
        } else {
            toast.error("Mật khẩu không khớp nhau.", {
                theme: "colored",
                position: "top-center"
            });
        }
    }

  return (
    <div>
        <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header login-modal-header">
                    <h5 className="modal-title" id="registerModalLabel">Đăng Ký</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <Formik 
                    initialValues={{}}
                    onSubmit={(values) => {
                        registerCustomer(values);
                    }}>
                    <Form>
                        <div className="modal-body">
                            <div className="form-floating mb-3">
                                <KaanKaplanTextInput type="text" name="customerName" className="form-control" id="registerCustomerName" placeholder='Họ và tên' required/>
                                <label htmlFor="registerCustomerName">Họ và tên</label>
                            </div>
                            <div className="form-floating mb-3">
                                <KaanKaplanTextInput type="email" name="email" className="form-control" id="registerEmail" placeholder='Email' required />
                                <label htmlFor="registerEmail">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <KaanKaplanTextInput type="tel" name="phone" className="form-control" id="registerPhone" placeholder='Số điện thoại' pattern="[0]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" required />
                                <label htmlFor="registerPhone">Số điện thoại - 0 *** *** ** **</label>
                            </div>
                            <div className="form-floating mb-3">
                                <KaanKaplanTextInput type="password" name="password" className="form-control" id="registerPassword" placeholder='Mật khẩu' required/>
                                <label htmlFor="registerPassword">Mật khẩu</label>
                            </div>
                            <div className="form-floating mb-3">
                                <KaanKaplanTextInput type="password" name="passwordAgain" className="form-control" id="registerPasswordAgain" placeholder='Nhập lại mật khẩu' required/>
                                <label htmlFor="registerPasswordAgain">Nhập lại mật khẩu</label>
                            </div>
                            <p className='ps-2 text-start'>
                                Bạn đã có tài khoản? 
                                <a href='!#' id="loginModalLink" style={{color:"black"}}
                                data-bs-toggle="modal" data-bs-target="#loginModal"> Đăng nhập </a>
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary login-modal-btn">Đăng Ký</button>
                        </div>
                    </Form>
                </Formik>
                </div>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}
