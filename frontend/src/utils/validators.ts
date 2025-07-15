export const validateCNPJ = (cnpj: string): boolean => {
  if (!cnpj) return false;
  
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica tamanho e sequência repetida
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  // Cálculo dos dígitos verificadores
  const digits = cnpj.split('').map(Number);
  
  const calcDigit = (slice: number[], factor: number) => {
    let sum = 0;
    let weight = factor;
    
    for (let i = 0; i < slice.length; i++) {
      sum += slice[i] * weight;
      weight = (weight === 2) ? 9 : weight - 1;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Valida primeiro dígito
  const firstDigit = calcDigit(digits.slice(0, 12), 5);
  if (digits[12] !== firstDigit) return false;

  // Valida segundo dígito
  const secondDigit = calcDigit(digits.slice(0, 13), 6);
  if (digits[13] !== secondDigit) return false;

  return true;
};

// Validador para react-hook-form
export const cnpjValidator = (value: string) => {
  return validateCNPJ(value || '') || "CNPJ inválido";
};
