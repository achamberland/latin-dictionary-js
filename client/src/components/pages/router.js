import { Route, Routes } from "react-router-dom";
import DiscernPage from "components/pages/game/games/discern/discernPage.js";
import paths from "components/pages/paths.js";
import ReadHome from "components/pages/read/readHome.js";
import ReadTranslationPage from "components/pages/read/translationPage/translationPage";

/*
 * If this app grows in size, add a second layer of routers
 * to each subdirectory.
 */
export default function Router() {
  return (
    <div>
      Router
      <Routes>
        <Route path={paths.home} element={<ReadHome/>} /> {/* Temporary */}
        <Route path={paths.game} element={<DiscernPage/>} />
        <Route path={paths.readHome} element={<ReadHome/>} />
        <Route path={paths.readTranslation} element={<ReadTranslationPage/>} />
      </Routes>
    </div>
  )
}