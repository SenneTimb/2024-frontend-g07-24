export const formatBtwNummer = (btwNummer) => {
  const cleanBtwNummer = btwNummer.replace(/[^a-zA-Z0-9]/g, '');
  /*
  if (cleanBtwNummer.length !== 14) {
    throw new Error('Invalid BTW number length. It should be 14 characters long.');
  }
  */
  const countryCode = cleanBtwNummer.slice(0, 2).toUpperCase();
  const number1 = cleanBtwNummer.slice(2, 6);
  const number2 = cleanBtwNummer.slice(6,9);
  const number3 = cleanBtwNummer.slice(9);

  return `${countryCode} ${number1}.${number2}.${number3}`;
};