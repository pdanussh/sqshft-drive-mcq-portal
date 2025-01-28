import React from "react";
export default function Table({
  className = "",
  headers = [],
  data = [],
  fieldKeys = [],
}) {
  const getData = (datum) => {
    return fieldKeys.map((fieldkey, index) => (
      <td key={index}>{datum[fieldkey]}</td>
    ));
  };

  return (
    <table className={`table ${className}`}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((datum, index) => (
          <tr key={index}>{getData(datum)}</tr>
        ))}
      </tbody>
    </table>
  );
}
