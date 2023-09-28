import { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar";
import Table from "../../components/table";
import { makeAPICall } from "../../utils/helpers";
import {
  API_END_POINTS,
  EMAIL_ID,
  F_NAME,
  L_NAME,
  SCORE,
} from "../../utils/constants";
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

  return (
    <>
      <Navbar />
      <br />
      <br />
      {loading ? (
        <Loading loading background="#FFF" loaderColor="#257d256b" />
      ) : (
        <Table
          data={results}
          fieldKeys={[F_NAME, L_NAME, EMAIL_ID, SCORE]}
          headers={["First Name", "Last Name", "Email", "Score"]}
        />
      )}
    </>
  );
};
