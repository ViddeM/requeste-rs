"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import { ResponseView } from "@/components/views/response/ResponseView";
import { Response } from "@/types/response";
import { RequestView } from "@/components/views/request/RequestView";
import { MenubarView } from "@/components/views/menubar/MenubarView";

export default function Home() {
  const [response, setResponse] = useState<Response | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  return (
    <main className={styles.main}>
      <MenubarView />
      <RequestView
        setResponse={(resp) => setResponse(resp)}
        setRequestError={(err) => setRequestError(err)}
      />
      <ResponseView response={response} requestError={requestError} />
    </main>
  );
}
