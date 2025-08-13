"use client"

import Link from "next/link"
import { useState } from "react"
import { PERSONIL } from "@/lib/personil"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function PersonilPage() {
  const [q, setQ] = useState("")
  const list = PERSONIL.filter((p) =>
    (p.name + " " + p.role + " " + (p.idNumber || "") + " " + (p.company || "") + " " + (p.partner || "")).toLowerCase().includes(q.toLowerCase())
  )

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Personil</h1>
        <div className="w-full max-w-sm ml-auto">
          <Input
            placeholder="Cari nama, jabatan, No. ID, perusahaan, atau partner..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {list.map((p) => (
          <Link key={p.slug} href={`/personil/${p.slug}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="items-center text-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={p.avatar} alt={p.name} />
                  <AvatarFallback>
                    {p.name
                      .split(" ")
                      .map((s) => s[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-base mt-2">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground -mt-4 space-y-2">
                <div>{p.role}</div>
                {p.idNumber && <div className="text-xs">No. ID: {p.idNumber}</div>}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {p.company && <Badge variant="secondary" className="text-xs">{p.company}</Badge>}
                  {p.partner && <Badge className="text-xs">Partner: {p.partner}</Badge>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}