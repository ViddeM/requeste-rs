import { Method } from "@/types/request";
import styles from "./MenubarView.module.scss";
import { ButtonBase } from "@/components/elements/button/Button";
import { useRequest } from "@/hooks/useRequest";
import { Request } from "@/types/request";

interface RequestPreview {
  id: number;
  name: string;
  request: Request;
}

const REQUESTS_TMP: RequestPreview[] = [
  {
    id: 0,
    name: "Get google",
    request: {
      url: "https://google.com",
      method: Method.GET,
      headers: [],
      body: "",
    },
  },
  {
    id: 1,
    name: "Post facebook",
    request: {
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
  return (
    <div className={styles.menuBar}>
      <div className={styles.menuHeader}>
        <h3>Requests</h3>
      </div>
      {REQUESTS_TMP.map((req) => (
        <RequestItem request={req} key={req.id} />
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
      <span>{request.request.method}</span>
      <h4>{request.name}</h4>
    </ButtonBase>
  );
};
