"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as yup from "yup";

interface RequirementFormProps {
  setShowRequirementForm?: any;
  userId: string;
}

// Validation Schema
const schema = yup.object().shape({
  role: yup.string().required("Role is required"),
  level: yup.string().required("Level is required"),
  techstack: yup.string().required("techstack is required"),
  type: yup.string().required("Interview Type is required"),
  amount: yup
    .number()
    .required("Number of Questions is required")
    .positive("Amount must be a positive number")
    .integer("Amount must be an integer"),
});

export function RequirementForm({
  setShowRequirementForm,
  userId,
}: RequirementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  // REACT HOOK FORM LOGIC
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const payload = {
        ...data,
        userid: userId,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
      setShowRequirementForm(false);
    }
  };

  return (
    <div className="w-full md:min-w-[425px] p-5 dark:border-muted bg-background rounded-lg mx-auto mb-4">
      <section className="sm:max-w-[425px]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold">Customize Your Interview Prep</p>
            <button
              onClick={() => setShowRequirementForm(false)}
              className="rounded-md gap-6 p-2 cursor-pointer hover:bg-muted/80 transition-colors duration-200"
            >
              <X />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="role-1">Role</Label>
              <Input
                id="role"
                placeholder="Frontend Software Engineer"
                {...register("role")}
                className="placeholder:text-sidebar-ring"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                placeholder="Junior"
                {...register("level")}
                className="placeholder:text-sidebar-ring"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="techstack">TechStack</Label>
              <Input
                id="techstack"
                placeholder="NextJs"
                {...register("techstack")}
                className="placeholder:text-sidebar-ring"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="type">Interview Type</Label>
              <Input
                id="type"
                placeholder="Technical"
                {...register("type")}
                className="placeholder:text-sidebar-ring"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Number of Questions</Label>
              <Input
                id="amount"
                placeholder="5"
                {...register("amount")}
                className="placeholder:text-sidebar-ring"
              />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2 pt-6">
            <div
              onClick={() => setShowRequirementForm(false)}
              className="w-fit cursor-pointer border border-muted rounded-md px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors duration-200"
            >
              Cancel
            </div>
            <Button type="submit" className="cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin duration-500" />
                  Loading...
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
