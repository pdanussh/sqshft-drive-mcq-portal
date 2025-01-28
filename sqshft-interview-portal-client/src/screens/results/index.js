import { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar";
import Table from "../../components/table";
import { makeAPICall } from "../../utils/helpers";
import { API_END_POINTS } from "../../utils/constants";
import Loading from "react-fullscreen-loading";

export const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const { data } = await makeAPICall({
        endpoint: API_END_POINTS.GET_RESULTS,
      });
      setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, []);

  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Prog Score (%)",
    "Prog Attempted (10)",
    "Logical Score (%)",
    "Logical Attempted (5)",
    "Quants Score (%)",
    "Quants Attempted (5)",
  ];

  const fieldKeys = [
    "firstName",
    "lastName",
    "email",
    "progScore",
    "progAttempted",
    "logicalScore",
    "logicalAttempted",
    "quantsScore",
    "quantsAttempted",
  ];

  const flattenedData = results.map((item) => ({
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    progScore: item.scores.prog.scorePercentage,
    progAttempted: item.scores.prog.attempted,
    logicalScore: item.scores.logical.scorePercentage,
    logicalAttempted: item.scores.logical.attempted,
    quantsScore: item.scores.quants.scorePercentage,
    quantsAttempted: item.scores.quants.attempted,
  }));

  return (
    <>
      <Navbar />
      <br />
      <br />
      {loading ? (
        <Loading loading background="#FFF" loaderColor="#257d256b" />
      ) : (
        <Table data={flattenedData} fieldKeys={fieldKeys} headers={headers} />
      )}
    </>
  );
};
