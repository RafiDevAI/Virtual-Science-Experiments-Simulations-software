"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useProgress } from "@/hooks/use-progress"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ExperimentCompletionButtonProps {
  experimentId: string
  experimentTitle: string
}

export function ExperimentCompletionButton({ experimentId, experimentTitle }: ExperimentCompletionButtonProps) {
  const { markAsComplete, getProgress, user } = useProgress()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const progress = getProgress(experimentId)
  const isCompleted = progress?.completed || false

  const handleComplete = async () => {
    setIsLoading(true)
    await markAsComplete(experimentId)
    setIsLoading(false)
    router.refresh()
  }

  if (!user) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="lg" className="w-full bg-transparent">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in to track progress</AlertDialogTitle>
            <AlertDialogDescription>
              Create an account or sign in to save your experiment progress and track your learning journey.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/auth/login")}>Sign In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  if (isCompleted) {
    return (
      <Button variant="outline" size="lg" className="w-full bg-transparent" disabled>
        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
        Completed
      </Button>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="w-full">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark as Complete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete this experiment?</AlertDialogTitle>
          <AlertDialogDescription>
            Mark "{experimentTitle}" as complete. This will update your progress and you can always review it later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleComplete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Mark Complete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
