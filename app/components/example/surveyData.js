const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export const getAllSurveys = async () => {
  try {
    const allSurveys = await prisma.surveys.findMany();
    return allSurveys;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    throw error;
  }
};

export const createSurvey = async (surveyData) => {
  try {
    const survey = await prisma.surveys.create({
      data: surveyData,
    });

    return survey;
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Survey with the same title already exists");
    }
    throw error;
  }
};
