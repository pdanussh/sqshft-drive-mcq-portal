import "./index.css";
export const Option = ({
  name = "",
  label = "",
  isMultiSelect = false,
  id = "",
  values = [],
  handleChange = () => {},
}) => {
  const handleOptionChange = () => {
    values.includes(id)
      ? handleChange(values.filter((optionId) => optionId !== id))
      : handleChange([...values, id]);
  };

  const formatLabel = (code_string) => {
    if (code_string.includes("\\n")) {
      return code_string.split("\\n").map((question) => {
        return (
          <>
            {question}
            <br />
          </>
        );
      });
    } else {
      return <>{code_string}</>;
    }
  };

  return (
    <div className="option-container">
      {isMultiSelect ? (
        <div className="form-check">
          <input
            onChange={(e) => handleOptionChange()}
            className="form-check-input"
            type="checkbox"
            value={id}
            name={name}
            id={id}
            checked={values.includes(id)}
          ></input>
          <label
            className="form-check-label"
            for="flexCheckDefault"
            onClick={() => handleOptionChange()}
          >
            {label}
          </label>
        </div>
      ) : (
        <div className="form-check">
          <input
            onClick={(e) => handleChange([e.target.value])}
            className="form-check-input"
            type="radio"
            name={name}
            id={id}
            value={id}
            checked={values.includes(id)}
          ></input>
          <label
            className="form-check-label"
            for="flexRadioDefault1"
            onClick={() => handleChange([id])}
          >
            {formatLabel(label)}
          </label>
        </div>
      )}
    </div>
  );
};
