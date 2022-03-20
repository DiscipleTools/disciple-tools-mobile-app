import useList from './use-list';

const useMetric = ({ filter, type }) => {
  const { data, error, isLoading, isValidating, mutate } = useList({ filter, type });
  if (!data) return null;
  return data?.length;
};
export default useMetric;