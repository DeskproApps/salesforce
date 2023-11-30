import {
  LoadingSpinner,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { TabBar, TabBarItemType } from "@deskpro/deskpro-ui";
import { Suspense, useCallback, useState } from "react";
import { Reveal } from "../../../components/Reveal/Reveal";
import defaultLayout from "../../../resources/default_layout/account.json";
import { HomeScreen } from "../../../screens/admin/mapping/account/HomeScreen";
import { ViewScreen } from "../../../screens/admin/mapping/account/ViewScreen";
import { HomeLayout, ViewLayout } from "../../../screens/admin/types";
import { AccountLayout, Settings } from "../../../types";

export const Account = () => {
  const [settings, setSettings] = useState<Settings>();

  const [activeTab, setActiveTab] = useState(0);

  const [layout, setLayout] = useState<AccountLayout>(
    settings?.mapping_account
      ? JSON.parse(settings.mapping_account)
      : defaultLayout
  );

  useDeskproAppEvents({
    onAdminSettingsChange: (settings) => {
      setSettings(settings);
    },
  });

  useInitialisedDeskproAppClient(
    (client) => {
      client.setAdminSetting(JSON.stringify(layout));
    },
    [layout]
  );

  const setHomeLayout = useCallback(
    (home: HomeLayout) =>
      setLayout((layout) => ({
        ...layout,
        home,
      })),
    []
  );

  const setViewLayout = useCallback(
    (view: ViewLayout) =>
      setLayout((layout) => ({
        ...layout,
        view,
      })),
    []
  );

  const tabs: TabBarItemType[] = [
    {
      label: "Account Home Screen",
    },
    {
      label: "Account View Screen",
    },
  ];

  if (!settings) {
    return null;
  }

  if (!settings?.global_access_token) {
    return (
      <div style={{ padding: "12px" }}>
        Please sign-in as global Salesforce user before mapping fields
      </div>
    );
  }

  return (
    <>
      <TabBar
        type="tab"
        tabs={tabs}
        activeIndex={activeTab}
        onClickTab={(index) => setActiveTab(index)}
        containerStyles={{
          padding: "0 12px",
          justifyContent: "flex-start",
          marginTop: "18px",
          gap: "10px",
        }}
      />
      <Suspense fallback={<LoadingSpinner />}>
        <div style={{ padding: "16px" }}>
          <Reveal show={activeTab === 0}>
            <HomeScreen onChange={setHomeLayout} value={layout.home} />
          </Reveal>
          <Reveal show={activeTab === 1}>
            <ViewScreen onChange={setViewLayout} value={layout.view} />
          </Reveal>
        </div>
      </Suspense>
    </>
  );
};
