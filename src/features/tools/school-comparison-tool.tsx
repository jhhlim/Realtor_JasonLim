"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MOCK_SCHOOLS = [
  {
    id: "msj",
    name: "Mission San Jose High",
    city: "Fremont",
    type: "Public high",
    rating: 9,
    api: 92,
  },
  {
    id: "lynbrook",
    name: "Lynbrook High",
    city: "San Jose",
    type: "Public high",
    rating: 9,
    api: 91,
  },
  {
    id: "monta-vista",
    name: "Monta Vista High",
    city: "Cupertino",
    type: "Public high",
    rating: 10,
    api: 94,
  },
  {
    id: "homestead",
    name: "Homestead High",
    city: "Cupertino",
    type: "Public high",
    rating: 9,
    api: 90,
  },
] as const;

export function SchoolComparisonTool() {
  const [a, setA] = React.useState("monta-vista");
  const [b, setB] = React.useState("msj");

  const left = MOCK_SCHOOLS.find((s) => s.id === a)!;
  const right = MOCK_SCHOOLS.find((s) => s.id === b)!;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-dashed border-border bg-slate-soft/50 px-5 py-4 text-sm text-muted-foreground dark:bg-secondary/30">
        Placeholder comparison UI — wire GreatSchools / CA Dept of Education feeds when
        licensed. Ratings below are illustrative only.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["school-a", "School A", a, setA],
            ["school-b", "School B", b, setB],
          ] as const
        ).map(([id, label, value, setter]) => (
          <div key={id} className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Select value={value} onValueChange={setter}>
              <SelectTrigger id={id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_SCHOOLS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[left, right].map((school) => (
          <Card key={school.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{school.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {school.city} · {school.type}
                  </p>
                </div>
                <Badge variant="accent">★ {school.rating}/10</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Illustrative API score</span>
                <span className="font-semibold">{school.api}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Boundary check</span>
                <span className="font-medium">Coming soon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commute overlay</span>
                <span className="font-medium">Coming soon</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
