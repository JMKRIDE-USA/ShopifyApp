import { useQuery, useMutation } from '@apollo/client';
import React from 'react';

import { Spinner } from '../components/loading.js';
import { DELETE_SUBSCRIPTION } from './webhooks.js';

const printGQL = q => q.loc.source.body;

export function useGetQuery(query, options = {}) {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  try {
    const { loading, error, data } = useQuery(query, options);
    if (error) {
      console.log(
        "[!] Error fetching query \"", printGQL(query) , "\":", error
      );
      return {loading, data, error, failed: true};
    }
    if (data && data.error){
      console.log(
        "[!] Error fetching query \"", printGQL(query) , "\":", data.error
      );
      return {loading, data, error: data.error, failed: true};
    }
    return {loading, data, failed: false};
  } catch (err) {
    console.log("[!] Error fetching query \"", printGQL(query) , "\":", err);
    return { loading: false, error: err, data: undefined, failed: true}
  }
}

export function QueryLoader({
  query, queryOptions, dataPropname = "data",
  cardComponent = React.Fragment, loadingComponent,
  sendLoadingState = false, children, ...props
}) {
  const {loading, data, failed, error} = useGetQuery(query, queryOptions);
  if(loading){
    if(loadingComponent) return React.createElement(loadingComponent);
    if(!sendLoadingState) return React.createElement(cardComponent, null, <Spinner/>)
  }
  if(failed) return React.createElement(
    cardComponent, null,
    <><p>Error fetching query!</p><p>{String(error)}</p></>
  )
  return React.createElement(cardComponent, null,
    React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {[dataPropname]: data, ...(sendLoadingState ? {[dataPropname + "Loading"]: loading} : {}), ...props})
      }
      return child;
    })
  )
}

export function createMutationCall(mutation, mutationVerb) {
  const { mutateAsync, error, status } = useMutation(DELETE_SUBSCRIPTION);
  return async (to_submit) => {
    let result;
    try {
      result = await mutateAsync({to_submit})
    } catch (error) {
      console.log("[!] Error", mutationVerb, ":", error);
      return {result: false, status};
    }
    if (error){
      console.log("[!] Error", mutationVerb, ":", error);
      return {result: false, status};
    }
    if (!result || result.error || !result.ok){
      console.log("[!] Error", mutationVerb, ":", result.status, result?.error);
      return {result: false, status};
    }
    if (result) {
      return {result, status};
    }
    return {result: false, status};
  }
}