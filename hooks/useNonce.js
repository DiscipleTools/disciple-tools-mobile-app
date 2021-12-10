import React, { createContext, useContext, useState } from "react";

export const NonceContext = createContext();

export const NonceProvider = ({ children }) => {
  const [nonce, setNonce] = useState(null);
  return (
    <NonceContext.Provider value={{ nonce, setNonce }}>
      {children}
    </NonceContext.Provider>
  );
};
const useNonce = () => useContext(NonceContext);
export default useNonce;