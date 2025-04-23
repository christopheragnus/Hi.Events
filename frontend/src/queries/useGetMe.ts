import {useQuery} from "@tanstack/react-query";
import {User} from "../types.ts";
import {GenericDataResponse} from "../types";
import {userClient} from "../api/user.client.ts";

export const GET_ME_QUERY_KEY = 'getMe';

export const useGetMe = () => {
    return useQuery<GenericDataResponse<User>, Error>({
        queryKey: [GET_ME_QUERY_KEY],
        queryFn: async () => {
            const response = await userClient.me();
            return response;
        },
        retry: 1,
        enabled: true,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    });
};
