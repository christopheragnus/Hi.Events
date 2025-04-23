import {useQuery} from "@tanstack/react-query";
import {GenericPaginatedResponse, IdParam, TaxAndFee} from "../types.ts";
import {taxAndFeeClient} from "../api/tax-and-fee.client.ts";
import {useGetMe} from "./useGetMe.ts";

export const GET_TAXES_AND_FEES_QUERY_KEY = 'getTaxesAndFees';

export const useGetTaxesAndFees = ()  => {
    const meQuery = useGetMe();
    const accountId = meQuery.data?.data?.id as IdParam;

    console.log('useGetTaxandFees', meQuery)

    return useQuery<GenericPaginatedResponse<TaxAndFee>>({
            queryKey: [GET_TAXES_AND_FEES_QUERY_KEY, accountId],
            enabled: meQuery.isFetched,
            queryFn: async () => await taxAndFeeClient.all(accountId),
        }
    )
}