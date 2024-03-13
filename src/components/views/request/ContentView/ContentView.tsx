import { Tabs } from "@/components/elements/tabs/Tabs";
import { useState } from "react";
import {
  RequestHeadersProps,
  RequestHeadersView,
} from "./RequestHeadersView/RequestHeadersView";
import { RequestBodyView } from "./RequestBodyView/RequestBodyView";

type ContentViewProps = {} & RequestHeadersProps;

type RequestViewPane = "body" | "headers";
const ALL_REQUEST_VIEWS: RequestViewPane[] = ["body", "headers"];

export const ContentView = ({ ...props }: ContentViewProps) => {
  const [requestView, setRequestView] = useState<RequestViewPane>("body");

  return (
    <div>
      <Tabs
        values={ALL_REQUEST_VIEWS}
        activeTab={requestView}
        standalone={true}
        setActiveTab={setRequestView}
        display={(v) => v.toUpperCase()}
      />
      {requestView === "body" ? (
        <RequestBodyView />
      ) : (
        <RequestHeadersView {...props} />
      )}
    </div>
  );
};
