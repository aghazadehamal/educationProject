import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { toast } from "react-toastify"; 
import styles from "./LoginPage.module.css";

const schema = yup.object().shape({
  email: yup.string().email("Email düzgün deyil").required("Email tələb olunur"),
  password: yup
    .string()
    .min(4, "Şifrə minimum 4 simvol olmalıdır")
    .required("Şifrə tələb olunur"),
});

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Uğurla daxil oldunuz ✅", {
        toastId: "login-success",
      });
      navigate("/subjects/base", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Login alınmadı";
      toast.error(msg, {
        toastId: "login-error",
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      
      <Link to="/">
        <img src="/logogradeus.png" alt="logo" className={styles.logo} />
      </Link>

      
      <div className={styles.card}>
        <h2 className={styles.title}>Daxil ol</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        
          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <input
              type="email"
              {...register("email")}
              className={styles.input}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

     
     
          <div className={styles.formGroup}>
            <label className={styles.label}>Şifrə</label>
            <input
              type="password"
              {...register("password")}
              className={styles.input}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.forgotWrapper}>
            <Link to="#" className={styles.forgot}>
              Şifrəmi unutdum
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={styles.submitBtn}
          >
            {isSubmitting || loading ? "Giriş edilir..." : "Daxil ol"}
          </button>
        </form>

        <p className={styles.registerText}>
          Hesabınız yoxdur?{" "}
          <Link to="/register" className={styles.registerLink}>
            Qeydiyyatdan keçin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
