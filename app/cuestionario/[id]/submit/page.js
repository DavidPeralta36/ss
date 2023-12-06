"use client";

import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import React, { cache, use } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PlusIcon } from "@/app/components/icons/PlusIcon";
import { LuSave } from "react-icons/lu";
import { toast } from "react-toastify";
import CardRespUsuario from "./cardRespUsuario";
import { useSession } from "next-auth/react";


const getQuestions = (id) => {
  // Ensure you return the promise from fetch
  return fetch(`/api/cuestionario/pregunta/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    // Check for a successful response (status code 200)
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`);
    }
    // Parse the response as JSON
    return res.json();
  });
};

const getAnswers = () => {
  // Ensure you return the promise from fetch
  return fetch(`/api/cuestionario/respuesta`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    // Check for a successful response (status code 200)
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`);
    }
    // Parse the response as JSON
    return res.json();
  });
};

export default function Page() {
  const [questionData, setQuestionData] = useState([]);
  const [answerData, setAnswerData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const parts = pathname.split("/");
  const id = parseInt(parts[2], 10); // Che metodo sucio para sacar el link ajsjas
  

  const fetchData = async () => {
    try {
      // Assuming getSurveys returns an array of questions objects
      const questions = await getQuestions(id);
      const answers = await getAnswers();

      setAnswerData(answers);
      setQuestionData(questions);
    } catch (error) {
      // Handle error if needed
      console.error("Error fetching data:", error);
    }
  };

  const getAllUserAnswers = (questionId, answers) => {
    setUserAnswers((prevUserAnswers) => ({
      ...prevUserAnswers,
      [questionId]: answers,
    }));
  };

  const saveUserAnswerData = async () => {
    let allRequestsSuccessful = true;
    const usuario_id= session.user.id;

    const userAnswersWithSurveyId = {
      userAnswers: userAnswers, // Add a new property named userAnswers
      survey_id: id,             // Add the new property survey_id with the value of id
    };

    try {
      const questionResponse = await fetch(
        `/api/cuestionario/respuesta_usuario/${usuario_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userAnswersWithSurveyId),
        }
      );

      // Check if the request was successful
      if (!questionResponse.ok) {
        console.error(`Failed to save user answers for id ${usuario_id}`);
        allRequestsSuccessful = false;
        // Handle error as needed
      }

      if (allRequestsSuccessful) {
        console.log("All user answers saved successfully!");
        toast.success("Respuestas guardados con exito.");
      } else {
        console.error(
          "Some requests failed. Survey data not saved completely."
        );
        toast.error(
          "Hubo un error al guardar las respuestas, intente de nuevo..."
        );
      }
    } catch (error) {
      console.error("Error saving user answers:", error);
    }
  };


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch data when the component mounts

  return (
    <>
      <Card className="mx-auto my-auto flex-1 min-h-[80vh]">
        <CardHeader className="flex items-center justify-center">
          <h2 className="text-md">Encuesta</h2>
        </CardHeader>
        <CardBody>
          {questionData.map((question, index) => {
            return (
              <CardRespUsuario
                key={question.question_id}
                index={index}
                pregunta={question}
                respuesta={answerData}
                getAllUserAnswers={(answers) =>
                  getAllUserAnswers(question.question_id, answers)
                }
                setRespuesta={setAnswerData}
              />
            );
          })}

          <div className="flex justify-around">
            <div className="w-1/5"></div>
            <div className="w-1/5">
              <Button
                className="w-full"
                color="success"
                endContent={<LuSave />}
                onClick={saveUserAnswerData}
              >
                Guardar respuestas
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
