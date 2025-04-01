import { memo } from 'react';

export default memo(function Bestelling({bestelling, handleSelect}) {
  const { id,  betalingsstatus, datumgeplaatst, orderstatus, klant } = bestelling;
  console.log('Bestellingen laden...');

  // Functie om datum te formatteren naar "jaar/maand/dag" formaat
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Voeg een 0 toe als dag enkelvoudig is
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Voeg een 0 toe als maand enkelvoudig is
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
  };

  const onSelectBestelling = () => {
    handleSelect(bestelling)
  }

  /*const calculateTotal = (totaalOrderBedrag) => {
    return totaalOrderBedrag;
  }*/

  return (
    <tr onClick={onSelectBestelling}>
      {<td>{id}</td>}
      {/*<td>{betaalwijze}</td>*/}
      {/*<td>formatDate(betalingsdeadline)</td>*/}
      <td>{betalingsstatus}</td>
      <td>{formatDate(datumgeplaatst)}</td>
      {/*<td>leveradres</td>*/}
      <td>{orderstatus}</td>
      {/*<td>calculateTotal(totaalOrderBedrag)</td>*/}
      <td>{klant}</td>
      {/*<td>leverancier</td>*/}
    </tr>
  );
});
