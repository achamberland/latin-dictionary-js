import { Box, Button, ResponsiveContext } from "grommet";
import { Book, Columns, Menu, Table } from "grommet-icons";
import AppBar from "components/layout/appBar.js";
import { Link } from "react-router-dom";
import paths from "components/pages/paths";

export default function Header() {
  return (
    <AppBar>
      <Box>
        <Link to={paths.home}>
          <h1>Oremus</h1>
        </Link>
      </Box>
      <ResponsiveContext.Consumer>
        {size => size !== "small" ? (
          <>
            <Box>
              <Link to={paths.game}>
                <Columns />
                <span>Game</span>
              </Link>
            </Box>
            <Box>
              <Link to={paths.readHome}>
                <Book />
                <span>Read</span>
              </Link>
            </Box>
            <Box>
              <Button icon={<Table />}>
                Study
              </Button>
            </Box>
          </>
        ) : (
          <Box>
            <Button icon={<Menu />}/>
            {/* OTher stuff when opned */}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </AppBar>
  );
}
