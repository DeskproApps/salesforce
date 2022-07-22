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

type PropertyViewProps = {
    name: string;
    object: LayoutObject;
};

export const PropertyView = ({ name, object }: PropertyViewProps) => {
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

    return match<[FieldType|undefined, string[]|undefined]>([fieldMeta?.type, fieldMeta?.referenceTo])
        .with(["address", P._], () => (
            <Property title={label}>
                <Address address={value} />
            </Property>
        ))
        .with(["boolean", P._], () => (
            <Property title={label}>
                <Boolean value={value} />
            </Property>
        ))
        .with(["datetime", P._], () => (
            <Property title={label}>
                <DateTime value={value} />
            </Property>
        ))
        .with(["date", P._], () => (
            <Property title={label}>
                <OnlyDate value={value} />
            </Property>
        ))
        .with(["currency", P._], () => (
            <Property title={label}>
                <Currency value={value} />
            </Property>
        ))
        .with(["reference", ["User"]], () => (
            <Suspense fallback={<Spinner size="extra-small" />}>
                <Property title={label}>
                    <User id={value} settings={context.settings} />
                </Property>
            </Suspense>
        ))
        .with(["reference", ["Account"]], () => (
            <Suspense fallback={<Spinner size="extra-small" />}>
                <Property title={label}>
                    <Account id={value} settings={context.settings} />
                </Property>
            </Suspense>
        ))
        .with(["reference", ["Contact"]], () => (
            <Suspense fallback={<Spinner size="extra-small" />}>
                <Property title={label}>
                    <Contact id={value} settings={context.settings} />
                </Property>
            </Suspense>
        ))
        .otherwise(() => (
            <Property title={label}>
                {value ?? <PropertyEmpty />}
            </Property>
        ))
    ;
};

