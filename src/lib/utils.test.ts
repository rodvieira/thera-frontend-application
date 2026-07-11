import { formatCnpj, onlyDigits } from './utils';

describe('onlyDigits', () => {
  it('remove qualquer caractere que não seja dígito', () => {
    expect(onlyDigits('12.345.678/0001-90')).toBe('12345678000190');
  });
});

describe('formatCnpj', () => {
  it('aplica a máscara progressivamente conforme os dígitos chegam', () => {
    expect(formatCnpj('1')).toBe('1');
    expect(formatCnpj('12')).toBe('12');
    expect(formatCnpj('123')).toBe('12.3');
    expect(formatCnpj('12345')).toBe('12.345');
    expect(formatCnpj('123456')).toBe('12.345.6');
    expect(formatCnpj('12345678')).toBe('12.345.678');
    expect(formatCnpj('123456780001')).toBe('12.345.678/0001');
    expect(formatCnpj('12345678000190')).toBe('12.345.678/0001-90');
  });

  it('ignora caracteres não numéricos já presentes na entrada', () => {
    expect(formatCnpj('12.345.678/0001-90')).toBe('12.345.678/0001-90');
  });

  it('trunca dígitos além dos 14 esperados', () => {
    expect(formatCnpj('123456780001909999')).toBe('12.345.678/0001-90');
  });
});
