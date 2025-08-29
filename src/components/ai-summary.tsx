"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateEventSummary } from "@/ai/flows/generate-event-summary";
import type { Booking, Event, User } from "@/lib/types";

interface AiSummaryProps {
  bookings: Booking[];
  events: Event[];
  users: User[];
}

export default function AiSummary({ bookings, events, users }: AiSummaryProps) {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const eventData = `
        Total Events: ${events.length}
        Total Bookings: ${bookings.length}
        Total Users: ${users.length}

        Detailed Bookings:
        ${bookings
          .map((b) => {
            const event = events.find((e) => e.id === b.eventId);
            const parent = users.find((u) => u.id === b.parentId);
            const teacher = users.find((u) => u.id === b.teacherId);
            return `- Event: ${event?.title}, Parent: ${parent?.name}, Teacher: ${teacher?.name}, Time: ${b.startTime.toLocaleString()}, Status: ${b.status}`;
          })
          .join("\n")}
      `;

      const result = await generateEventSummary({ eventData });
      setSummary(result.summary);
    } catch (e) {
      setError("Failed to generate summary. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle className="font-headline">AI Event Summary</CardTitle>
        </div>
        <CardDescription>
          Get quick insights into attendance and booking trends.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-2">
            <div className="bg-muted animate-pulse h-4 w-full rounded-md" />
            <div className="bg-muted animate-pulse h-4 w-5/6 rounded-md" />
            <div className="bg-muted animate-pulse h-4 w-3/4 rounded-md" />
            <p className="text-sm text-muted-foreground text-center pt-2">AI is analyzing the data...</p>
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {summary && (
          <div className="text-sm text-foreground/90 whitespace-pre-wrap bg-primary/5 p-4 rounded-lg border border-primary/20">
            {summary}
          </div>
        )}
        {!summary && !isLoading && (
            <div className="text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
                Click the button to generate an AI-powered summary of event data.
            </div>
        )}
        <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Summary"}
        </Button>
      </CardContent>
    </Card>
  );
}
