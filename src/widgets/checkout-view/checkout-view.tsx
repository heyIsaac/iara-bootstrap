'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  CreditCard,
  QrCode,
  Barcode,
  CheckCircle,
  Lightning,
  ShieldCheck,
  Clock,
} from '@phosphor-icons/react';
import { Container, Button, Card, CardContent, Spinner } from '@/shared/ui';
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

const CheckoutSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  cpf: Yup.string()
    .min(11, 'CPF deve ter pelo menos 11 dígitos')
    .required('CPF é obrigatório'),
  phone: Yup.string()
    .min(10, 'Telefone inválido')
    .required('Telefone é obrigatório'),
  zipCode: Yup.string()
    .min(8, 'CEP inválido')
    .required('CEP é obrigatório'),
  address: Yup.string().required('Endereço é obrigatório'),
  number: Yup.string().required('Número é obrigatório'),
  neighborhood: Yup.string().required('Bairro é obrigatório'),
  city: Yup.string().required('Cidade é obrigatória'),
  state: Yup.string().required('Estado é obrigatório'),
  paymentMethod: Yup.string().required('Selecione uma forma de pagamento'),
  cardNumber: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) =>
      schema
        .min(15, 'Número de cartão inválido')
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
    then: (schema) => schema.required('Validade é obrigatória'),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardCVV: Yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) =>
      schema
        .min(3, 'CVV deve ter pelo menos 3 dígitos')
        .required('CVV é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const CheckoutView: React.FC = () => {
  const router = useRouter();
  const { items, total, loading: cartLoading, clearCart } = useCart();
  const { userEmail } = useAuth();
  const [loadingCep, setLoadingCep] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.push(ROUTES.cart);
    }
  }, [cartLoading, items.length, router]);

  if (cartLoading) {
    return (
      <Container className="py-20 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" label="Carregando checkout..." />
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return null;
  }

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

  const handleProcessOrder = async (values: any) => {
    setProcessing(true);

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [...items],
      total,
      date: new Date().toISOString(),
      paymentMethod: values.paymentMethod,
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
      pixPaid: values.paymentMethod === 'card',
      boletoPaid: false,
    };

    // Registra o pedido imediatamente no histórico de pedidos
    saveOrderToHistory(newOrder);

    if (values.paymentMethod === 'card') {
      setTimeout(() => {
        clearCart();
        setProcessing(false);
        setShowSuccess(true);
        setTimeout(() => {
          router.push(`${ROUTES.success}?orderId=${newOrder.id}`);
        }, 1200);
      }, 1000);
    } else {
      savePendingOrder(newOrder);
      clearCart();
      setProcessing(false);
      if (values.paymentMethod === 'pix') {
        router.push(ROUTES.paymentPix);
      } else {
        router.push(ROUTES.paymentBoleto);
      }
    }
  };

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Finalizar Compra
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ambiente seguro com criptografia de ponta a ponta
          </p>
        </div>

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
            paymentMethod: 'pix',
            cardNumber: '',
            cardName: '',
            cardExpiry: '',
            cardCVV: '',
          }}
          validationSchema={CheckoutSchema}
          onSubmit={handleProcessOrder}
        >
          {({ values, errors, touched, setFieldValue, setValues }) => (
            <Form className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              {/* Form Data (Left 2 cols) */}
              <div className="space-y-8 lg:col-span-2">
                {/* Dados do Cliente */}
                <Card className="border-white/5 bg-card/80">
                  <CardContent className="space-y-4 p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground">1. Dados Pessoais</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setValues({
                            ...values,
                            name: values.name || 'Gamer Brasileiro',
                            email: values.email || userEmail || 'gamer@iaragames.com.br',
                            cpf: values.cpf || '123.456.789-00',
                            phone: values.phone || '(11) 98765-4321',
                            zipCode: values.zipCode || '01310-100',
                            address: values.address || 'Avenida Paulista',
                            number: values.number || '1000',
                            complement: values.complement || 'Apto 42',
                            neighborhood: values.neighborhood || 'Bela Vista',
                            city: values.city || 'São Paulo',
                            state: values.state || 'SP',
                            cardNumber: values.cardNumber || '4532 1234 5678 9012',
                            cardName: values.cardName || 'GAMER BRASILEIRO',
                            cardExpiry: values.cardExpiry || '12/28',
                            cardCVV: values.cardCVV || '123',
                          });
                        }}
                        className="rounded-lg border border-primary/30 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                      >
                        ⚡ Preencher Dados de Teste
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="chk-name" className="text-sm font-medium text-muted-foreground">
                        Nome Completo
                      </label>
                      <Field
                        type="text"
                        name="name"
                        id="chk-name"
                        placeholder="Nome completo"
                        className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {errors.name && touched.name && (
                        <span className="text-xs font-medium text-destructive">{errors.name}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="chk-email" className="text-sm font-medium text-muted-foreground">
                          E-mail
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="chk-email"
                          placeholder="seu@email.com"
                          className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.email && touched.email && (
                          <span className="text-xs font-medium text-destructive">{errors.email}</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="chk-phone" className="text-sm font-medium text-muted-foreground">
                          Telefone
                        </label>
                        <Field name="phone">
                          {({ field }: any) => (
                            <input
                              {...field}
                              type="text"
                              id="chk-phone"
                              placeholder="(00) 00000-0000"
                              maxLength={15}
                              onChange={(e) => setFieldValue('phone', formatPhone(e.target.value))}
                              className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          )}
                        </Field>
                        {errors.phone && touched.phone && (
                          <span className="text-xs font-medium text-destructive">{errors.phone}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="chk-cpf" className="text-sm font-medium text-muted-foreground">
                        CPF
                      </label>
                      <Field name="cpf">
                        {({ field }: any) => (
                          <input
                            {...field}
                            type="text"
                            id="chk-cpf"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            onChange={(e) => setFieldValue('cpf', formatCpf(e.target.value))}
                            className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        )}
                      </Field>
                      {errors.cpf && touched.cpf && (
                        <span className="text-xs font-medium text-destructive">{errors.cpf}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Endereço */}
                <Card className="border-white/5 bg-card/80">
                  <CardContent className="space-y-4 p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground">2. Endereço de Faturamento</h3>
                      {loadingCep && <span className="text-xs text-primary animate-pulse">Buscando CEP...</span>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="chk-zipCode" className="text-sm font-medium text-muted-foreground">
                        CEP
                      </label>
                      <Field name="zipCode">
                        {({ field }: any) => (
                          <input
                            {...field}
                            type="text"
                            id="chk-zipCode"
                            placeholder="00000-000"
                            maxLength={9}
                            onChange={(e) => setFieldValue('zipCode', formatCep(e.target.value))}
                            onBlur={(e) => {
                              field.onBlur(e);
                              handleCepBlur(e.target.value, setFieldValue);
                            }}
                            className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        )}
                      </Field>
                      {errors.zipCode && touched.zipCode && (
                        <span className="text-xs font-medium text-destructive">{errors.zipCode}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="chk-address" className="text-sm font-medium text-muted-foreground">
                          Rua / Avenida
                        </label>
                        <Field
                          type="text"
                          name="address"
                          id="chk-address"
                          placeholder="Rua..."
                          className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.address && touched.address && (
                          <span className="text-xs font-medium text-destructive">{errors.address}</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="chk-number" className="text-sm font-medium text-muted-foreground">
                          Número
                        </label>
                        <Field
                          type="text"
                          name="number"
                          id="chk-number"
                          placeholder="123"
                          className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.number && touched.number && (
                          <span className="text-xs font-medium text-destructive">{errors.number}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="chk-complement" className="text-sm font-medium text-muted-foreground">
                          Complemento (opcional)
                        </label>
                        <Field
                          type="text"
                          name="complement"
                          id="chk-complement"
                          placeholder="Apto, Bloco..."
                          className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="chk-neighborhood" className="text-sm font-medium text-muted-foreground">
                          Bairro
                        </label>
                        <Field
                          type="text"
                          name="neighborhood"
                          id="chk-neighborhood"
                          placeholder="Bairro"
                          className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.neighborhood && touched.neighborhood && (
                          <span className="text-xs font-medium text-destructive">{errors.neighborhood}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="chk-city" className="text-sm font-medium text-muted-foreground">
                          Cidade
                        </label>
                        <Field
                          type="text"
                          name="city"
                          id="chk-city"
                          placeholder="Cidade"
                          className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.city && touched.city && (
                          <span className="text-xs font-medium text-destructive">{errors.city}</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="chk-state" className="text-sm font-medium text-muted-foreground">
                          Estado
                        </label>
                        <Field
                          type="text"
                          name="state"
                          id="chk-state"
                          placeholder="UF"
                          maxLength={2}
                          className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm uppercase text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.state && touched.state && (
                          <span className="text-xs font-medium text-destructive">{errors.state}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pagamento */}
                <Card className="border-white/5 bg-card/80">
                  <CardContent className="space-y-6 p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-foreground">3. Método de Pagamento</h3>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                          values.paymentMethod === 'pix'
                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(204,254,44,0.15)]'
                            : 'border-white/5 bg-card hover:border-white/10 text-foreground'
                        }`}
                      >
                        <Field type="radio" name="paymentMethod" value="pix" className="sr-only" />
                        <QrCode size={24} weight="fill" />
                        <span className="font-bold">PIX (Imediato)</span>
                      </label>

                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                          values.paymentMethod === 'card'
                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(204,254,44,0.15)]'
                            : 'border-white/5 bg-card hover:border-white/10 text-foreground'
                        }`}
                      >
                        <Field type="radio" name="paymentMethod" value="card" className="sr-only" />
                        <CreditCard size={24} weight="fill" />
                        <span className="font-bold">Cartão</span>
                      </label>

                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                          values.paymentMethod === 'boleto'
                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(204,254,44,0.15)]'
                            : 'border-white/5 bg-card hover:border-white/10 text-foreground'
                        }`}
                      >
                        <Field type="radio" name="paymentMethod" value="boleto" className="sr-only" />
                        <Barcode size={24} weight="fill" />
                        <span className="font-bold">Boleto</span>
                      </label>
                    </div>

                    {/* Informações para PIX */}
                    {values.paymentMethod === 'pix' && (
                      <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <Lightning size={24} weight="fill" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">Pagamento Instantâneo via PIX</h4>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Ao confirmar o pedido, você receberá o QR Code dinâmico e a chave Pix Copia e Cola para pagar pelo aplicativo do seu banco com aprovação imediata.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 border-t border-white/5 pt-3 text-xs sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <ShieldCheck size={18} className="text-emerald-400" weight="fill" />
                            <span>Liberação imediata dos jogos</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock size={18} className="text-yellow-400" weight="fill" />
                            <span>QR Code válido por 30 minutos</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Informações para Boleto */}
                    {values.paymentMethod === 'boleto' && (
                      <div className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-foreground">
                            <Barcode size={24} weight="fill" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">Pagamento via Boleto Bancário</h4>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Ao confirmar o pedido, geramos o boleto com linha digitável e código de barras para pagamento em qualquer banco, aplicativo ou casa lotérica.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 border-t border-white/5 pt-3 text-xs sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock size={18} className="text-muted-foreground" weight="fill" />
                            <span>Vencimento em 3 dias úteis</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <ShieldCheck size={18} className="text-emerald-400" weight="fill" />
                            <span>Sem taxa de emissão bancária</span>
                          </div>
                        </div>

                        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-200/90">
                          💡 <strong>Dica:</strong> Se quiser jogar agora mesmo, opte por <strong>PIX</strong> ou <strong>Cartão de Crédito</strong> para ativação imediata!
                        </div>
                      </div>
                    )}

                    {/* Dados do Cartão se selecionado */}
                    {values.paymentMethod === 'card' && (
                      <div className="space-y-4 rounded-xl border border-white/5 bg-black/20 p-5">
                        <div className="space-y-1.5">
                          <label htmlFor="chk-cardNumber" className="text-sm font-medium text-muted-foreground">
                            Número do Cartão
                          </label>
                          <Field name="cardNumber">
                            {({ field }: any) => (
                              <input
                                {...field}
                                type="text"
                                id="chk-cardNumber"
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                onChange={(e) => setFieldValue('cardNumber', formatCardNumber(e.target.value))}
                                className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            )}
                          </Field>
                          {errors.cardNumber && touched.cardNumber && (
                            <span className="text-xs font-medium text-destructive">{errors.cardNumber}</span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="chk-cardName" className="text-sm font-medium text-muted-foreground">
                            Nome no Cartão
                          </label>
                          <Field
                            type="text"
                            name="cardName"
                            id="chk-cardName"
                            placeholder="Como impresso no cartão"
                            className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          {errors.cardName && touched.cardName && (
                            <span className="text-xs font-medium text-destructive">{errors.cardName}</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="chk-cardExpiry" className="text-sm font-medium text-muted-foreground">
                              Validade (MM/AA)
                            </label>
                            <Field name="cardExpiry">
                              {({ field }: any) => (
                                <input
                                  {...field}
                                  type="text"
                                  id="chk-cardExpiry"
                                  placeholder="MM/AA"
                                  maxLength={5}
                                  onChange={(e) => setFieldValue('cardExpiry', formatCardExpiry(e.target.value))}
                                  className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              )}
                            </Field>
                            {errors.cardExpiry && touched.cardExpiry && (
                              <span className="text-xs font-medium text-destructive">{errors.cardExpiry}</span>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="chk-cardCVV" className="text-sm font-medium text-muted-foreground">
                              CVV
                            </label>
                            <Field
                              type="text"
                              name="cardCVV"
                              id="chk-cardCVV"
                              placeholder="123"
                              maxLength={4}
                              className="h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            {errors.cardCVV && touched.cardCVV && (
                              <span className="text-xs font-medium text-destructive">{errors.cardCVV}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary (Right 1 col) */}
              <div>
                <Card className="sticky top-28 border-white/10 bg-card/90 shadow-2xl backdrop-blur-md">
                  <CardContent className="space-y-6 p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-foreground">Itens do Pedido ({items.length})</h3>

                    <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg bg-black/20 p-2 text-xs"
                        >
                          <span className="line-clamp-1 font-medium text-foreground">{item.name}</span>
                          <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-4 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal:</span>
                        <span className="text-foreground">{formatCurrency(total)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Frete:</span>
                        <span className="font-semibold text-emerald-400">GRÁTIS</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2 text-base font-bold">
                        <span>Total:</span>
                        <span className="text-2xl font-black text-primary">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                        ⚠️ Preencha os campos obrigatórios destacados em vermelho para continuar.
                      </div>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      loading={processing}
                      disabled={processing}
                      className="font-bold shadow-[0_0_20px_rgba(204,254,44,0.3)]"
                    >
                      {processing
                        ? 'Processando...'
                        : values.paymentMethod === 'pix'
                        ? 'Confirmar e Gerar PIX'
                        : values.paymentMethod === 'boleto'
                        ? 'Confirmar e Gerar Boleto'
                        : 'Confirmar e Pagar'}
                    </Button>

                    <div className="text-center text-xs text-muted-foreground">
                      <p>✓ Criptografia SSL de 256 bits</p>
                      <p>✓ Garantia Iara Games de entrega digital</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Form>
          )}
        </Formik>

        {/* Modal Simulado de Sucesso de Cartão */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <Card className="mx-4 max-w-sm border-primary/30 bg-card p-6 text-center shadow-2xl">
              <CheckCircle size={56} className="mx-auto text-primary animate-bounce" weight="fill" />
              <h3 className="mt-4 text-xl font-bold text-foreground">Pagamento Aprovado!</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Redirecionando para a página de confirmação...
              </p>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
};
