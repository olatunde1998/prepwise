"use client";
import { RequirementForm } from "@/components/RequirementForm";
import InterviewCard from "@/components/InterviewCard";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/Modal";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  const { data: userInterviews } = useQuery({
    queryKey: ["userInterviews", userId],
    queryFn: () => getInterviewsByUserId(userId),
    enabled: !!userId,
  });

  const { data: allInterview } = useQuery({
    queryKey: ["latestInterviews", userId],
    queryFn: () => getLatestInterviews({ userId }),
    enabled: !!userId,
  });

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      <section className="flex flex-row bg-gradient-to-b from-[#171532] to-[#08090D] rounded-3xl px-16 py-6 items-center justify-between max-sm:px-4">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>
          <div className="flex flex-row gap-4 max-sm:flex-col">
            <div
              className="text-center flex items-center justify-center text-sm   w-fit bg-primary-200 text-dark-100 hover:bg-primary-200/80 rounded-full font-bold px-5 cursor-pointer min-h-10 max-sm:w-full"
              onClick={() => setShowRequirementForm(true)}
            >
              Start an Interview
            </div>
            <div
              className="text-center flex items-center justify-center text-sm   w-fit bg-primary-200 text-dark-100 hover:bg-primary-200/80 rounded-full font-bold px-5 cursor-pointer min-h-10 max-sm:w-full"
              onClick={() => setShowRequirementForm(true)}
            >
              Start an Interview
            </div>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 w-full items-stretch">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 w-full items-stretch">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>

      <Modal
        show={showRequirementForm}
        onClose={() => setShowRequirementForm(false)}
      >
        <RequirementForm
          setShowRequirementForm={setShowRequirementForm}
          userId={userId}
        />
      </Modal>
    </>
  );
}
