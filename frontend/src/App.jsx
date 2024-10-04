import Pagenation from "./pagenation.jsx";
import SearchBox from "./searchBox.jsx";
import React, { useEffect, useState } from "react";
import { Alert, Flex, Spin } from "antd";

function App() {
  const [searchType1, setsearchType1] = useState("lucene");
  const [searchType2, setsearchType2] = useState("TITLE");
  const [queryResults, setqueryResults] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const querySearch = (value) => {
    setisLoading(true);
    setqueryResults([]);
    fetch(`/${searchType1}?query=${value}&search=${searchType2}`)
      // .catch(() => {
      //   setqueryResults([]);
      //   setisLoading(false);
      // })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setqueryResults(res);
        setisLoading(false);
      })
      .catch(() => {
        setqueryResults([]);
        setisLoading(false);
      });
  };
  useEffect(() => {
    setqueryResults([]);
  }, [searchType1, searchType2]);
  useEffect(() => {
    searchType1 === "bert" && setsearchType2("TITLE");
  }, [searchType1]);
  return (
    <>
      <SearchBox
        onSearch={querySearch}
        searchType1={searchType1}
        setsearchType1={setsearchType1}
        searchType2={searchType2}
        setsearchType2={setsearchType2}
        isBert={searchType1 == "bert"}
      />
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin tip="Loading" size="large" />
        </div>
      ) : (
        <Pagenation data={queryResults} />
      )}
    </>
  );
}

export default App;
