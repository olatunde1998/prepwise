"use server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { feedbackSchema } from "@/constants";
import prisma from "@/lib/prisma";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories...
        Transcript:
        ${formattedTranscript}
      `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = await prisma.feedback.create({
      data: {
        interviewId,
        userId,
        totalScore: object.totalScore,
        categoryScores: object.categoryScores,
        strengths: object.strengths,
        areasForImprovement: object.areasForImprovement,
        finalAssessment: object.finalAssessment,
      },
    });

    return { success: true, feedbackId: feedback.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string) {
  return await prisma.interview.findUnique({
    where: { id },
  });
}


export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
) {
  const { interviewId, userId } = params;

  return await prisma.feedback.findFirst({
    where: {
      interviewId,
      userId,
    },
  });
}


export async function getLatestInterviews(params: GetLatestInterviewsParams) {
  const { userId, limit = 20 } = params;

  return await prisma.interview.findMany({
    where: {
      finalized: true,
      NOT: { userId },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}


export async function getInterviewsByUserId(userId: string) {
  return await prisma.interview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

