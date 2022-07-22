import { Address as AddressType } from "../../../../api/types";
import "./Address.css";

type AddressProps = {
    address: AddressType;
};

export const Address = ({ address }: AddressProps) => (
    <address className="sf-address">
        <AddressLine text={address.street} />
        <AddressLine text={address.city} />
        <AddressLine text={address.state} />
        <AddressLine text={address.postalCode} />
        <AddressLine text={address.country} />
    </address>
);

type AddressLineProps = {
    text?: string;
};

const AddressLine = ({ text }: AddressLineProps) => (text ? <>{text}<br /></> : null);
