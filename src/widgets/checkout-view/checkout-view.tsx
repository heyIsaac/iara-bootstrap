'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { CreditCard, QrCode, Barcode } from '@phosphor-icons/react';
import { Container, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import {
  formatCurrency,
  formatCpf,
  formatPhone,
  formatCep,
  formatCardNumber,
  formatCardExpiry,
} from '@/shared/lib/formatters';
import { useCart } from '@/entities/cart';
import { useAuth } from '@/entities/user';
import { Order, saveOrderToHistory, savePendingOrder } from '@/entities/order';
import { fetchAddressByCep } from '@/features/lookup-cep';
import styles from './checkout-view.module.css';

const CheckoutSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .required('Nome é obrigatório'),
  email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
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
  paymentMethod: Yup.string().required('Selecione uma forma de pagamento'),
  cardNumber: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) =>
      schema
        .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Número de cartão inválido')
        .required('Número do cartão é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardName: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('Nome impresso no cartão é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardExpiry: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) =>
      schema
        .matches(/^\d{2}\/\d{2}$/, 'Validade inválida (MM/AA)')
        .required('Validade é obrigatória'),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardCVV: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) =>
      schema
        .matches(/^\d{3,4}$/, 'CVV deve ter 3 ou 4 dígitos')
        .required('CVV é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const CheckoutView: React.FC = () => {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { userEmail } = useAuth();
  const [loadingCep, setLoadingCep] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push(ROUTES.cart);
    }
  }, [items.length, router]);

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
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async (values: any) => {
    setProcessing(true);

    const orderId = `ORDER-${Date.now()}`;
    const orderData: Order = {
      id: orderId,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price })),
      total,
      customer: {
        name: values.name,
        email: values.email,
        cpf: values.cpf,
        phone: values.phone,
        zipCode: values.zipCode,
        address: values.address,
        number: values.number,
        complement: values.complement,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
      },
      paymentMethod: values.paymentMethod,
      date: new Date().toISOString(),
    };

    if (values.paymentMethod === 'card') {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowSuccess(true);
      saveOrderToHistory(orderData);
      clearCart();
      setTimeout(() => {
        router.push(`${ROUTES.success}?orderId=${orderId}`);
      }, 1000);
    } else if (values.paymentMethod === 'pix') {
      savePendingOrder(orderData);
      clearCart();
      router.push(ROUTES.paymentPix);
    } else if (values.paymentMethod === 'boleto') {
      savePendingOrder(orderData);
      clearCart();
      router.push(ROUTES.paymentBoleto);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className={styles.checkoutPage}>
      <Container>
        <h1 className={styles.title}>Finalizar Compra</h1>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <Formik
              initialValues={{
                name: '',
                email: userEmail || '',
                cpf: '',
                phone: '',
                zipCode: '',
                address: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                paymentMethod: 'card',
                cardNumber: '',
                cardName: '',
                cardExpiry: '',
                cardCVV: '',
              }}
              validationSchema={CheckoutSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                <Form className={styles.form}>
                  {/* Dados de Entrega / Cobrança */}
                  <div>
                    <h2 className={styles.sectionHeader}>Dados de Cobrança</h2>

                    <div className={styles.formGroup}>
                      <label htmlFor="chk-name">Nome Completo</label>
                      <Field
                        type="text"
                        name="name"
                        id="chk-name"
                        placeholder="Seu nome"
                        className={`${styles.formInput} ${
                          errors.name && touched.name ? styles.inputError : ''
                        }`}
                      />
                      {errors.name && touched.name && (
                        <span className={styles.errorMessage}>{errors.name}</span>
                      )}
                    </div>

                    <div className={styles.formRow} style={{ marginTop: 16 }}>
                      <div className={styles.formGroup}>
                        <label htmlFor="chk-email">E-mail</label>
                        <Field
                          type="email"
                          name="email"
                          id="chk-email"
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
                        <label htmlFor="chk-cpf">CPF</label>
                        <Field name="cpf">
                          {({ field }: any) => (
                            <input
                              {...field}
                              type="text"
                              id="chk-cpf"
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
                    </div>

                    <div className={styles.formRow} style={{ marginTop: 16 }}>
                      <div className={styles.formGroup}>
                        <label htmlFor="chk-phone">Telefone</label>
                        <Field name="phone">
                          {({ field }: any) => (
                            <input
                              {...field}
                              type="text"
                              id="chk-phone"
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

                      <div className={styles.formGroup}>
                        <label htmlFor="chk-zipCode">CEP</label>
                        <Field name="zipCode">
                          {({ field }: any) => (
                            <input
                              {...field}
                              type="text"
                              id="chk-zipCode"
                              placeholder="00000-000"
                              maxLength={9}
                              className={`${styles.formInput} ${
                                errors.zipCode && touched.zipCode
                                  ? styles.inputError
                                  : ''
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
                        {loadingCep && (
                          <span className={styles.textInfo}>Buscando endereço...</span>
                        )}
                        {errors.zipCode && touched.zipCode && (
                          <span className={styles.errorMessage}>{errors.zipCode}</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.formGroup} style={{ marginTop: 16 }}>
                      <label htmlFor="chk-address">Endereço</label>
                      <Field
                        type="text"
                        name="address"
                        id="chk-address"
                        placeholder="Rua, Av..."
                        className={`${styles.formInput} ${
                          errors.address && touched.address ? styles.inputError : ''
                        }`}
                      />
                    </div>

                    <div className={styles.formRow} style={{ marginTop: 16 }}>
                      <div className={styles.formGroup}>
                        <label htmlFor="chk-number">Número</label>
                        <Field
                          type="text"
                          name="number"
                          id="chk-number"
                          placeholder="123"
                          className={`${styles.formInput} ${
                            errors.number && touched.number ? styles.inputError : ''
                          }`}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="chk-neighborhood">Bairro</label>
                        <Field
                          type="text"
                          name="neighborhood"
                          id="chk-neighborhood"
                          placeholder="Centro"
                          className={`${styles.formInput} ${
                            errors.neighborhood && touched.neighborhood
                              ? styles.inputError
                              : ''
                          }`}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow} style={{ marginTop: 16 }}>
                      <div className={styles.formGroup}>
                        <label htmlFor="chk-city">Cidade</label>
                        <Field
                          type="text"
                          name="city"
                          id="chk-city"
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="chk-state">UF</label>
                        <Field
                          type="text"
                          name="state"
                          id="chk-state"
                          maxLength={2}
                          style={{ textTransform: 'uppercase' }}
                          className={styles.formInput}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Forma de Pagamento */}
                  <div className={styles.paymentSection}>
                    <h3>Forma de Pagamento</h3>

                    <div className={styles.paymentMethods}>
                      <label
                        className={`${styles.paymentMethodOption} ${
                          values.paymentMethod === 'card' ? styles.active : ''
                        }`}
                      >
                        <Field type="radio" name="paymentMethod" value="card" />
                        <div className={styles.paymentMethodContent}>
                          <CreditCard size={28} className={styles.paymentMethodIcon} />
                          <span>Cartão</span>
                        </div>
                      </label>

                      <label
                        className={`${styles.paymentMethodOption} ${
                          values.paymentMethod === 'pix' ? styles.active : ''
                        }`}
                      >
                        <Field type="radio" name="paymentMethod" value="pix" />
                        <div className={styles.paymentMethodContent}>
                          <QrCode size={28} className={styles.paymentMethodIcon} />
                          <span>PIX</span>
                        </div>
                      </label>

                      <label
                        className={`${styles.paymentMethodOption} ${
                          values.paymentMethod === 'boleto' ? styles.active : ''
                        }`}
                      >
                        <Field type="radio" name="paymentMethod" value="boleto" />
                        <div className={styles.paymentMethodContent}>
                          <Barcode size={28} className={styles.paymentMethodIcon} />
                          <span>Boleto</span>
                        </div>
                      </label>
                    </div>

                    {/* Cartão de Crédito */}
                    {values.paymentMethod === 'card' && (
                      <div className={styles.cardFields}>
                        <div className={styles.formGroup}>
                          <label htmlFor="chk-cardNumber">Número do Cartão</label>
                          <Field name="cardNumber">
                            {({ field }: any) => (
                              <input
                                {...field}
                                type="text"
                                id="chk-cardNumber"
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                className={`${styles.formInput} ${
                                  errors.cardNumber && touched.cardNumber
                                    ? styles.inputError
                                    : ''
                                }`}
                                onChange={(e) => {
                                  const formatted = formatCardNumber(e.target.value);
                                  setFieldValue('cardNumber', formatted);
                                }}
                              />
                            )}
                          </Field>
                          {errors.cardNumber && touched.cardNumber && (
                            <span className={styles.errorMessage}>
                              {errors.cardNumber}
                            </span>
                          )}
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="chk-cardName">Nome no Cartão</label>
                          <Field
                            type="text"
                            name="cardName"
                            id="chk-cardName"
                            placeholder="NOME COMO ESTÁ NO CARTÃO"
                            style={{ textTransform: 'uppercase' }}
                            className={`${styles.formInput} ${
                              errors.cardName && touched.cardName ? styles.inputError : ''
                            }`}
                          />
                          {errors.cardName && touched.cardName && (
                            <span className={styles.errorMessage}>
                              {errors.cardName}
                            </span>
                          )}
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label htmlFor="chk-cardExpiry">Validade</label>
                            <Field name="cardExpiry">
                              {({ field }: any) => (
                                <input
                                  {...field}
                                  type="text"
                                  id="chk-cardExpiry"
                                  placeholder="MM/AA"
                                  maxLength={5}
                                  className={`${styles.formInput} ${
                                    errors.cardExpiry && touched.cardExpiry
                                      ? styles.inputError
                                      : ''
                                  }`}
                                  onChange={(e) => {
                                    const formatted = formatCardExpiry(e.target.value);
                                    setFieldValue('cardExpiry', formatted);
                                  }}
                                />
                              )}
                            </Field>
                            {errors.cardExpiry && touched.cardExpiry && (
                              <span className={styles.errorMessage}>
                                {errors.cardExpiry}
                              </span>
                            )}
                          </div>

                          <div className={styles.formGroup}>
                            <label htmlFor="chk-cardCVV">CVV</label>
                            <Field
                              type="text"
                              name="cardCVV"
                              id="chk-cardCVV"
                              placeholder="123"
                              maxLength={4}
                              className={`${styles.formInput} ${
                                errors.cardCVV && touched.cardCVV
                                  ? styles.inputError
                                  : ''
                              }`}
                            />
                            {errors.cardCVV && touched.cardCVV && (
                              <span className={styles.errorMessage}>
                                {errors.cardCVV}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={styles.testCardInfo}>
                          <p>
                            💡 <strong>Teste:</strong> Use o cartão 4242 4242 4242 4242
                          </p>
                        </div>
                      </div>
                    )}

                    {values.paymentMethod === 'pix' && (
                      <div className={styles.paymentMethodInfo}>
                        <p>
                          Após confirmar, você receberá o QR Code e código Copia e Cola
                          para pagamento instantâneo via PIX.
                        </p>
                      </div>
                    )}

                    {values.paymentMethod === 'boleto' && (
                      <div className={styles.paymentMethodInfo}>
                        <p>
                          Após confirmar, você receberá o código de barras e poderá
                          imprimir o boleto para pagamento em qualquer banco ou app.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={isSubmitting || processing}
                    disabled={isSubmitting || processing}
                  >
                    {processing
                      ? showSuccess
                        ? '✓ Pagamento Aprovado!'
                        : 'Processando pagamento...'
                      : 'Finalizar Pagamento'}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>

          <div className={styles.summary}>
            <h2>Resumo do Pedido</h2>
            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span>{item.name}</span>
                  <strong>{formatCurrency(item.price)}</strong>
                </div>
              ))}
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryTotal}>
              <span>Total:</span>
              <span className={styles.totalValue}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
