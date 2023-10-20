import React,{useState} from 'react';
import style from './style/personalData.module.css';
import CardU from './CardU';

const PersonalData = ({user}) => {
  
  return (
    <div className={`${style.personalData}`}>
      <div className={`flex justify-between h-full ${style.prueba}`}>
        <div className='w-1/2'>
          <div className=''>
            <p className={`font-bold mb-2  ${style.rojo}`}>Nombre:</p>
            <p className={`rounded-md pl-3 mb-3 ${style.labelF}`}>
              {user ? user.nombre : 'Cargando...'}
            </p>
          </div>
          <div className=''>
            <p className={`font-bold mb-2  ${style.rojo}`}>RFC:</p>
            <p className={`rounded-md mb-3 pl-3 ${style.labelF}`}>
              {user ? user.RFC : 'Cargando...'}
            </p>
          </div>
          <div className=''>
            <p className={`font-bold mb-2  ${style.rojo}`}>Direccion:</p>
            <p className={`rounded-md mb-3 pl-3 ${style.labelF}`}>
              {user ? user.direccion : 'Cargando...'}
            </p>
          </div>
          <div className=''>
            <p className={`font-bold mb-2  ${style.rojo}`}>Edad:</p>
            <p className={`rounded-md mb-3 pl-3 ${style.labelF}`}>{user ? user.edad : 'Cargando...'}</p>
          </div>
        </div>
        <hr/>
        <div className='w-1/2'>
          <CardU />
        </div>
      </div>
    </div>
  );
};

export default PersonalData;
