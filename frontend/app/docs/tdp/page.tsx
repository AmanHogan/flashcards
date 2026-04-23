"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default function TdpDocsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">TDP Commitments Overview</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Partner Impact Commitment #1</CardTitle>
            <CardDescription>
              Deliver measurable business impact through your Business Partner assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 font-medium">Goals / Measures (WHAT & HOW)</p>
            <p className="mb-2">
              Share at least three accomplishments and clearly describe how each one added business value (e.g.,
              improved outcomes, increased efficiency, reduced risk/cost, or enhanced customer/employee experience).
            </p>
            <p className="mb-2 font-medium">Validation / Completion Criteria</p>
            <ul className="ml-4 list-disc">
              <li>Recorded at least three distinct accomplishments during Business Partner assignment.</li>
              <li>
                For each accomplishment: what you did, the problem/opportunity, who benefited, why it mattered,
                measurable impact, and value category.
              </li>
            </ul>
            <p className="mt-3 font-medium">Tips</p>
            <ul className="ml-4 list-disc">
              <li>Ask your Business Partners what key deliverables they expect this year.</li>
              <li>Think how your work ties to ATS transformational initiatives and 2026 priorities.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AT&T / TDP Program Impact Commitment #2</CardTitle>
            <CardDescription>
              Build your personal brand by participating in TDP and AT&T opportunities beyond your primary assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 font-medium">Goals / Measures (WHAT & HOW)</p>
            <p className="mb-2">
              Provide at least three examples of how you distinguished yourself and engaged within TDP; attend and
              participate in TDP experience events throughout the year.
            </p>
            <p className="mb-2 font-medium">Validation / Completion Criteria</p>
            <ul className="ml-4 list-disc">
              <li>Documented at least three examples showing how you strengthened your professional brand.</li>
              <li>List attended TDP experience events with dates and participation details.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TDP Development Commitment #1</CardTitle>
            <CardDescription>
              Build track‑aligned technical skills, AI capabilities, business knowledge, and leadership skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 font-medium">Goals / Measures (WHAT & HOW)</p>
            <p className="mb-2">
              Complete Purpose‑Driven training across technical, AI, leadership, and business areas; complete assigned
              GrowthHub and mandatory corporate training.
            </p>
            <p className="mb-2 font-medium">Validation / Completion Criteria</p>
            <p>
              Track development progress in monthly 1x1s with your AD and document completed courses for reviews and
              progression submissions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TDP Development (Innovation) Commitment #2</CardTitle>
            <CardDescription>
              Complete at least two innovation events or hackathons per year to demonstrate initiative and practical
              application of new skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 font-medium">Goals / Measures</p>
            <p className="mb-2">
              Participate in at least two innovation events per year (one in Jan–Jun, one in Jul–Dec). Examples include
              hackathons, symposiums, bounty events, and local lab projects.
            </p>
            <p className="mb-2 font-medium">Validation / Completion Criteria</p>
            <ul className="ml-4 list-disc">
              <li>Hackathons validated by end-to-end participation and final demo.</li>
              <li>Local lab projects validated by national AD Leads via demo or recorded evidence.</li>
              <li>IIC Coach validated by patent submission with intern team.</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Important: Failing to complete required innovation events per half‑year can affect performance ratings.
              Coordinate with your AD for approvals and timelines.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
