'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/entities/user';
import { Button } from '@/shared/ui';
import styles from './login-form.module.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  const redirect = searchParams?.get('redirect');
  const redirectUrl = redirect ? `/${redirect}` : '/catalog';

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setErrorMessage('');
      await login(values.email, values.password);
      router.push(redirectUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {errorMessage && <div className={styles.globalError}>{errorMessage}</div>}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="login-email">E-mail</label>
              <Field
                type="email"
                name="email"
                id="login-email"
                placeholder="seu@email.com"
                className={`${styles.formInput} ${
                  errors.email && touched.email ? styles.inputError : ''
                }`}
              />
              {errors.email && touched.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="login-password">Senha</label>
              <Field
                type="password"
                name="password"
                id="login-password"
                placeholder="••••••"
                className={`${styles.formInput} ${
                  errors.password && touched.password ? styles.inputError : ''
                }`}
              />
              {errors.password && touched.password && (
                <span className={styles.errorMessage}>{errors.password}</span>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Entrar
            </Button>
          </Form>
        )}
      </Formik>

      <div className={styles.authHint}>
        <p className={styles.hintTitle}>💡 Dica de Teste (ReqRes API):</p>
        <p className={styles.hintText}>
          Use o e-mail: <strong>eve.holt@reqres.in</strong>
          <br />
          Senha: qualquer senha com 6+ caracteres
        </p>
      </div>
    </>
  );
};
