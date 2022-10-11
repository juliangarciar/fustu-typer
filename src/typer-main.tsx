import { FC } from "react";
import { UsersControllerQuery } from "./api/axios-client";
import { TyperLogin } from "./login/typer-login";
import { TyperGame } from "./typer/typer-game";

export const TyperMain: FC = () => {
    const { data, refetch } = UsersControllerQuery.useMeQuery();
    
    if (!data?.email) {
        return (
            <TyperLogin />
        );
    } else {
        return (
            <TyperGame />
        );
    }
}