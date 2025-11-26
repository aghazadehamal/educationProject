
import React from "react";
import styles from "./StudentFormModal.module.css"; 

const StudentFormModal = ({
  isOpen,
  mode,      
  values,
  onChange,
  onClose,
  onSubmit,
  saving,
  error,
}) => {
  if (!isOpen) return null;

  const title =
    mode === "create" ? "Yeni tələbə əlavə et" : "Tələbəni redaktə et";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
   
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Bağla"
          >
            ×
          </button>
        </div>


        <form onSubmit={onSubmit} className={styles.form}>
   
          <div className={styles.formGroup}>
            <label className={styles.label}>Ad</label>
            <input
              type="text"
              name="firstName"
              value={values.firstName}
              onChange={onChange}
              className={styles.input}
              placeholder="Tələbənin adını daxil edin"
            />
          </div>


          <div className={styles.formGroup}>
            <label className={styles.label}>Soyad</label>
            <input
              type="text"
              name="lastName"
              value={values.lastName}
              onChange={onChange}
              className={styles.input}
              placeholder="Tələbənin soyadını daxil edin"
            />
          </div>


          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={onChange}
              className={styles.input}
              placeholder="Email ünvanını daxil edin"
            />
          </div>

          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Şəxsiyyət vəsiqəsinin № (nationalId)
            </label>
            <input
              type="text"
              name="nationalId"
              value={values.nationalId}
              onChange={onChange}
              className={styles.input}
              placeholder="Məs: AZE1234567"
            />
          </div>

        
          <div className={styles.formGroup}>
            <label className={styles.label}>Doğum tarixi</label>
            <input
              type="date"
              name="birthDate"
              value={values.birthDate}
              onChange={onChange}
              className={styles.input}
            />
          </div>

  
          <div className={styles.formGroup}>
            <label className={styles.label}>Cins</label>
            <select
              name="gender"
              value={values.gender}
              onChange={onChange}
              className={styles.input}
            >
              <option value="">Seçin...</option>
              <option value="MALE">Kişi</option>
              <option value="FEMALE">Qadın</option>
            </select>
          </div>

        
          <div className={styles.formGroup}>
            <label className={styles.label}>Telefon</label>
            <input
              type="text"
              name="phone"
              value={values.phone}
              onChange={onChange}
              className={styles.input}
              placeholder="+994..."
            />
          </div>

   
          <div className={styles.formGroup}>
            <label className={styles.label}>Ünvan</label>
            <textarea
              name="address"
              value={values.address}
              onChange={onChange}
              className={styles.textarea}
              placeholder="Tələbənin ünvanını daxil edin"
            />
          </div>

          {error && <p className={styles.error}>Xəta: {error}</p>}

     
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={saving}
              className={styles.submitBtn}
            >
              {saving
                ? "Yadda saxlanılır..."
                : mode === "create"
                ? "Əlavə et"
                : "Yadda saxla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
