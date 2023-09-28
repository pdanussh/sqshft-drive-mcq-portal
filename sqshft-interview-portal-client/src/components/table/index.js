import React from "react";
export default function Table({
  className = "",
  headers = [],
  data = [],
  fieldKeys = [],
}) {
  const getData = (datum) => {
    return fieldKeys.map((fieldkey) => <td>{datum[fieldkey]}</td>);
  };

  return (
    <table className={`table ${className}`}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((datum) => (
          <tr>{getData(datum)}</tr>
        ))}
      </tbody>
    </table>
  );
}
