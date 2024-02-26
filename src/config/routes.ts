import Home from '../pages/Home'
import MemViewer from '../pages/MemViewer'
import About from '../pages/About'

interface RouteType {
    path: string,
    component: () => JSX.Element,
    name: string
}

const routes: RouteType[] = [
    {
      path: "",
      component: Home,
      name: "Home Screen",
    },
    {
      path: "/memviewer",
      component: MemViewer,
      name: "Memory Viewer",
    },
    {
      path: "/about",
      component: About,
      name: "About",
    }
];

export default routes