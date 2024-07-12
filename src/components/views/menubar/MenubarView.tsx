import { Method } from "@/types/request";
import styles from "./MenubarView.module.scss";
import { Button, ButtonBase } from "@/components/elements/button/Button";
import { useRequest } from "@/hooks/useRequest";
import { Request } from "@/types/request";
import { useState } from "react";

interface RequestPreview {
  name: string;
  request: Request;
}

const REQUESTS_TMP: RequestPreview[] = [
  {
    name: "Get google",
    request: {
      id: "0",
      url: "https://google.com",
      method: Method.GET,
      headers: [],
      body: "",
    },
  },
  {
    name: "Post facebook",
    request: {
      id: "1",
      url: "https://facebook.com",
      method: Method.POST,
      headers: [
        {
          name: "Content-Length",
          value: "240",
        },
      ],
      body: "",
    },
  },
];

export const MenubarView = () => {
  const [savedRequests, setSavedRequests] =
    useState<RequestPreview[]>(REQUESTS_TMP);

  const defaultRequest = (): RequestPreview => {
    return {
      name: "NEW",
      request: {
        id: savedRequests.length.toString(),
        url: "",
        method: Method.GET,
        headers: [],
        body: "",
      },
    };
  };

  return (
    <div className={styles.menuBar}>
      <div className={styles.menuHeader}>
        <h3>Requests</h3>
      </div>
      <div className="column">
        <Button
          onClick={() => setSavedRequests([...savedRequests, defaultRequest()])}
        >
          Add request
        </Button>
      </div>
      {savedRequests.map((req) => (
        <RequestItem request={req} key={req.request.id} />
      ))}
    </div>
  );
};

const RequestItem = ({ request }: { request: RequestPreview }) => {
  const { setUrl, setHeaders, setMethod } = useRequest();

  return (
    <ButtonBase
      className={styles.requestItem}
      onClick={() => {
        setUrl(request.request.url);
        setHeaders(request.request.headers);
        setMethod(request.request.method);
      }}
    >
      <h3 className={`color-method-${request.request.method.toLowerCase()}`}>
        {request.request.method}
      </h3>
      <h4>{request.name}</h4>
    </ButtonBase>
  );
};
