import { Method } from "@/types/request";
import styles from "./MenubarView.module.scss";
import { ButtonBase } from "@/components/elements/button/Button";

interface RequestPreview {
  id: number;
  name: string;
  method: Method;
}

const REQUESTS_TMP: RequestPreview[] = [
  {
    id: 0,
    name: "Get google",
    method: Method.GET,
  },
  {
    id: 1,
    name: "Post google",
    method: Method.POST,
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
  return (
    <ButtonBase className={styles.requestItem}>
      <span>{request.method}</span>
      <h4>{request.name}</h4>
    </ButtonBase>
  );
};
