'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/entities/user';
import { fetchAddressByCep } from '@/features/lookup-cep';
import { formatCep, formatCpf, formatPhone } from '@/shared/lib/formatters';
import { Button, Card, CardContent } from '@/shared/ui';

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
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  const redirect = searchParams?.get('redirect');
  const redirectUrl = redirect ? `/${redirect}` : '/catalog';

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
      router.push(redirectUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-white/5 bg-card/90 shadow-2xl backdrop-blur-md">
      <CardContent className="p-6 sm:p-8">
        {errorMessage && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-center text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        )}

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
          {({ errors, touched, isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-primary">Informações Pessoais</h3>
                
                <div className="space-y-1.5">
                  <label htmlFor="reg-name" className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  <Field
                    type="text"
                    name="name"
                    id="reg-name"
                    placeholder="Seu nome completo"
                    className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                      errors.name && touched.name
                        ? 'border-destructive focus:ring-destructive'
                        : 'border-input focus:border-primary focus:ring-primary'
                    }`}
                  />
                  {errors.name && touched.name && (
                    <span className="text-xs font-medium text-destructive">{errors.name}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-cpf" className="text-sm font-medium text-muted-foreground">CPF</label>
                    <Field name="cpf">
                      {({ field }: any) => (
                        <input
                          {...field}
                          type="text"
                          id="reg-cpf"
                          placeholder="000.000.000-00"
                          maxLength={14}
                          onChange={(e) => setFieldValue('cpf', formatCpf(e.target.value))}
                          className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                            errors.cpf && touched.cpf
                              ? 'border-destructive focus:ring-destructive'
                              : 'border-input focus:border-primary focus:ring-primary'
                          }`}
                        />
                      )}
                    </Field>
                    {errors.cpf && touched.cpf && (
                      <span className="text-xs font-medium text-destructive">{errors.cpf}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-phone" className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <Field name="phone">
                      {({ field }: any) => (
                        <input
                          {...field}
                          type="text"
                          id="reg-phone"
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                          onChange={(e) => setFieldValue('phone', formatPhone(e.target.value))}
                          className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                            errors.phone && touched.phone
                              ? 'border-destructive focus:ring-destructive'
                              : 'border-input focus:border-primary focus:ring-primary'
                          }`}
                        />
                      )}
                    </Field>
                    {errors.phone && touched.phone && (
                      <span className="text-xs font-medium text-destructive">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-email" className="text-sm font-medium text-muted-foreground">E-mail</label>
                  <Field
                    type="email"
                    name="email"
                    id="reg-email"
                    placeholder="seu@email.com"
                    className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                      errors.email && touched.email
                        ? 'border-destructive focus:ring-destructive'
                        : 'border-input focus:border-primary focus:ring-primary'
                    }`}
                  />
                  {errors.email && touched.email && (
                    <span className="text-xs font-medium text-destructive">{errors.email}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-password" className="text-sm font-medium text-muted-foreground">Senha</label>
                    <Field
                      type="password"
                      name="password"
                      id="reg-password"
                      placeholder="••••••"
                      className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                        errors.password && touched.password
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-input focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {errors.password && touched.password && (
                      <span className="text-xs font-medium text-destructive">{errors.password}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-confirmPassword" className="text-sm font-medium text-muted-foreground">Confirmar Senha</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      id="reg-confirmPassword"
                      placeholder="••••••"
                      className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                        errors.confirmPassword && touched.confirmPassword
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-input focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <span className="text-xs font-medium text-destructive">{errors.confirmPassword}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4 border-t border-white/5 pt-4">
                <h3 className="text-base font-semibold text-primary">Endereço</h3>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="reg-zipCode" className="text-sm font-medium text-muted-foreground">CEP</label>
                    {loadingCep && <span className="text-xs text-primary animate-pulse">Buscando endereço...</span>}
                  </div>
                  <Field name="zipCode">
                    {({ field }: any) => (
                      <input
                        {...field}
                        type="text"
                        id="reg-zipCode"
                        placeholder="00000-000"
                        maxLength={9}
                        onChange={(e) => setFieldValue('zipCode', formatCep(e.target.value))}
                        onBlur={(e) => {
                          field.onBlur(e);
                          handleCepBlur(e.target.value, setFieldValue);
                        }}
                        className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                          errors.zipCode && touched.zipCode
                            ? 'border-destructive focus:ring-destructive'
                            : 'border-input focus:border-primary focus:ring-primary'
                        }`}
                      />
                    )}
                  </Field>
                  {errors.zipCode && touched.zipCode && (
                    <span className="text-xs font-medium text-destructive">{errors.zipCode}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="reg-address" className="text-sm font-medium text-muted-foreground">Rua/Avenida</label>
                    <Field
                      type="text"
                      name="address"
                      id="reg-address"
                      placeholder="Rua..."
                      className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                        errors.address && touched.address
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-input focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {errors.address && touched.address && (
                      <span className="text-xs font-medium text-destructive">{errors.address}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-number" className="text-sm font-medium text-muted-foreground">Número</label>
                    <Field
                      type="text"
                      name="number"
                      id="reg-number"
                      placeholder="123"
                      className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                        errors.number && touched.number
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-input focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {errors.number && touched.number && (
                      <span className="text-xs font-medium text-destructive">{errors.number}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-complement" className="text-sm font-medium text-muted-foreground">Complemento (opcional)</label>
                    <Field
                      type="text"
                      name="complement"
                      id="reg-complement"
                      placeholder="Apto 101, Bloco B"
                      className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-neighborhood" className="text-sm font-medium text-muted-foreground">Bairro</label>
                    <Field
                      type="text"
                      name="neighborhood"
                      id="reg-neighborhood"
                      placeholder="Bairro"
                      className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                        errors.neighborhood && touched.neighborhood
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-input focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {errors.neighborhood && touched.neighborhood && (
                      <span className="text-xs font-medium text-destructive">{errors.neighborhood}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="reg-city" className="text-sm font-medium text-muted-foreground">Cidade</label>
                    <Field
                      type="text"
                      name="city"
                      id="reg-city"
                      placeholder="Cidade"
                      className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                        errors.city && touched.city
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-input focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {errors.city && touched.city && (
                      <span className="text-xs font-medium text-destructive">{errors.city}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-state" className="text-sm font-medium text-muted-foreground">Estado</label>
                    <Field
                      type="text"
                      name="state"
                      id="reg-state"
                      placeholder="UF"
                      maxLength={2}
                      className={`h-11 w-full rounded-lg border bg-card px-3.5 text-sm uppercase text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 ${
                        errors.state && touched.state
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-input focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {errors.state && touched.state && (
                      <span className="text-xs font-medium text-destructive">{errors.state}</span>
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
                className="font-bold"
              >
                Cadastrar
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
