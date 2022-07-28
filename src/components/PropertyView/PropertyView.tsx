import {Property, Spinner, useDeskproLatestAppContext} from "@deskpro/app-sdk";
import {FieldType, ObjectMeta} from "../../api/types";
import {useQueryWithClient} from "../../hooks";
import {QueryKey} from "../../query";
import {getObjectMeta} from "../../api/api";
import {getFieldByName} from "../../screens/admin/utils";
import {match, P} from "ts-pattern";
import {Suspense} from "react";
import {Address} from "./fields/Address/Address";
import {User} from "./fields/User/User";
import {Account} from "./fields/Account/Account";
import {PropertyEmpty} from "../PropertyEmpty/PropertyEmpty";
import {Boolean} from "./fields/Boolean/Boolean";
import {DateTime} from "./fields/DateTime/DateTime";
import {Contact} from "./fields/Contact/Contact";
import {OnlyDate} from "./fields/Date/Date";
import {LayoutObject} from "../types";
import {Currency} from "./fields/Currency/Currency";
import {ExternalLink} from "../ExternalLink/ExternalLink";
import {Link} from "../Link/Link";
import {Email} from "./fields/Email/Email";

type PropertyViewProps = {
    name: string;
    object: LayoutObject;
    isFirst: boolean;
    internalUrl?: string;
    externalUrl?: string;
};

export const PropertyView = ({ name, object, internalUrl, externalUrl, isFirst }: PropertyViewProps) => {
    const { context } = useDeskproLatestAppContext();

    const meta = useQueryWithClient<ObjectMeta>(
        [QueryKey.ADMIN_OBJECT_META, object.attributes.type],
        (client) => getObjectMeta(client, object.attributes.type),
    );

    if (!context?.settings) {
        return null;
    }

    if (!meta.isSuccess) {
        return null;
    }

    const fieldMeta = getFieldByName(meta.data, name);

    const label = fieldMeta?.label.replace(" ID", "");

    // eslint-disable-next-line
    const value: any = object[name];

    if (!value) {
        return (
            <Property title={label}>
                <PropertyEmpty />
            </Property>
        );
    }

    const property = match<[FieldType|undefined, string[]|undefined]>([fieldMeta?.type, fieldMeta?.referenceTo])
        .with(["address", P._], () => (
            <Address address={value} />
        ))
        .with(["boolean", P._], () => (
            <Boolean value={value} />
        ))
        .with(["datetime", P._], () => (
            <DateTime value={value} />
        ))
        .with(["date", P._], () => (
            <OnlyDate value={value} />
        ))
        .with(["email", P._], () => (
            <Email value={value} />
        ))
        .with(["currency", P._], () => (
            <Currency value={value} />
        ))
        .with(["reference", ["User"]], () => (
            <Suspense fallback={<Spinner size="extra-small" />}>
                <User id={value} settings={context.settings} />
            </Suspense>
        ))
        .with(["reference", ["Account"]], () => (
            <Suspense fallback={<Spinner size="extra-small" />}>
                <Account id={value} settings={context.settings} />
            </Suspense>
        ))
        .with(["reference", ["Contact"]], () => (
            <Suspense fallback={<Spinner size="extra-small" />}>
                <Contact id={value} settings={context.settings} />
            </Suspense>
        ))
        .otherwise(() => (
            <>
                {value ?? <PropertyEmpty />}
            </>
        ))
    ;

    return (
        <Property title={label}>
            {(isFirst && internalUrl) ? <Link to={internalUrl}>{property}</Link> : property}
            {(isFirst && externalUrl) && <ExternalLink url={externalUrl} style={{ marginLeft: "6px" }} />}
        </Property>
    );
};

