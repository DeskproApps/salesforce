import { Address as AddressType } from "../../../../api/types";
import "./Address.css";

type AddressProps = {
    address: AddressType;
};

export const Address = ({ address }: AddressProps) => (
    <address className="sf-address">
        {address.street && <AddressLine text={address.street} />}
        {address.city && <AddressLine text={address.city} />}
        {address.state && <AddressLine text={address.state} />}
        {address.postalCode && <AddressLine text={address.postalCode} />}
        {address.country && <AddressLine text={address.country} />}
    </address>
);

type AddressLineProps = {
    text?: string;
};

const AddressLine = ({ text }: AddressLineProps) => (text ? <>{text}<br /></> : null);
