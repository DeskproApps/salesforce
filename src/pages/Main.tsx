import {useMemo} from "react";
import {GlobalSignIn} from "./GlobalSignIn";

export const Main = () => {
    const dispatchPage = useMemo(
        () => new URLSearchParams(window.location.search).get("__p"),
        []
    );

    if (dispatchPage === "global_sign_in") {
        return (<GlobalSignIn />);
    }

    return (
        <div>Salesforce App</div>
    );
};
