import { useState, Suspense } from "react";
import { TabBar, TabBarItemType } from "@deskpro/deskpro-ui";
import { HomeScreen } from "../../../screens/admin/mapping/contact/HomeScreen";
import { ViewScreen } from "../../../screens/admin/mapping/contact/ViewScreen";
import { LoadingSpinner, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { Reveal } from "../../../components/Reveal/Reveal";

export const Contact = () => {
    const { context } = useDeskproLatestAppContext();

    const [activeTab, setActiveTab] = useState(0);

    const tabs: TabBarItemType[] = [
        {
            label: "Contact Home Screen",
        },
        {
            label: "Contact View Screen",
        },
    ];

    if (!context?.settings?.global_access_token) {
        return (
            <div style={{ padding: "12px" }}>
                Please sign-in as global Salesforce user before mapping fields
            </div>
        );
    }

    const homeLayout = {
        "root": [
            [
                {
                    "id": "Id",
                    "property": {
                        "name": "Id",
                        "label": "Contact ID"
                    }
                }
            ],
            [
                {
                    "id": "IsDeleted",
                    "property": {
                        "name": "IsDeleted",
                        "label": "Deleted"
                    }
                }
            ],
            [
                {
                    "id": "AccountId",
                    "property": {
                        "name": "AccountId",
                        "label": "Account ID"
                    }
                }
            ]
        ],
        "objects": [
            [
                {
                    "id": "Opportunity",
                    "property": {
                        "name": "Opportunity",
                        "label": "2. Opportunity"
                    }
                }
            ],
            [
                {
                    "id": "Account",
                    "property": {
                        "name": "Account",
                        "label": "1. Account"
                    }
                }
            ]
        ],
        "Account": [
            [
                {
                    "id": "AccountId",
                    "property": {
                        "name": "AccountId",
                        "label": "Account ID"
                    }
                },
                {
                    "id": "IsClosed",
                    "property": {
                        "name": "IsClosed",
                        "label": "Closed"
                    }
                }
            ]
        ],
        "Opportunity": [
            [
                {
                    "id": "Id",
                    "property": {
                        "name": "Id",
                        "label": "Account ID"
                    }
                },
                null
            ],
            [
                {
                    "id": "BillingCountry",
                    "property": {
                        "name": "BillingCountry",
                        "label": "Billing Country"
                    }
                },
                {
                    "id": "IsDeleted",
                    "property": {
                        "name": "IsDeleted",
                        "label": "Deleted"
                    }
                }
            ]
        ]
    };

    const viewLayout = {
        "root": [
            [
                {
                    "id": "Name",
                    "property": {
                        "name": "Name",
                        "label": "Full Name"
                    }
                },
                null
            ],
            [
                {
                    "id": "AccountId",
                    "property": {
                        "name": "AccountId",
                        "label": "Account ID"
                    }
                },
                {
                    "id": "Id",
                    "property": {
                        "name": "Id",
                        "label": "Contact ID"
                    }
                }
            ],
            [
                {
                    "id": "IsDeleted",
                    "property": {
                        "name": "IsDeleted",
                        "label": "Deleted"
                    }
                },
                {
                    "id": "MasterRecordId",
                    "property": {
                        "name": "MasterRecordId",
                        "label": "Master Record ID"
                    }
                }
            ]
        ]
    };

    return (
        <>
            <TabBar
                type="tab"
                tabs={tabs}
                activeIndex={activeTab}
                onClickTab={(index) => setActiveTab(index)}
                containerStyles={{ padding: "0 12px", justifyContent: "flex-start", marginTop: "18px", gap: "10px" }}
            />
            <Suspense fallback={<LoadingSpinner />}>
                <div style={{ padding: "16px" }}>
                    <Reveal show={activeTab === 0}>
                        <HomeScreen onChange={(layout) => console.log("HOME", layout)} value={homeLayout} />
                    </Reveal>
                    <Reveal show={activeTab === 1}>
                        <ViewScreen onChange={(layout) => console.log("VIEW", layout)} value={viewLayout} />
                    </Reveal>
                </div>
            </Suspense>
        </>
    );
};
