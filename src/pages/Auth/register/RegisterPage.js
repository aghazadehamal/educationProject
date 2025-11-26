import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerRequest } from "../../../services/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";   

import styles from "./RegisterPage.module.css";

const schema = yup.object().shape({
  name: yup.string().required("Ad tələb olunur"),
  email: yup.string().email("Email düzgün deyil").required("Email tələb olunur"),
  password: yup.string().min(4, "Şifrə minimum 4 simvol olmalıdır").required("Şifrə tələb olunur"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password"), null], "Şifrələr eyni olmalıdır")
    .required("Təkrar şifrə tələb olunur"),
  tenantName: yup.string().required("Kurs/tenant adı tələb olunur"),
  tenantSlug: yup.string().required("Slug tələb olunur"),
  tenantEmail: yup.string().email("Email düzgün deyil").required("Tenant email tələb olunur"),
  phone: yup.string().required("Telefon nömrə tələb olunur"),
  address: yup.string().required("Ünvan tələb olunur"),
});

const RegisterPage = () => {
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
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      tenantName: values.tenantName,
      tenantSlug: values.tenantSlug,
      tenantEmail: values.tenantEmail,
      phone: values.phone,
      address: values.address,
    };

    await registerRequest(payload); 

    toast.success("Qeydiyyat uğurla tamamlandı! 🎉", {
      toastId: "register-success",
    });

    navigate("/login");
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Qeydiyyat alınmadı";

    toast.error(msg, {
      toastId: "register-error",
    });
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Link to="/">
          <img src="/logogradeus.png" alt="logo" className={styles.logo} />
        </Link>

        <h2 className={styles.title}>Qeydiyyat</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
       
          <div className={styles.formGroup}>
            <label className={styles.label}>Ad</label>
            <input type="text" {...register("name")} className={styles.input} placeholder="Adınızı daxil edin" />
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}
          </div>

       
          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <input type="email" {...register("email")} className={styles.input} placeholder="Emailinizi daxil edin" />
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>

        
          <div className={styles.formGroup}>
            <label className={styles.label}>Şifrə</label>
            <input type="password" {...register("password")} className={styles.input} placeholder="Şifrənizi daxil edin" />
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          </div>

      
          <div className={styles.formGroup}>
            <label className={styles.label}>Şifrəni təkrarlayın</label>
            <input type="password" {...register("confirmPassword")} className={styles.input} placeholder="Şifrənizi təkrar daxil edin" />
            {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
          </div>

       
          <div className={styles.formGroup}>
            <label className={styles.label}>Kurs / Tenant adı</label>
            <input type="text" {...register("tenantName")} className={styles.input} placeholder="Məs: Edurive Academy" />
            {errors.tenantName && <p className={styles.error}>{errors.tenantName.message}</p>}
          </div>

        
          <div className={styles.formGroup}>
            <label className={styles.label}>Slug</label>
            <input type="text" {...register("tenantSlug")} className={styles.input} placeholder="məs: edurive-academy" />
            {errors.tenantSlug && <p className={styles.error}>{errors.tenantSlug.message}</p>}
          </div>

   
          <div className={styles.formGroup}>
            <label className={styles.label}>Tenant E-mail</label>
            <input type="email" {...register("tenantEmail")} className={styles.input} placeholder="Kursun rəsmi email ünvanı" />
            {errors.tenantEmail && <p className={styles.error}>{errors.tenantEmail.message}</p>}
          </div>

      
          <div className={styles.formGroup}>
            <label className={styles.label}>Telefon nömrə</label>
            <div className={styles.phoneContainer}>
              <div className={styles.phonePrefix}>(+994)</div>
              <input type="text" {...register("phone")} className={styles.phoneInput} placeholder="997660042" />
            </div>
            {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
          </div>

    
          <div className={styles.formGroup}>
            <label className={styles.label}>Ünvan</label>
            <input type="text" {...register("address")} className={styles.input} placeholder="Kursun ünvanını daxil edin" />
            {errors.address && <p className={styles.error}>{errors.address.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? "Qeydiyyat edilir..." : "Təsdiq et"}
          </button>
        </form>

        <p className={styles.loginText}>
          Hesabınız var?{" "}
          <Link to="/login" className={styles.loginLink}>
            Daxil olun.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
