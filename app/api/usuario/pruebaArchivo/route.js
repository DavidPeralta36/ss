// api/upload.js
import { NextResponse } from "next/server";
import {writeFile, mkdir} from 'fs/promises'
import path from "path";
//import { writeFile } from "fs";

export async function POST(req, res) {
    try {
        
        const data = await req.formData()
        const file = data.get('file')
        const rfcUsr = data.get('RFC')
        const nombreCursoUsr = data.get('nombreCurso')
        const tipoCursoUsr = data.get('tipoCurso')

        if (!rfcUsr || !nombreCursoUsr || !tipoCursoUsr) {
            return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios' }), { status: 400 });
        }

        const body = {
            RFC: rfcUsr,
            nombreCurso: nombreCursoUsr,
            tipoCurso: tipoCursoUsr,
            certificado: null
        }
        console.log(body)

        const user = await prisma.usrs.findUnique({
          where: { RFC: rfcUsr },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 });
        }

        console.log(user)

        if(file != 'null'){
            console.log(file)
            body.certificado = file.name
            const bytesFile = await file.arrayBuffer()
            const bufferFile = Buffer.from(bytesFile)
            
            const directoryPath = path.join(process.cwd(), '/app/resources');
            const directoryUsrPath = path.join(directoryPath,user.id.toString(),'cursos')
            const filePath = path.join(directoryUsrPath, file.name);

            //const filePath = path.join(process.cwd(), '/app/resources', user.id.toString(), 'cursos', file.name);
            console.log(filePath)

            // Crea el directorio si no existe
            await mkdir(directoryPath, { recursive: true });
            await mkdir(directoryUsrPath, { recursive: true });

            await writeFile(filePath, bufferFile);
        }

        const newCurso = await prisma.cursos.create({
            data: body,
          });

        console.log(newCurso)
        
        //return NextResponse.json(JSON.stringify({ message: 'Archivo recibido exitosamente' }));
        return new Response(JSON.stringify({
            message:'uplading'
        }))
    } catch (error) {
        console.log(error)
        console.error('Error al procesar el archivo en el servidor:', error);
        return NextResponse.error(error.message, { status: 500 });
    }
}

