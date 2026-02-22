/* Header + Footer 둘다 적용할 시*/
import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "60px" }}>{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
