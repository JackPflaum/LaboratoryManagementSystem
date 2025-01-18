import NavigationSidebar from "./NavigationSidebar";

interface LayoutProps {
    toggleTheme: () => void;
};

const Layout = ({ toggleTheme }: LayoutProps) => {

    return (
        <NavigationSidebar toggleTheme={toggleTheme} />
    );
};

export default Layout;