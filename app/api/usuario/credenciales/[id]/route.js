// pages/api/usuarios/experienciaLaboral.js
import { NextResponse } from "next/server";
import {writeFile, mkdir} from 'fs/promises'
import path from "path";
import prisma from "@/app/components/db";
import { data } from "autoprefixer";
import { hash } from "bcrypt";

export async function PUT(req, { params }) {
  try {
    const data = await req.formData()

    const id = parseInt(params.id)
    const nombre = data.get('nombre')
    const username = data.get('username')
    const password = data.get('password')

    const hashedPassword = await hash(password, 10)
    
    
    const body = {
      id,
      nombre,
      username,
      password: hashedPassword
    }
    console.log(body)
    
    const updatedUser = await prisma.usrs.upsert({
      where: { id: parseInt(id) },
      update: body,
      create: body,
    });
    return NextResponse.json(updatedUser);
    
  } catch (error) {
    console.log(data)
    console.log(error)
    return NextResponse.error(error.message, { status: 500 });
  }
}