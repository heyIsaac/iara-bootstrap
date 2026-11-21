export const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits
      .slice(0, 10)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return digits
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

export const formatCep = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 8).replace(/(\d{5})(\d{1,3})$/, '$1-$2');
};

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
};

export const formatCardExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 4).replace(/(\d{2})(\d{1,2})$/, '$1/$2');
};
