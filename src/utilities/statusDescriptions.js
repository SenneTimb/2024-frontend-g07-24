import orderStatussen from "./ordersStatus";
import betalingsStatssen from "./betalingsstatus";

export const paymentStatusDescriptions = {
    0: betalingsStatssen.BETAALD,
    1: betalingsStatssen.ONVERWERKT,
    2: betalingsStatssen.FACTUURVERZONDEN
  };
  
  export const orderStatusDescriptions = {
    0: orderStatussen.VERWERKT,
    1: orderStatussen.VERZONDEN,
    2: orderStatussen.GEPLAATST,
    3: orderStatussen.UITVOORLEVERING,
    4: orderStatussen.GELEVERD,
    5: orderStatussen.VOLTOOID
  };
  
export const typeNotificatie = {
  'betalingOntvangen': 'Betaling ontvangen',
  'klaarVerzending': 'Klaar verzending',
  'betalingsverzoek': 'Betalings verzoek'
}

  export const getKeyByValue = (obj, value) => {
    console.log(value);
    console.log(`key: ${Object.keys(obj).find(key => obj[key] === value)}`)
    return Object.keys(obj).find(key => obj[key] === value);
  };
  