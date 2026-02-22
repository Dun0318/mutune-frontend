/* Header + Footer 둘다 적용 X*/
import React from 'react';
import Header from "../components/Header";

const NoFooterLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "60px" }}>{children}</main>
    </>
  );
};

export default NoFooterLayout;