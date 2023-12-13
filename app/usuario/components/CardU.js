import { useState, useEffect, useRef } from "react";
import { useSession } from 'next-auth/react';
import style from "./style/CardU.module.css";
import {Card, CardHeader, CardBody, CardFooter, Divider , Skeleton, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Input, Link} from '@nextui-org/react';
import { toast } from "react-toastify";
import Image from "next/image"

export default function CardU({user}) {
  const { data: session, status } = useSession();
  const [usrData, setUsrData] = useState({});
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();
  const [correctPass, setCorrectPass] = useState(false);
  const [pass, setPass] = useState("");
  const [editUsrName, setEditUsrName] = useState(false)
  const [editingData, setEditingData] = useState({
    id: null,
    nombre: '',
    username: '',
    password: ''
  });
  const [imagePath, setImagePath] = useState("https://avatars.githubusercontent.com/u/86160567?s=200&v=4");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setUsrData(user)
  }, [user]);

  const handleUsernameChange = (e) => {
    const inputValue = e.target.value;
    setEditingData((prevData) => ({
      ...prevData,
      username: user? user.username : "Sin cargar",
      nombre: user? user.nombre : "Sin cargar",
      id: user? user.id : "Sin cargar",
      username: inputValue
    }))
  }

  const handlePassChange = (e) => {
    const inputValue = e.target.value;
    setEditingData((prevData) => ({
      ...prevData,
      username: user? user.username : "Sin cargar",
      nombre: user? user.nombre : "Sin cargar",
      id: user? user.id : "Sin cargar",
      password: inputValue
    }))
  }

  const handlePass2Change = (e) => {
    const inputValue = e.target.value;
    setPass(inputValue)
  }

  const validarDatos = async () => {
    try {
      const formData = new FormData();
      formData.append('id', editingData.id);
      formData.append('nombre', editingData.nombre);
      formData.append('username', editingData.username);
      formData.append('password', editingData.password);
  
      // Verifica si la contraseña se está modificando
      const isChangingPassword = editingData.password !== user.password;
  
      if (isChangingPassword) {
        if (editingData.password !== pass) {
          toast.error("Las contraseñas deben coincidir");
          return;
        }
      }
  
      const response = await fetch(`/api/usuario/credenciales/${editingData.id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        toast.success("Credenciales actualizadas.");
        setPass("");
        setCorrectPass(false);
        onClose();
      } else {
        toast.error("Ocurrió un error al actualizar los datos.");
      }
    } catch (error) {
      console.error("Hubo un error al conectar con el API: ", error);
    }
  };
  
  const handleButtonClick = async () => {
    // Simular el clic en el input de tipo 'file'
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    // Acceder al archivo seleccionado
    const selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
  };

  useEffect(() => {
    setCorrectPass(false)
    if(user){
      if(editingData.username != user.username){
        setEditUsrName(true)
      }else{
        setEditUsrName(false)
      }
    }
  }, [editingData])

  useEffect(() => {
    if(user){
      if(editingData.password == pass){
        setCorrectPass(true)
      }else{
        setCorrectPass(false)
      }
    }
    
  }, [pass, editingData.password])
  
  useEffect(() => {
    console.log(selectedFile)
  }, [selectedFile])

  const handleEditSave = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('id',user.id)

      const response = await fetch(`/api/usuario/profilePick/${user.id}`, {
        method: 'PUT',
        /*headers: {
          'Content-Type': 'application/json',
        },*/
        body: formData,
      });

      if (response.ok) {
        window.location.reload()
        onClose();
      } else {
        console.log("Hubo un error al conectar con el api")
      }
    } catch (error) {
      console.log("Hubo un error al conectar con el api: ", error)
    }
  }
  

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (session && usrData && usrData.img) {
          // Utiliza import() para cargar la imagen de forma asíncrona
          const dynamicImage = await import(`../../resources/${usrData.id}/profilePick/${usrData.img}`);
          setImagePath(dynamicImage.default);
          setEditingData(usrData)
        }
      } catch (error) {
        // Manejar el error, por ejemplo, imprimir un mensaje en la consola
        console.error(`Error cargando la imagen: ${error.message}`);
      }
    };
  
    loadImage();
  }, [session, usrData]);

  
  console.log(imagePath)
  return (
    <Card className={`${style.cardF}`}>
      <CardHeader className="flex gap-3 justify-end">
        <div className={style.avatarContainer}>
          <Image
            onClick={onOpenChangeEdit}
            className={style.imgUsr}
            src={imagePath}
            alt="Avatar"
            width={50}
            height={50}
          />
        </div>
        <div className="flex flex-col w-full">
          <p className="text-right min-w-full ">{session ? session.user.username : <Skeleton className='rounded-lg'>.</Skeleton>}</p>
          <p className="text-small text-default-500 min-w-full text-right">{session ? session.user.email : <Skeleton className='rounded-lg'>.</Skeleton>}</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <div className=" w-full h-full">
          <div className="container text-left w-full h-1/6">
            <p>Resumen del trabajador:</p>
          </div>
          <div className="w-full h-5/6 text-left pt-5">
            <p><span className="font-bold">Nombre:</span> {user? user.nombre : "Cargando resumen.."}</p>
            <p><span className="font-bold">Telefono:</span> {user? user.celular: "Cargando resumen.."}</p>
            <p><span className="font-bold">Puesto:</span> {user? user.puesto : "Cargando resumen.."}</p>
            <p><span className="font-bold">Horario:</span> {user? user.horario : "Cargando resumen"}</p>
            <p><span className="font-bold">Estado:</span> {user? user.estado : "Cargando resumen"}</p>
          </div>
        </div>
      </CardBody>
      <Divider/>
      <CardFooter>
        <Button color="primary" variant="flat" className="" onClick={onOpenAdd}>
          Cambiar nombre de usuario o contraseña
        </Button>
      </CardFooter>
      <Modal 
        isOpen={isOpenAdd}
        onOpenChange={onOpenChangeAdd}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cambiar nombre de usuario o contraseña</ModalHeader>
              <ModalBody>
                <Input
                  onChange={handleUsernameChange}
                  autoFocus
                  label="Nombre de usuario"
                  value={editingData.username}
                  placeholder={editingData.username}
                  variant="bordered"
                  color={editUsrName? 'warning' : 'default'}
                />
                <Input
                  onChange={handlePassChange}
                  label="Contraseña"
                  type="password"
                  value={editingData.password}
                  variant="bordered"
                  color={correctPass ? 'success' : 'danger'}
                />
                <Input
                  onChange={handlePass2Change}
                  label="Confirma tu contraseña"
                  type="password"
                  variant="bordered"
                  color={correctPass ? 'success' : 'danger'}
                />
                <h1>Deja los espacios en blanco para mantener</h1>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="ghost" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="success" variant="ghost" onPress={onClose} onClick={() => validarDatos()}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal 
        isOpen={isOpenEdit}
        onOpenChange={onOpenChangeEdit}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Reemplazar foto de perfil</ModalHeader>
              <ModalBody>
                <div className="container  w-full h-100  justify-center flex ">
                  <Image
                    className={style.rounded}
                    alt="nextui logo"
                    height={200}
                    radius="sm"
                    src={imagePath}
                    width={200}
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Button color='secondary' onClick={ handleButtonClick}>Seleccionar foto del usuario </Button>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="ghost" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="success" variant="ghost" onPress={onClose} onClick={handleEditSave} >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
