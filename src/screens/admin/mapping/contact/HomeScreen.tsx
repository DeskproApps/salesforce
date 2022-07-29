import {Stack, H1, P1, useDeskproAppTheme, Spinner} from "@deskpro/app-sdk";
import {QueryKey} from "../../../../query";
import {getObjectMetaPreInstalled} from "../../../../api/preInstallationApi";
import {Properties, PropertyLayout} from "../../../../components/Mapper/PropertyLayout";
import {FieldProperty, HomeLayout, LinkedObjects, ObjectProperty} from "../../types";
import {useAdminQuery} from "../../hooks";
import {fieldToPropertyMapper, linkedObjectsToProperties} from "../../utils";
import {useState, Suspense, useCallback, useEffect} from "react";
import {LinkedObjectPropertyLayout} from "../../../../components/LinkedObjectPropertyLayout";

const linkedObjectOptions: LinkedObjects = {
    AccountID: ["Account", "Account"],
    Opportunity: ["Opportunities", "Opportunity"],
    OwnerID: ["Owner", "User"],
    Note: ["Notes", "Note"],
};

type HomeScreenProps = {
    onChange: (layout: HomeLayout) => void;
    value?: HomeLayout;
};

export const HomeScreen = ({ onChange, value = { root: [], objects_order: [], objects: {} } }: HomeScreenProps) => {
    const { theme } = useDeskproAppTheme();

    const [layout, setLayout] = useState<HomeLayout>(value);

    useEffect(() => {
        onChange(layout);
    }, [layout, onChange]);

    const meta = useAdminQuery(
        [QueryKey.OBJECT_META, "Contact"],
        (client, context) => getObjectMetaPreInstalled(client, context?.settings, "Contact"),
    );

    const setRootLayout = useCallback(
        (properties) => setLayout((layout) => ({ ...layout, root: properties })),
        []
    );

    const setObjectsOrderLayout = useCallback(
        (properties) => {
            setLayout((layout) => {
                return { ...layout, objects_order: properties };
            });
        },
        []
    );

    const setObjectsLayout = useCallback(
        (properties: Properties<FieldProperty>, name :string) => {
            setLayout((layout) => ({
                ...layout,
                objects: {
                    ...layout.objects,
                    [name]: properties,
                }
            }));
        },
        []
    );

    if (!meta.isSuccess) {
        return null;
    }

    const contactFieldOptions = meta.data.fields.map(fieldToPropertyMapper);

    const objectOptions = linkedObjectsToProperties(linkedObjectOptions);

    return (
        <Stack gap={22} vertical>
            <Stack gap={6} style={{ width: "100%" }} vertical>
                <H1>Contact Details</H1>
                <P1>Fields</P1>
                <PropertyLayout<FieldProperty>
                    options={contactFieldOptions}
                    propertyId={(option) => option.name}
                    propertyLabel={(option) => option.label}
                    onChange={setRootLayout}
                    maxColumns={2}
                    value={layout.root}
                />
            </Stack>
            <Stack gap={6} style={{ width: "100%" }} vertical>
                <H1>Linked Objects to Display</H1>
                <P1 style={{ color: theme.colors.grey80 }}>
                    Chose the related objects you want to list on the Contact Home Screen. This is the screen agent
                    will see first when loading app on user profile.
                </P1>
                <PropertyLayout<ObjectProperty>
                    options={objectOptions}
                    propertyId={(option) => option.name}
                    propertyLabel={(option) => option.label}
                    onChange={setObjectsOrderLayout}
                    maxColumns={1}
                    labelFormat={(label, idx) => `${idx + 1}. ${label}`}
                    value={layout.objects_order}
                />
            </Stack>
            {(layout.objects_order ?? []).map(([linkedObject], idx) => (
                linkedObject?.property && (
                    <Suspense fallback={<Spinner size="small" />} key={linkedObject.property.name}>
                        <LinkedObjectPropertyLayout
                            object={linkedObject.property.object}
                            name={linkedObject.property.name}
                            label={`${idx + 1}. ${linkedObject.property.label} Details`}
                            value={layout.objects[linkedObject.property.name]}
                            onChange={setObjectsLayout}
                        />
                    </Suspense>
                )
            ))}
        </Stack>
    );
};
