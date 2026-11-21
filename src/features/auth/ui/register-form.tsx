'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/entities/user';
import { fetchAddressByCep } from '@/features/lookup-cep';
import { formatCep, formatCpf, formatPhone } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui';
import styles from './register-form.module.css';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
  cpf: Yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
    .required('CPF é obrigatório'),
  phone: Yup.string()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido')
    .required('Telefone é obrigatório'),
  zipCode: Yup.string()
    .matches(/^\d{5}-\d{3}$/, 'CEP inválido')
    .required('CEP é obrigatório'),
  address: Yup.string().required('Endereço é obrigatório'),
  number: Yup.string().required('Número é obrigatório'),
  neighborhood: Yup.string().required('Bairro é obrigatório'),
  city: Yup.string().required('Cidade é obrigatória'),
  state: Yup.string().length(2, 'UF deve ter 2 letras').required('Estado é obrigatório'),
});

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepBlur = async (
    cep: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const data = await fetchAddressByCep(cleanCep);
        setFieldValue('address', data.logradouro || '');
        setFieldValue('neighborhood', data.bairro || '');
        setFieldValue('city', data.localidade || '');
        setFieldValue('state', data.uf || '');
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setErrorMessage('');
      await register(values.email, values.password);
      router.push('/catalog');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {errorMessage && <div className={styles.globalError}>{errorMessage}</div>}

      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          cpf: '',
          phone: '',
          zipCode: '',
          address: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form className={styles.registerForm}>
            {/* Dados Pessoais */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>1. Dados Pessoais</h3>

              <div className={styles.formGroup}>
                <label htmlFor="reg-name">Nome Completo</label>
                <Field
                  type="text"
                  name="name"
                  id="reg-name"
                  placeholder="Seu nome completo"
                  className={`${styles.formInput} ${
                    errors.name && touched.name ? styles.inputError : ''
                  }`}
                />
                {errors.name && touched.name && (
                  <span className={styles.errorMessage}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-cpf">CPF</label>
                  <Field name="cpf">
                    {({ field }: any) => (
                      <input
                        {...field}
                        type="text"
                        id="reg-cpf"
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className={`${styles.formInput} ${
                          errors.cpf && touched.cpf ? styles.inputError : ''
                        }`}
                        onChange={(e) => {
                          const formatted = formatCpf(e.target.value);
                          setFieldValue('cpf', formatted);
                        }}
                      />
                    )}
                  </Field>
                  {errors.cpf && touched.cpf && (
                    <span className={styles.errorMessage}>{errors.cpf}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reg-phone">Telefone</label>
                  <Field name="phone">
                    {({ field }: any) => (
                      <input
                        {...field}
                        type="text"
                        id="reg-phone"
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className={`${styles.formInput} ${
                          errors.phone && touched.phone ? styles.inputError : ''
                        }`}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          setFieldValue('phone', formatted);
                        }}
                      />
                    )}
                  </Field>
                  {errors.phone && touched.phone && (
                    <span className={styles.errorMessage}>{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reg-email">E-mail</label>
                <Field
                  type="email"
                  name="email"
                  id="reg-email"
                  placeholder="eve.holt@reqres.in"
                  className={`${styles.formInput} ${
                    errors.email && touched.email ? styles.inputError : ''
                  }`}
                />
                {errors.email && touched.email && (
                  <span className={styles.errorMessage}>{errors.email}</span>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-password">Senha</label>
                  <Field
                    type="password"
                    name="password"
                    id="reg-password"
                    placeholder="••••••"
                    className={`${styles.formInput} ${
                      errors.password && touched.password ? styles.inputError : ''
                    }`}
                  />
                  {errors.password && touched.password && (
                    <span className={styles.errorMessage}>{errors.password}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reg-confirmPassword">Confirmar Senha</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="reg-confirmPassword"
                    placeholder="••••••"
                    className={`${styles.formInput} ${
                      errors.confirmPassword && touched.confirmPassword
                        ? styles.inputError
                        : ''
                    }`}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <span className={styles.errorMessage}>
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>2. Endereço</h3>

              <div className={styles.formGroup}>
                <label htmlFor="reg-zipCode">CEP</label>
                <Field name="zipCode">
                  {({ field }: any) => (
                    <input
                      {...field}
                      type="text"
                      id="reg-zipCode"
                      placeholder="00000-000"
                      maxLength={9}
                      className={`${styles.formInput} ${
                        errors.zipCode && touched.zipCode ? styles.inputError : ''
                      }`}
                      onChange={(e) => {
                        const formatted = formatCep(e.target.value);
                        setFieldValue('zipCode', formatted);
                        if (formatted.replace(/\D/g, '').length === 8) {
                          handleCepBlur(formatted, setFieldValue);
                        }
                      }}
                      onBlur={() => handleCepBlur(values.zipCode, setFieldValue)}
                    />
                  )}
                </Field>
                {loadingCep && <span className={styles.textInfo}>Buscando endereço...</span>}
                {errors.zipCode && touched.zipCode && (
                  <span className={styles.errorMessage}>{errors.zipCode}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reg-address">Logradouro</label>
                <Field
                  type="text"
                  name="address"
                  id="reg-address"
                  placeholder="Rua, Avenida..."
                  className={`${styles.formInput} ${
                    errors.address && touched.address ? styles.inputError : ''
                  }`}
                />
                {errors.address && touched.address && (
                  <span className={styles.errorMessage}>{errors.address}</span>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-number">Número</label>
                  <Field
                    type="text"
                    name="number"
                    id="reg-number"
                    placeholder="123"
                    className={`${styles.formInput} ${
                      errors.number && touched.number ? styles.inputError : ''
                    }`}
                  />
                  {errors.number && touched.number && (
                    <span className={styles.errorMessage}>{errors.number}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reg-complement">Complemento (opcional)</label>
                  <Field
                    type="text"
                    name="complement"
                    id="reg-complement"
                    placeholder="Apto, Bloco..."
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reg-neighborhood">Bairro</label>
                <Field
                  type="text"
                  name="neighborhood"
                  id="reg-neighborhood"
                  placeholder="Centro"
                  className={`${styles.formInput} ${
                    errors.neighborhood && touched.neighborhood ? styles.inputError : ''
                  }`}
                />
                {errors.neighborhood && touched.neighborhood && (
                  <span className={styles.errorMessage}>{errors.neighborhood}</span>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-city">Cidade</label>
                  <Field
                    type="text"
                    name="city"
                    id="reg-city"
                    placeholder="São Paulo"
                    className={`${styles.formInput} ${
                      errors.city && touched.city ? styles.inputError : ''
                    }`}
                  />
                  {errors.city && touched.city && (
                    <span className={styles.errorMessage}>{errors.city}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reg-state">Estado (UF)</label>
                  <Field
                    type="text"
                    name="state"
                    id="reg-state"
                    placeholder="SP"
                    maxLength={2}
                    style={{ textTransform: 'uppercase' }}
                    className={`${styles.formInput} ${
                      errors.state && touched.state ? styles.inputError : ''
                    }`}
                  />
                  {errors.state && touched.state && (
                    <span className={styles.errorMessage}>{errors.state}</span>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Cadastrar
            </Button>
          </Form>
        )}
      </Formik>

      <div className={styles.authHint}>
        <p className={styles.hintTitle}>💡 Importante - API de Teste (ReqRes):</p>
        <p className={styles.hintText}>
          O ReqRes aceita apenas e-mails pré-cadastrados para registro.
          <br />
          <strong>Use:</strong> eve.holt@reqres.in
          <br />
          <strong>Senha:</strong> qualquer senha com 6+ caracteres
        </p>
      </div>
    </>
  );
};
