'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/entities/user';
import { Button, Card, CardContent } from '@/shared/ui';

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
    <Card className="w-full border-white/5 bg-card/90 shadow-2xl backdrop-blur-md">
      <CardContent className="p-6 sm:p-8">
        {errorMessage && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-center text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-sm font-medium text-muted-foreground">
                  E-mail
                </label>
                <Field
                  type="email"
                  name="email"
                  id="login-email"
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

              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-sm font-medium text-muted-foreground">
                  Senha
                </label>
                <Field
                  type="password"
                  name="password"
                  id="login-password"
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

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="mt-2 font-bold"
              >
                Entrar
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 rounded-lg bg-white/[0.02] p-3 text-center text-xs text-muted-foreground">
          <p>
            Para testes com API real, use:<br />
            <strong className="text-primary font-mono">eve.holt@reqres.in</strong> com qualquer senha.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
