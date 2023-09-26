import NavbarNew from "./NavbarNew";
import { Box } from "./Box";
import {useTheme } from "@nextui-org/react";
import { useRouter } from "next/router"; // Importa el hook useRouter de Next.js

const Layout = ({ children }) => {

  const router = useRouter(); // Obtiene la información de la ruta actual
  const {theme} = useTheme();

  const routesWithoutNavbar = ["/Login", "/RecuperacionPassword", "/CambioPassword"];

  const shouldHideNavbar = routesWithoutNavbar.includes(router.pathname);
  return (
    <>
      {shouldHideNavbar ? null : <NavbarNew />} {/* Oculta la Navbar si shouldHideNavbar es verdadero */}
      <Box
        css={{
          maxW: "100%",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default Layout;
