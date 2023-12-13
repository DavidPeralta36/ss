// pages/api/usuarios/experienciaLaboral.js
import { NextResponse } from "next/server";
import {writeFile, mkdir} from 'fs/promises'
import path from "path";
import prisma from "@/app/components/db";
import { data } from "autoprefixer";


export async function PUT(req, { params }) {
  try {
    const fs = require('fs');
    const data = await req.formData()

    const file = data.get('file')
    const id = params.id;
    var fileName = ""  
    const user = await prisma.usrs.findUnique({
      where: { id: parseInt(id) },
    });


    if(file != 'null'){
      console.log(file)
      fileName = file.name
      const bytesFile = await file.arrayBuffer()
      const bufferFile = Buffer.from(bytesFile)

      const directoryPath = path.join(process.cwd(), '/app/resources');
      const directoryUsrPath = path.join(directoryPath,user.id.toString(),'profilePick')
      const filePath = path.join(directoryUsrPath, fileName);

      //const filePath = path.join(process.cwd(), '/app/resources', user.id.toString(), 'cursos', file.name);
      console.log(filePath)

      // Crea el directorio si no existe
      await mkdir(directoryPath, { recursive: true });
      await mkdir(directoryUsrPath, { recursive: true });

      await writeFile(filePath, bufferFile);
    } 

    const body = {
      img: fileName
    }


    const updatedUser = await prisma.usrs.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json(updatedUser);
    
  } catch (error) {
    console.log(data)
    console.log(error)
    return NextResponse.error(error.message, { status: 500 });
  }
}