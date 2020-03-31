import { useState } from "react";

export default (url, options) => {
  const [response, setResponse] = useState({ data: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async lastUrl => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(url + lastUrl, options);
      setResponse(res);
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return [{ response, loading, error }, fetchData];
};
