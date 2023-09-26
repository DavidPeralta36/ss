import {
  useTheme,
  Navbar,
  Link,
  Text,
  Avatar,
  Dropdown,
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../public/trc.png";

export default function NavbarNew() {
  //Añade en este array el titulo de tu pestaña y el link *Utiliza la propiedad "dropdownItems" para generar un dropdownlist *
  const collapseItems = [
    { title: "Inicio", link: "/" },
    { title: "Cuestionarios", link: "/Cuestionarios" },
    { title: "Manuales", link: "#" },
    {
      title: "Administración",
      link: "/Administracion",
      dropdownItems: ["Usuarios", "Permisos", "Indicadores"],
    },
    
  ];

  const router = useRouter();
  const { theme } = useTheme();

  return (
    <Navbar isBordered shouldHideOnScroll variant="sticky">
      <Navbar.Toggle showIn="xs" />
      <Navbar.Brand
        css={{
          "@xs": {
            w: "12%",
          },
        }}
      >
        <Image
          src={logo}
          alt="LogoTRC"
          width="60"
          height="48"
          className="LogoTRC d-inline-block align-text-top me-3"
        />
        <Text b color="inherit" hideIn="xs">
          Televisión y Radio de Campeche
        </Text>
      </Navbar.Brand>
      <Navbar.Content
        //Estas son las propiedades del navbar, podriamos quitar algunas para evitar un par de bugs con el mismo
        enableCursorHighlight
        activeColor="error"
        hideIn="xs"
        variant="highlight"
      >
        {collapseItems.map((item, index) =>
          !item.dropdownItems ? (
            <Navbar.Link
              isActive={router.pathname === item.link}
              key={index}
              href={item.link}
            >
              {item.title}
            </Navbar.Link>
          ) : (
            <Dropdown placement="bottom-right" key={index}>
              <Navbar.Item>
                <Dropdown.Trigger
                  css={{ display: "flex", alignItems: "center" }}
                >
                  <Text
                    b
                    css={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.title}
                  </Text>
                </Dropdown.Trigger>
              </Navbar.Item>
              <Dropdown.Menu
                aria-label="User menu actions"
                color="error"
                onAction={(actionKey) => console.log({ actionKey })}
              >
                {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                  <Dropdown.Item key={dropdownIndex}>
                    <Link
                      color="inherit"
                      css={{
                        minWidth: "100%",
                      }}
                      href={`${item.link.toLocaleLowerCase()}/${dropdownItem.toLocaleLowerCase()}`}
                    >
                      {dropdownItem}
                    </Link>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ),
        )}
      </Navbar.Content>
      <Navbar.Content
        css={{
          "@xs": {
            w: "12%",
            jc: "flex-end",
          },
        }}
      >
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <Avatar
                bordered
                as="button"
                color="error"
                size="md"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu
            aria-label="User menu actions"
            color="error"
            onAction={(actionKey) => router.push(actionKey)}
          >
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Sesion iniciada como: 
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                trabajador@example.com
              </Text>
            </Dropdown.Item>
            <Dropdown.Item
              key="/FichaUsuario"
              withDivider
              onClick={() => router.push("/FichaUsuario")}
            >
              Perfil
            </Dropdown.Item>
            <Dropdown.Item key="/Formacion">
              Formacion y educacion.
            </Dropdown.Item>
            <Dropdown.Item key="/Incidencias">Incidencias</Dropdown.Item>
            <Dropdown.Item key="system" withDivider>
              Sistema
            </Dropdown.Item>
            <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
            <Dropdown.Item key="help_and_feedback" withDivider>
              Ayuda y comentarios
            </Dropdown.Item>
            {/*Quitado de mientras key="logout" */}
            <Dropdown.Item
              key="/Login"
              withDivider
              onClick={() => router.push("/Login")}
              color="error"
            >
              Cerrar sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>
      <Navbar.Collapse>
        {collapseItems.map((item, index) => (
          <Navbar.CollapseItem
            key={index}
            activeColor="error"
            css={{
              color: index === collapseItems.length - 1 ? "$error" : "",
            }}
            isActive={index === 2}
          >
            <Link
              color="inherit"
              css={{
                minWidth: "100%",
              }}
              href="#"
            >
              {item.title}
            </Link>
          </Navbar.CollapseItem>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
