import BagTable from "../components/BagTable";
import Page from "../components/Page";

const AdminPage = (props) => {
  return (
    <Page>
      <h1>Admin Console</h1>
      <BagTable />
    </Page>
  );
};

export default AdminPage;
