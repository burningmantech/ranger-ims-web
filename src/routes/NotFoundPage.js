import Page from "../components/Page";


const NotFoundPage = (props) => {
  return (
    <Page>
      Resource not found: <code>{window.location.href}</code>
    </Page>
  );
}

export default NotFoundPage;
