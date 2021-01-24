import React, { useState, useEffect } from "react";
import axios from "axios";
import { set } from "idb-keyval";

import BooksTable from "./components/bookstable/BooksTable";

const Landing = () => {
  let [booksData, setBooksData] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/books8f8fe52.json"
      )
      .then((response) => {
        console.log("response", response.data);
        set("allBooks", response.data);
        setBooksData(response.data);
      })
      .catch((error) => {
        setBooksData([]);
      });
  }, []);

  if (booksData.length > 0) {
    return (
      <React.Fragment>
        <BooksTable booksData={booksData} />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <BooksTable booksData={booksData} />
      </React.Fragment>
    );
  }
};

export default Landing;
