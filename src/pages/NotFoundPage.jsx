import { useLocation } from "react-router-dom";

import Page from "../components/Page";

const NotFoundPage = () => {
  const location = useLocation();

  return (
    <Page>
      Resource not found: <code>{location.pathname}</code>
    </Page>
  );
};

export default NotFoundPage;
