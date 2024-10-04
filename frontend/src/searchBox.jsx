import { Flex, Input, Space } from "antd";
import React, { useState } from "react";
import { Radio } from "antd";
import logo from "./assets/IR-logo.png";
const { Search } = Input;
const searchType1Options = [
  {
    label: "Lucene",
    value: "lucene",
  },
  {
    label: "Bert",
    value: "bert",
  },
];
const searchType2Options = [
  {
    label: "Title",
    value: "TITLE",
  },
  {
    label: "Content",
    value: "CONTENT",
  },
];
// const onSearch = (value, _e, info) => console.log(info?.source, value);
const SearchBox = (props) => (
  <Flex justify="center" direction="vertical" align="center" gap={15}>
    <img src={logo} width={180} />
    <Search
      style={{ width: "30%" }}
      placeholder="input search text"
      onSearch={props.onSearch}
      enterButton
    />
    <Radio.Group
      options={searchType1Options}
      onChange={({ target: { value } }) => {
        // console.log("radio4 checked", value);
        props.setsearchType1(value);
      }}
      value={props.searchType1}
      optionType="button"
      buttonStyle="solid"
    />
    <Radio.Group
      options={searchType2Options.map((obj) => {
        return obj;
      })}
      onChange={({ target: { value } }) => {
        // console.log("radio4 checked", value);
        props.setsearchType2(value);
      }}
      value={props.searchType2}
      optionType="button"
      buttonStyle="solid"
    />
  </Flex>
);
export default SearchBox;
