import { useRef, useEffect } from "react";

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
const usePrevious (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  //}, [value]);
  return ref.current;
};
export default usePrevious;
